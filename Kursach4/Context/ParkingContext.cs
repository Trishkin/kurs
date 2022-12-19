using Kursach4.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace Kursach4.Context
{
    public class ParkingContext : DbContext
    {
        public ParkingContext(DbContextOptions<ParkingContext> options):base(options)
        {
                      
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Parking> Parking { get; set; }
        public DbSet<Slot> Slots { get; set; }
        public DbSet<Order> Orders { get; set; }
    }
}
