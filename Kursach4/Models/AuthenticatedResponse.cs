using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kursach4.Models
{
    public class AuthenticatedResponse
    {
        public string Token { get; set; }
        public string User { get; set; }
        public int Id { get; set; }
        public string Role { get; set; }
    }
}
