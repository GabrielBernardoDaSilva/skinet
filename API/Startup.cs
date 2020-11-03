using System.IO;
using API.Extensions;
using API.Helpers;
using API.Middleware;
using AutoMapper;
using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using StackExchange.Redis;

namespace API
{
    public class Startup
    {
        public IConfiguration _configuration { get; }
        public Startup(IConfiguration configuration)
        {
            _configuration = configuration;
        }


        public void ConfigureDevelopmentServices(IServiceCollection services)
        {

            services.AddDbContext<StoreContext>(options =>
            {
                options.UseSqlite(_configuration.GetConnectionString("Connection"));
            });
            services.AddDbContext<AppIdentityDbContext>(options =>
            {
                options.UseSqlite(_configuration.GetConnectionString("IdentityConnection"));
            });

            ConfigureServices(services);
        }

        public void ConfigureProductionServices(IServiceCollection services)
        {

            services.AddDbContext<StoreContext>(options =>
            {
                options.UseMySql(_configuration.GetConnectionString("Connection"));
            });
            services.AddDbContext<AppIdentityDbContext>(options =>
            {
                options.UseMySql(_configuration.GetConnectionString("IdentityConnection"));
            });

            ConfigureServices(services);
        }



        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllers();

            services.AddAutoMapper(typeof(MappingProfile));

            services.AddDbContext<StoreContext>(options =>
            {
                options.UseSqlite(_configuration.GetConnectionString("Connection"));
            });
            services.AddDbContext<AppIdentityDbContext>(options =>
            {
                options.UseSqlite(_configuration.GetConnectionString("IdentityConnection"));
            });


            services.AddSingleton<IConnectionMultiplexer>(c =>
            {
                var configuration = ConfigurationOptions
                    .Parse(_configuration.GetConnectionString("Redis"), true);
                return ConnectionMultiplexer.Connect(configuration);
            });


            services.ApplicationService();

            services.AddSwaggerDocumentation();

            services.AddIdentityServices(_configuration);

            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200");

                });
            });


        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {

            app.UseMiddleware<ExceptionMiddleware>();
            app.UseStatusCodePagesWithReExecute("/errors/{0}");

            app.UseHttpsRedirection();

            app.UseRouting();
            app.UseStaticFiles();
            app.UseStaticFiles(
                new StaticFileOptions
                {
                    FileProvider = new PhysicalFileProvider(
                        Path.Combine(Directory.GetCurrentDirectory(), "Content")
                    ),
                    RequestPath = "/content"
                }
            );

            app.UseCors("CorsPolicy");

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseSwaggerDocumentation();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapFallbackToController("Index", "Fallback");
            });
        }
    }
}
