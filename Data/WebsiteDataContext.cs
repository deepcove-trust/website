using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Deepcove_Trust_Website.Models;

namespace Deepcove_Trust_Website.Data
{
    public class WebsiteDataContext : DbContext
    {
        public DbSet<Account> Accounts { get; set; }
        public DbSet<PasswordReset> PasswordReset { get; set; }

        public WebsiteDataContext(DbContextOptions<WebsiteDataContext> options) : base(options)
        {
            // Temporarily disabled as it seems to prevent database rollbacks.
            // Auto runs migrations
            //Database.Migrate();
        }


        // Adds timestamps to database record(s)
        public override int SaveChanges()
        {
            AddTimestamps();
            return base.SaveChanges();
        }

        // Adds timestamps to database record(s)
        //public override async Task<int> SaveChangesAsync()
        //{
        //    AddTimestamps();
        //    return await base.SaveChangesAsync();
        //}
        
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

        }
    }
}
