using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kursach4.Models
{
    public class ViewCreateOrder
    {
        public int parkingId { get; set; }
        public int userID { get; set; }
        public int days { get; set; }
        public int hours { get; set; }
    }
}
