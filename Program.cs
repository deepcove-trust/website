using Deepcove_Trust_Website.Data;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;

namespace Deepcove_Trust_Website
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateWebHostBuilder(args).Build();
            
            using(var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var logger = services.GetRequiredService<ILogger<Program>> ();

                try
                {
                    DbInitializer.Initialize(services.GetRequiredService<WebsiteDataContext>());
                    logger.LogInformation("Finished seeding tables.");
                }
                catch (Exception ex)
                {
                    logger.LogError("Error seeding database tables: {0}", ex.Message);
                    logger.LogError("Inner exception: {0}", ex.InnerException.Message);
                    logger.LogError(ex.StackTrace);
                }
            }

            host.Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .ConfigureLogging((hostingContext, logging) => {
                    logging.AddConsole();
                    logging.AddDebug();
                    logging.AddEventSourceLogger();
                }).UseStartup<Startup>();
    }
}
