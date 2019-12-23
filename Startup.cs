using System;
using Deepcove_Trust_Website.Features.Emails;
using Deepcove_Trust_Website.Features.RazorRender;
using Deepcove_Trust_Website.Middleware;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using reCAPTCHA.AspNetCore;

namespace Deepcove_Trust_Website
{
    public class Startup
    {
        public IConfiguration Configuration { get; }
        private IHostingEnvironment Env { get; }

        public Startup(IConfiguration configuration,IHostingEnvironment env)
        {
            Configuration = configuration;
            Env = env;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<CookiePolicyOptions>(options =>
            {
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });


            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2).AddJsonOptions(options => {
                options.SerializerSettings.Converters.Add(new Newtonsoft.Json.Converters.StringEnumConverter());
                options.SerializerSettings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
            });

            // Database Config
            string dburl = Environment.GetEnvironmentVariable("DATABASE_URL");
            if (Configuration.GetSection("ConnectionStrings").GetValue<string>("Use") == "MsSqlConnection")
            {
                services.AddDbContext<Data.WebsiteDataContext>(options =>
                    options.UseSqlServer(!string.IsNullOrEmpty(dburl) ? dburl : Configuration.GetConnectionString("MsSqlConnection")), ServiceLifetime.Scoped);
            } 
            else
            {
                services.AddDbContext<Data.WebsiteDataContext>(options =>
                    options.UseMySql(!string.IsNullOrEmpty(dburl) ? dburl : Configuration.GetConnectionString("MySqlConnection")), ServiceLifetime.Scoped);
            }

            // Email Config
            services.AddSingleton<IEmailConfiguration>(Configuration.GetSection("EmailConfiguration").Get<EmailConfiguration>());
            services.AddTransient<IEmailService, EmailService>();

            // Razor Render Config
            services.Configure<RazorViewEngineOptions>(x => x.ViewLocationExpanders.Add(new ViewLocationExpander()));
            services.AddTransient<IViewRenderer, ViewRenderer>();
            services.AddTransient<WebSettingsService>();
            services.AddTransient<NavbarService>();

            // Login services
            services.AddScoped<IPasswordHasher<Models.Account>, PasswordHasher<Models.Account>>();
            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                .AddCookie(options => {
                    options.LoginPath = "/login";
                    options.ExpireTimeSpan = TimeSpan.FromMinutes(30);
                    options.AccessDeniedPath = "/"; 
                });

            services.Configure<RecaptchaSettings>(Configuration.GetSection("RecaptchaSettings"));
            services.AddTransient<IRecaptchaService, RecaptchaService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            });

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
                app.UseDeveloperExceptionMails();
            }

            
            app.UseStaticFiles();
            app.UseCookiePolicy();
            app.UseAuthentication();
            app.UseLogoutInactiveAccounts();
            app.UseRequirePasswordReset();
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Website}/{action=HomePage}/{id?}");
            });
        }
    }
}
