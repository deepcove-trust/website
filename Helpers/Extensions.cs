using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Deepcove_Trust_Website.Helpers
{
    public static class Extensions
    {
        /// <summary>
        /// Gets the users Account Id
        /// </summary>
        /// <returns>(int)Account.Id</returns>
        /// <see cref="Models.Account"/>
        public static int AccountId(this ClaimsPrincipal user) => int.Parse(user.FindFirstValue("Id"));

        /// <summary>
        /// Gets the users Account Name
        /// </summary>
        /// <returns>Account.Name</returns>
        /// <see cref="Models.Account"/>
        public static string AccountName(this ClaimsPrincipal user) => user.FindFirstValue("name");

        /// <summary>
        /// Gets the user Account First Name
        /// </summary>
        /// <returns>Account.Name</returns>
        /// <see cref="Models.Account"/>
        public static string AccountNameFirst(this ClaimsPrincipal user) => user.FindFirstValue("name").Trim().Split(' ')[0];

        /// <summary>
        /// Gets the users Account Email
        /// </summary>
        /// <returns>Account.Email</returns>
        /// <see cref="Models.Account"/>
        public static string AccountEmail(this ClaimsPrincipal user) => user.FindFirstValue("email");

        /// <summary>
        /// Returns the value of a post field
        /// </summary>
        /// <param name="key">POST field name</param>
        public static string Str(this IFormCollection request, string key) => request[key].ToString();

        /// <summary>
        /// Returns the value of a post field as an int
        /// </summary>
        /// <param name="key">POST field name</param>
        public static int Int(this IFormCollection request, string key)
        {
            int.TryParse(request[key].ToString(), out int x);

            return x;
        }

        public static dynamic Deserialize(this IFormCollection request, Type type, string key) => 
            JsonConvert.DeserializeObject(request.Str(key), type);

        /// <summary>
        /// Returns the value of a post field as a boolean.
        /// </summary>
        /// <param name="request"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        public static bool Bool(this IFormCollection request, string key)
        {
            bool.TryParse(request[key].ToString(), out bool x);

            return x;
        }


        /// <summary>
        /// Gets the base URI for the website
        /// </summary>
        /// <returns></returns>
        public static Uri BaseUrl(this HttpRequest request) => new Uri($"{request.Scheme}://{request.Host}");

        public static bool EqualsIgnoreCase(this string s, string other) => s.ToLower() == other.ToLower();
    }
}
