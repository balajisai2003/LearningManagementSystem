using System.Collections.Generic;
using System.Data;
using Dapper;
using LearningManagementSystem.Helpers;
using LearningManagementSystem.Models;

public class EmployeeRepository
{
    private readonly DatabaseHelper _dbHelper;

    public EmployeeRepository(DatabaseHelper dbHelper)
    {
        _dbHelper = dbHelper;
    }

    public IEnumerable<Employee> GetAllEmployees()
    {
        using (var db = _dbHelper.GetConnection())
        {
            return db.Query<Employee>("SELECT * FROM Employee");
        }
    }
}