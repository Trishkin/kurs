using Kursach4.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kursach4.Models
{
    public class Order  
    {
        [Key]
        public int Id { get; set; }

        [Column(TypeName = "int")]
        public int? UserId { get; set; }
        public User User { get; set; }

        [Column(TypeName = "int")]
        public int? SlotId { get; set; }
        public Slot Slot { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime StartDate { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime EndDate { get; set; }

        [Column(TypeName = "float")]
        public double Price { get; set; }

        [Column(TypeName = "bit")]
        public bool IsComplete { get; set; }
    }
}
