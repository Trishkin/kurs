using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Kursach4.Models
{
    public class User 
    {
        [Key]
        public int Id { get; set; }

        [Column(TypeName = "nvarchar(MAX)")]
        public string Email { get; set; }

        [Column(TypeName = "nvarchar(MAX)")]
        public string Firstname { get; set; }

        [Column(TypeName = "nvarchar(MAX)")]
        public string Lastname { get; set; }

        [Column(TypeName = "varbinary(MAX)")]
        public byte[] Image { get; set; }

        
        [Column(TypeName = "nvarchar(MAX)")]
        public string Password { get; set; }

        [Column(TypeName = "nvarchar(MAX)")]
        public string Role { get; set; }
        [JsonIgnore()]
        public ICollection<Order> Orders { get; set; }
        public User()
        {
            Orders = new List<Order>();
        }
    }
}
