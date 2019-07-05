using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Helpers
{
    public static class Utils
    {
        /// <summary>
        /// Generates a random string
        /// </summary>
        /// <param name="totalCharacters">The total number of characters returned</param>
        public static string RandomString(int totalCharacters)
        {
            StringBuilder builder = new StringBuilder();
            Random rnd = new Random();

            for(int i = 0; i < totalCharacters; i++)
                builder.Append(Convert.ToChar(Convert.ToInt32(Math.Floor(26 * rnd.NextDouble() + 65))));


            return builder.ToString().ToLower();
        }
    }
}
