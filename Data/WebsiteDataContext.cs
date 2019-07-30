using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Deepcove_Trust_Website.Models;
using System.Threading.Tasks;
using System.Threading;

namespace Deepcove_Trust_Website.Data
{
    public class WebsiteDataContext : DbContext
    {
        public DbSet<Account> Accounts { get; set; }
        public DbSet<PasswordReset> PasswordReset { get; set; }
        public DbSet<WebsiteSettings> WebsiteSettings { get; set; }

        public WebsiteDataContext(DbContextOptions<WebsiteDataContext> options) : base(options)
        {
            // Temporarily disabled as it seems to prevent database rollbacks.
            // Auto runs migrations
            //Database.Migrate();
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            string dburl = Environment.GetEnvironmentVariable("DATABASE_URL");
            if (!string.IsNullOrEmpty(dburl))
            {
                // Use the URL from the docker file
                optionsBuilder.UseSqlServer(dburl);
            }
            else
            {
                // appsettings.json
                base.OnConfiguring(optionsBuilder);
            }
        }


        // Adds timestamps to database record(s)
        public override int SaveChanges()
        {
            AddTimestamps();
            return base.SaveChanges();
        }

        //Adds timestamps to database record(s)
        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            AddTimestamps();
            return await base.SaveChangesAsync();
        }

        // Adds timestamps to database record(s)
        private void AddTimestamps()
        {
            var entities = ChangeTracker.Entries()
                .Where(x => x.Entity is BaseEntity && (x.State == EntityState.Added || x.State == EntityState.Modified));

            foreach (var entity in entities)
            {
                var now = DateTime.UtcNow;

                if (entity.State == EntityState.Added)
                {
                    ((BaseEntity)entity.Entity).CreatedAt = now;
                }
                ((BaseEntity)entity.Entity).UpdatedAt = now;
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Account>().HasQueryFilter(f => f.DeletedAt == null);
        }
    }
}
