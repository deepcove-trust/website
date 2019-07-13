using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Deepcove_Trust_Website;

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

        /// <summary>
        /// Returns a nice date time format  example 13 May, 2019
        /// </summary>
        public static string PrettyDate(DateTime? dateTime)
        {
            if (dateTime == null)
                return "";

            string[] months = new string[] { "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" };

            var x = dateTime ?? DateTime.UtcNow;
            return $"{x.Day} {months[x.Month - 1]}, {x.Year}";
        }

        /// <summary>
        /// Creates a nice string for humans to read
        /// </summary>
        /// <param name="dateTime">Historic time such as CreatedAt time</param>
        /// <param name="lowestUnit">The lowest value to display in the string</param>
        /// <see cref="TimeUnits"/>
        public static string DiffForHumans(DateTime? dateTime)
        {
            // Allows us to pass in null and return nothing
            if (dateTime == null)
                return null;

            // Get the time span between now and then
            TimeSpan s = DateTime.UtcNow.Subtract(dateTime ?? DateTime.UtcNow);

            int dayDiff = (int)s.TotalDays;
            int secDiff = (int)s.TotalSeconds;

            if (dayDiff < 0)
                return null;

            if (dayDiff > 31)
                return "over one month ago";

            if (secDiff < 60)
                return "just now";

            if (secDiff < 120)
                return "1 minute ago";

            if (secDiff < 3600)
                return "in the last hour";

            if (secDiff < 7200)
                return "one hour ago";

            if (secDiff < 86400)
                return string.Format("{0} hours ago",
                    Math.Floor((double)secDiff / 3600));

            if (dayDiff == 1)
                return "yesterday";

            if (dayDiff < 7)
                return string.Format("{0} days ago", dayDiff);

            if (dayDiff < 31)
                return string.Format("{0} weeks ago",
                    Math.Floor((double)dayDiff / 7));

            return null;
        }
    }
}
