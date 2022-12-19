using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Kursach4.Models
{
    public class Slot
    {
        [Key]
        public int Id { get; set; }

        [Column(TypeName = "int")]
        public int Number { get; set; }

        [Column(TypeName = "int")]
        public int? ParkingId { get; set; }
        
        public Parking Parking { get; set; }

        [Column(TypeName = "bit")]
        public bool IsOccupied { get; set; }
        [JsonIgnore()]
        public ICollection<Order> Orders { get; set; }
        public Slot()
        {
            Orders = new List<Order>();
        }
    }
}
