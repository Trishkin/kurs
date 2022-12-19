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
    public class ParkingsController : ControllerBase
    {
        private readonly ParkingContext _context;

        public ParkingsController(ParkingContext context)
        {
            _context = context;
        }

        // GET: api/Parkings
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Parking>>> GetParking()
        {
            
            return await _context.Parking.ToListAsync();
        }

        [HttpPost("create")]
        public async Task<ActionResult<IEnumerable<int>>> CreateOrder([FromBody] ViewParking ViewParking)
        {
            var dbParking = _context.Parking.FirstOrDefault(a => a.Address == ViewParking.address);
            if (dbParking == null && ViewParking.priceDay >=0 && ViewParking.priceHour >= 0)
            {
                Parking parking = new Parking();
                parking.Address = ViewParking.address;
                parking.PriceDay = ViewParking.priceDay;
                parking.PriceHour = ViewParking.priceHour;

                _context.Parking.Add(parking);
                await _context.SaveChangesAsync();
                dbParking = _context.Parking.FirstOrDefault(a => a.Address == ViewParking.address);
                for (int i = 1; i <= ViewParking.slots; i++)
                {
                    Slot slot = new Slot();
                    slot.Number = i;
                    slot.IsOccupied = false;
                    slot.ParkingId = dbParking.Id;
                    _context.Slots.Add(slot);
                }
                try
                {
                    await _context.SaveChangesAsync();

                    return Ok();
                }
                catch (Exception)
                {
                    throw;
                }
            }
            return BadRequest("Parking not created");
        }

        // GET: api/Parkings/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetParking(int id)
        {
            var parking = await _context.Parking.FindAsync(id);

            if (parking == null)
            {
                return NotFound();
            }

            return Ok(parking);
        }

        // PUT: api/Parkings/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutParking(int id, Parking parking)
        {
            if (id != parking.Id)
            {
                return BadRequest();
            }

            _context.Entry(parking).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ParkingExists(id))
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

        // POST: api/Parkings
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Parking>> PostParking(Parking parking)
        {
            _context.Parking.Add(parking);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetParking", new { id = parking.Id }, parking);
        }

        // DELETE: api/Parkings/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteParking(int id)
        {
            var parking = await _context.Parking.FindAsync(id);
            if (parking == null)
            {
                return NotFound();
            }

            _context.Parking.Remove(parking);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ParkingExists(int id)
        {
            return _context.Parking.Any(e => e.Id == id);
        }
    }
}
