using LearningManagementSystem.Models;
using LearningManagementSystem.Models.DTOs;
using LearningManagementSystem.Services.IServices;

namespace LearningManagementSystem.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly EmployeeRepository _employeeRepository;
        private readonly ResponseDTO _responseDTO;
        private readonly ITokenGenerator _tokenGenerator;


        public EmployeeService(EmployeeRepository employeeRepository, ResponseDTO responseDTO, ITokenGenerator tokenGenerator)
        {
            _responseDTO = responseDTO;
            _employeeRepository = employeeRepository;
            _tokenGenerator = tokenGenerator;
        }

        public async Task<ResponseDTO> DeleteAsync(int id)
        {
            try
            {
                bool isDeleted = await _employeeRepository.DeleteEmployeeAsync(id);
                return GenerateResponse(isDeleted, "Employee Deleted Successfully,", "Failed to Delete Employee.");
            }
            catch (Exception ex)
            {
                return HandleException(ex, "An error occurred while deleting course progress.");
            }
        }

        public async Task<ResponseDTO> GetAllEmployeesAsync()
        {
            try
            {
                var employees = await _employeeRepository.GetAllEmployeesAsync();
                return GenerateResponse(true, "Employees retrieved successfully.", "Failed to retrive employees data", employees);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "An error occurred while retrieving employees.");
            }
        }

        public async Task<ResponseDTO> GetEmployeeByIdAsync(int id)
        {
            try
            {
                var employee = await _employeeRepository.GetEmployeeByIDAsync(id);
                if (employee != null)
                {
                    return GenerateResponse(true, "Employee retrieved successfully.", "Failed to retrive employee data",employee);
                }
                else
                {
                    return GenerateResponse(false, null, "Employee not found.");
                }
            }
            catch (Exception ex)
            {
                return HandleException(ex, "An error occurred while retrieving the employee.");
            }
        }

        public async Task<LoginResponseDTO> LoginAsync(LoginRequestDTO request)
        {
            try
            {
                var loginResult = await _employeeRepository.LoginAsync(request);
                if (loginResult)
                {
                    Employee employee = new Employee();
                    employee =await _employeeRepository.GetEmployeeByEmail(request.Email);
                    if (employee != null)
                    {
                        return new LoginResponseDTO
                        {
                            isSuccess = true,
                            message = "Login successful.",
                            Token =  _tokenGenerator.GenerateToken(employee, employee.Role),// Token generation logic should be implemented
                            employee = loginResult
                        };
                    }
                    return new LoginResponseDTO
                    {
                        isSuccess = false,
                        message = "Failed to login",
                        Token = null,
                        employee = null
                    };

                }
                else
                {
                    return new LoginResponseDTO
                    {
                        isSuccess = false,
                        message = "Invalid email or password."
                    };
                }
            }
            catch (Exception ex)
            {
                return new LoginResponseDTO
                {
                    isSuccess = false,
                    message = $"An error occurred: {ex.Message}"
                };
            }
        }

        public async Task<ResponseDTO> RegisterAsync(Employee request)
        {
            try
            {
                // Check if employee with the same email already exists
                var employee = await _employeeRepository.GetEmployeeByEmail(request.Email);
                if (employee!= null)
                {
                    return GenerateResponse(false, null, "Employee with the same email already exists.");
                }

                // Create a new Employee object
                var newEmployee = new Employee
                {
                    EmployeeID = request.EmployeeID,
                    Name = request.Name,
                    Designation = request.Designation,
                    TechGroup = request.TechGroup,
                    Role = request.Role,
                    Email = request.Email,
                    Password = request.Password // Password should be hashed before storing
                };

                // Add the new employee to the repository
                bool isAdded = await _employeeRepository.AddEmployeeAsync(newEmployee);
                return GenerateResponse(isAdded, "Employee registered successfully.", "Failed to register employee.");
            }
            catch (Exception ex)
            {
                return HandleException(ex, "An error occurred while registering the employee.");
            }
        }

        public async Task<ResponseDTO> UpdateAsync(int id, Employee request)
        {
            try
            {
                if (await _employeeRepository.EmployeeExistsAsync(id))
                {
                    var employeeToUpdate = new Employee
                    {
                        EmployeeID = id,
                        Name = request.Name,
                        Designation = request.Designation,
                        TechGroup = request.TechGroup,
                        Role = request.Role,
                        Email = request.Email,
                        Password = request.Password // Password should be hashed before storing
                    };

                    bool isUpdated = await _employeeRepository.UpdateEmployeeAsync(employeeToUpdate);
                    return GenerateResponse(isUpdated, "Employee updated successfully.", "Failed to update employee.");
                }
                else
                {
                    return GenerateResponse(false, null, "Employee not found.");
                }
            }
            catch (Exception ex)
            {
                return HandleException(ex, "An error occurred while updating the employee.");
            }
        }

        private ResponseDTO GenerateResponse(bool success, string successMessage, string failureMessage, object data = null)
        {
            return new ResponseDTO
            {
                Success = success,
                Message = success ? successMessage : failureMessage,
                Data = success ? data : null
            };
        }

        // Helper method to handle exceptions
        private ResponseDTO HandleException(Exception ex, string customMessage)
        {
            return new ResponseDTO
            {
                Success = false,
                Message = customMessage,
                Data = ex.Message
            };
        }
    }
}
