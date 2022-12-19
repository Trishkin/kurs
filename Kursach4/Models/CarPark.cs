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
    public class Parking
    {
        [Key]
        public int Id { get; set; }

        [Column(TypeName = "nvarchar(MAX)")]
        public string Address { get; set; }

        [Column(TypeName = "float")]
        public double PriceHour { get; set; }

        [Column(TypeName = "float")]
        public double PriceDay { get; set; }
        [JsonIgnore()]
        public ICollection<Slot> Slots { get; set; }
        public Parking()
        {
            Slots = new List<Slot>();
        }
    }
}
