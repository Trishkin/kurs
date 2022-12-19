using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Kursach4.Context;
using Kursach4.Models;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace Kursach4.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ParkingContext _context;

        public OrdersController(ParkingContext context)
        {
            _context = context;
        }

        [HttpGet("active")]
        public async Task<ActionResult<IEnumerable<Order>>> RegisterUser([FromQuery] int Id)
        {
            CheckDate();
            var dbOrders =  _context.Orders.Where(x => x.UserId == Id).Include(o => o.Slot).ThenInclude(i => i.Parking).ToList();
            if (dbOrders != null)
            {

                return  dbOrders;
            }
            return  BadRequest("No active orders");
        }

        [HttpPost("close")]
        public async Task<ActionResult<IEnumerable<Order>>> CloseOrder([FromBody] int Id)
        {
            var dbOrder = _context.Orders.FirstOrDefault(x => x.Id == Id);
            if (dbOrder != null)
            {
                dbOrder.EndDate = DateTime.Now;
                dbOrder.IsComplete = true;
                var dbSlot = _context.Slots.FirstOrDefault(x => x.Id == dbOrder.SlotId);
                dbSlot.IsOccupied = false;
                _context.Entry(dbOrder).State = EntityState.Modified;
                _context.Entry(dbSlot).State = EntityState.Modified;
                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!OrderExists(Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return NoContent();
            }
            return BadRequest("Order not found");
        }

        [HttpPost("create")]
        public async Task<ActionResult<IEnumerable<int>>> CreateOrder([FromBody] ViewCreateOrder ViewOrder)
        {
            var dbSlots = _context.Slots.Where(slot => slot.ParkingId == ViewOrder.parkingId).FirstOrDefault(slot => slot.IsOccupied == false);
            if (dbSlots != null && (ViewOrder.days + ViewOrder.hours)>0)
            {
                var parking = _context.Parking.FirstOrDefault(park => park.Id == ViewOrder.parkingId);
                Order order = new Order();
                order.UserId = ViewOrder.userID;
                order.SlotId = dbSlots.Id;
                order.StartDate = DateTime.Now;
                order.EndDate = DateTime.Now.AddDays(ViewOrder.days).AddHours(ViewOrder.hours);
                order.Price = Math.Round(((parking.PriceHour * ViewOrder.hours) + (parking.PriceDay * ViewOrder.days))*100)/100;
                order.IsComplete = false;
                dbSlots.IsOccupied = true;
                _context.Entry(dbSlots).State = EntityState.Modified;
                _context.Orders.Add(order);
                try
                {
                    await _context.SaveChangesAsync();

                    return Ok(dbSlots.Number);
                }
                catch (DbUpdateConcurrencyException)
                {
                        throw;
                }
            }
            return BadRequest("Order not created");
        }
        // GET: api/Orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            CheckDate();
            return await _context.Orders.Include(o => o.Slot).ThenInclude(i => i.Parking).ToListAsync();
        }

        // GET: api/Orders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(int id)
        {
            CheckDate();
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
            {
                return NotFound();
            }

            return order;
        }

        // PUT: api/Orders/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrder(int id, Order order)
        {
            CheckDate();
            if (id != order.Id)
            {
                return BadRequest();
            }

            _context.Entry(order).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Orders
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Order>> PostOrder(Order order)
        {
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOrder", new { id = order.Id }, order);
        }

        // DELETE: api/Orders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OrderExists(int id)
        {
            return _context.Orders.Any(e => e.Id == id);
        }

        private async void CheckDate()
        {
            var dbOrders = _context.Orders.Where(a => a.IsComplete == false && a.EndDate < DateTime.Now);
            if (dbOrders != null)
            {
                foreach (var dbOrder in dbOrders)
                {
                    dbOrder.IsComplete = true;
                    var dbSlot = _context.Slots.FirstOrDefault(x => x.Id == dbOrder.SlotId);
                    dbSlot.IsOccupied = false;
                    _context.Entry(dbOrder).State = EntityState.Modified;
                    _context.Entry(dbSlot).State = EntityState.Modified;
                }
                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    throw;
                }
            }
        }
    }
}
