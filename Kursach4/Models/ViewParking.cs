using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kursach4.Models
{
    public class ViewParking
    {
        public string address { get; set; }
        public double priceHour { get; set; }
        public double priceDay { get; set; }
        public int slots { get; set; }
    }
}
