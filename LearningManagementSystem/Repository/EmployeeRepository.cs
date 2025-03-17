using System.Collections.Generic;
using System.Data;
using Dapper;
using LearningManagementSystem.Helpers;
using LearningManagementSystem.Models;
using LearningManagementSystem.Models.DTOs;

public class EmployeeRepository
{
    private readonly DatabaseHelper _dbHelper;

    public EmployeeRepository(DatabaseHelper dbHelper)
    {
        _dbHelper = dbHelper;
    }

    public async Task<Employee> GetEmployeeByIDAsync(int employeeId)
    {
        const string query = "SELECT * FROM Employee WHERE EmployeeID = @EmployeeID";
        using var connection = _dbHelper.GetConnection();
        return await connection.QueryFirstOrDefaultAsync<Employee>(query, new { EmployeeID = employeeId });
    }

    public async Task<IEnumerable<Employee>> GetAllEmployeesAsync()
    {
        const string query = "SELECT * FROM Employee";
        using var connection = _dbHelper.GetConnection();
        return await connection.QueryAsync<Employee>(query);
    }

    public async Task<bool> AddEmployeeAsync(EmpRequestDTO employee)
    {
        const string query = "INSERT INTO Employee (EmployeeID, FirstName, LastName, Email, Phone, DepartmentID) VALUES (@EmployeeID, @FirstName, @LastName, @Email, @Phone, @DepartmentID)";
        using var connection = _dbHelper.GetConnection();
        return await connection.ExecuteAsync(query, employee) > 0;
    }

    public async Task<Employee> GetEmployeeByEmail(string email)
    {
        const string query = "SELECT * FROM Employee WHERE Email = @Email";
        using var connection = _dbHelper.GetConnection();
        return await connection.QueryFirstOrDefaultAsync<Employee>(query, new { Email = email });
    }

    public async Task<bool> UpdateEmployeeAsync(EmpRequestDTO employee)
    {
        const string query = "UPDATE Employee SET FirstName = @FirstName, LastName = @LastName, Email = @Email, Phone = @Phone, DepartmentID = @DepartmentID WHERE EmployeeID = @EmployeeID";
        using var connection = _dbHelper.GetConnection();
        return await connection.ExecuteAsync(query, employee) > 0;
    }
    public async Task<bool> DeleteEmployeeAsync(int employeeId)
    {
        const string query = "DELETE FROM Employee WHERE EmployeeID = @EmployeeID";
        using var connection = _dbHelper.GetConnection();
        return await connection.ExecuteAsync(query, new { EmployeeID = employeeId }) > 0;
    }

    public async Task<bool> EmployeeExistsAsync(int employeeId)
    {
        const string query = "SELECT COUNT(1) FROM Employee WHERE EmployeeID = @EmployeeID";
        using var connection = _dbHelper.GetConnection();
        return await connection.ExecuteScalarAsync<int>(query, new { EmployeeID = employeeId }) > 0;
    }

    public async Task<bool> LoginAsync(LoginRequestDTO loginRequest)
    {
         if(await GetEmployeeByEmail(loginRequest.Email)!=null)
        {
            const string query = "SELECT COUNT(1) FROM Employee WHERE Email = @Email AND Password = @Password";
            using var connection = _dbHelper.GetConnection();
            return await connection.ExecuteScalarAsync<int>(query, new { Email = loginRequest.Email, Password = loginRequest.Password }) > 0;
        }
        return false;

    }



}