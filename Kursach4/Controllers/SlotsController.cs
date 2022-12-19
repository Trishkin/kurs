using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Kursach4.Context;
using Kursach4.Models;
using Microsoft.AspNetCore.Authorization;

namespace Kursach4.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class SlotsController : ControllerBase
    {
        private readonly ParkingContext _context;

        public SlotsController(ParkingContext context)
        {
            _context = context;
        }

        // GET: api/Slots
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Slot>>> GetSlots()
        {
            CheckDate();
            return await _context.Slots.ToListAsync();
        }

        // GET: api/Slots/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Slot>> GetSlot(int id)
        {
            CheckDate();
            var slot = await _context.Slots.FindAsync(id);

            if (slot == null)
            {
                return NotFound();
            }

            return slot;
        }

        // PUT: api/Slots/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSlot(int id, Slot slot)
        {
            CheckDate();
            if (id != slot.Id)
            {
                return BadRequest();
            }

            _context.Entry(slot).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SlotExists(id))
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

        // POST: api/Slots
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Slot>> PostSlot(Slot slot)
        {
            _context.Slots.Add(slot);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSlot", new { id = slot.Id }, slot);
        }

        // DELETE: api/Slots/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSlot(int id)
        {
            var slot = await _context.Slots.FindAsync(id);
            if (slot == null)
            {
                return NotFound();
            }

            _context.Slots.Remove(slot);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SlotExists(int id)
        {
            return _context.Slots.Any(e => e.Id == id);
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
