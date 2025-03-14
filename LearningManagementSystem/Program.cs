using LearningManagementSystem.Helpers;
using LearningManagementSystem.Repository;
using LearningManagementSystem.Services;
using LearningManagementSystem.Services.IServices;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<DatabaseHelper>();
builder.Services.AddScoped<CourseRequestFormRepository>();
builder.Services.AddScoped<CourseProgressRepository>();


builder.Services.AddScoped<ICourseRequestService, CourseRequestService>();
builder.Services.AddScoped<IBrownBagService, BrownBagService>();
builder.Services.AddScoped<ICourseProgressService, CourseProgressService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
    app.UseSwagger();
    app.UseSwaggerUI();
//}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
