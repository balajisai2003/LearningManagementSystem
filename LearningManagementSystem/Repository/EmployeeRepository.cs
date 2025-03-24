using System.Collections.Generic;
using System.Data;
using Dapper;
using LearningManagementSystem.Helpers;
using LearningManagementSystem.Models;
using LearningManagementSystem.Models.DTOs;
using LearningManagementSystem.Utils;

public class EmployeeRepository
{
    private readonly DatabaseHelper _dbHelper;

    public EmployeeRepository(DatabaseHelper dbHelper)
    {
        _dbHelper = dbHelper;
    }

    public async Task<Employee> GetEmployeeByIDAsync(int employeeId)
    {
        const string query = "SELECT * FROM Employees WHERE EmployeeID = @EmployeeID";
        using var connection = _dbHelper.GetConnection();
        return await connection.QueryFirstOrDefaultAsync<Employee>(query, new { EmployeeID = employeeId });
    }

    public async Task<IEnumerable<Employee>> GetAllEmployeesAsync()
    {
        const string query = "SELECT * FROM Employees";
        using var connection = _dbHelper.GetConnection();
        return await connection.QueryAsync<Employee>(query);
    }

    public async Task<bool> AddEmployeeAsync(Employee employee)
    {
        const string query = "INSERT INTO Employees (EmployeeID, Name, Designation,TechGroup,Role, Email, Password) VALUES (@EmployeeID, @Name, @Designation, @TechGroup, @Role, @Email,@Password)";
        using var connection = _dbHelper.GetConnection();
        return await connection.ExecuteAsync(query, new
        {
            EmployeeID = employee.EmployeeID,
            Name = employee.Name,
            Designation = employee.Designation,
            TechGroup = employee.TechGroup,
            Role = employee.Role,
            Email = employee.Email,
            Password = employee.Password
        }) > 0;
    }

    public async Task<Employee> GetEmployeeByEmail(string email)
    {
        const string query = "SELECT * FROM Employees WHERE Email = @Email";
        using var connection = _dbHelper.GetConnection();
        return await connection.QueryFirstOrDefaultAsync<Employee>(query, new { Email = email });
    }

    public async Task<bool> UpdateEmployeeAsync(Employee employee)
    {
        const string query = "UPDATE Employees SET Name = @Name, Designation = @Designation, TechGroup = @TechGroup, Role = @Role, Email = @Email, Password = @Password WHERE EmployeeID = @EmployeeID";
        //using var connection = _dbHelper.GetConnection();
        //var resp =  await connection.ExecuteAsync(query, new
        //{
        //    EmployeeID = employee.EmployeeID,
        //    Name = employee.Name,
        //    Designation = employee.Designation,
        //    TechGroup = employee.TechGroup,
        //    Role = employee.Role,
        //    Email = employee.Email,
        //    Password = employee.Password
        //}) > 0;
        var parameters = new DynamicParameters();
        parameters.Add("@EmployeeID", employee.EmployeeID);
        parameters.Add("@Name", employee.Name);
        parameters.Add("@Designation", employee.Designation);
        parameters.Add("@TechGroup", employee.TechGroup);
        parameters.Add("@Role", employee.Role);
        parameters.Add("@Email", employee.Email);
        parameters.Add("@Password", employee.Password);

        using var connection = _dbHelper.GetConnection();
        var resp = await connection.ExecuteAsync(query, parameters) > 0;
        return resp;
    }
    public async Task<bool> DeleteEmployeeAsync(int employeeId)
    {
        const string query = "DELETE FROM Employees WHERE EmployeeID = @EmployeeID";
        using var connection = _dbHelper.GetConnection();
        return await connection.ExecuteAsync(query, new { EmployeeID = employeeId }) > 0;
    }

    public async Task<bool> EmployeeExistsAsync(int employeeId)
    {
        const string query = "SELECT COUNT(1) FROM Employees WHERE EmployeeID = @EmployeeID";
        using var connection = _dbHelper.GetConnection();
        return await connection.ExecuteScalarAsync<int>(query, new { EmployeeID = employeeId }) > 0;
    }

    public async Task<bool> LoginAsync(LoginRequestDTO loginRequest)
    {
        loginRequest.Password = Hasher.PasswordHasher(loginRequest.Password);
         if(await GetEmployeeByEmail(loginRequest.Email)!=null)
        {
            const string query = "SELECT COUNT(1) FROM Employees WHERE Email = @Email AND Password = @Password";
            using var connection = _dbHelper.GetConnection();
            return await connection.ExecuteScalarAsync<int>(query, new { Email = loginRequest.Email, Password = loginRequest.Password }) > 0;
        }
        return false;

    }



}