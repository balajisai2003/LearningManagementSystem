using Dapper;
using LearningManagementSystem.Helpers;
using LearningManagementSystem.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LearningManagementSystem.Repository
{
    public class CourseRequestFormRepository
    {
        private readonly DatabaseHelper _dbHelper;

        public CourseRequestFormRepository(DatabaseHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        public async Task<IEnumerable<CourseRequestForm>> GetAllRequestsAsync()
        {
            using (var db = _dbHelper.GetConnection())
            {
                return await db.QueryAsync<CourseRequestForm>("SELECT * FROM CourseRequestForm");
            }
        }

        public async Task<CourseRequestForm> GetRequestByIdAsync(int id)
        {
            using (var db = _dbHelper.GetConnection()) 
            {
                var sql = "SELECT * FROM CourseRequestForm WHERE RequestID = @RequestID";
                return await db.QueryFirstOrDefaultAsync<CourseRequestForm>(sql, new { RequestID = id });
            }
        }

        public async Task<IEnumerable<CourseRequestForm>> GetRequestsByEmployeeIdAsync(int employeeId)
        {
            using (var db = _dbHelper.GetConnection())
            {
                var sql = "SELECT * FROM CourseRequestForm WHERE EmployeeID = @EmployeeID";
                return await db.QueryAsync<CourseRequestForm>(sql, new { EmployeeID = employeeId });
            }
        }

        public async Task<bool> CreateRequestFormAsync(CourseRequestForm form)
        {
            using (var db = _dbHelper.GetConnection())
            {
                var sql = @"INSERT INTO CourseRequestForm (EmployeeID, CourseID, RequestEmpIDs, RequestDate, Status, Comments, ImageLink) 
                            VALUES (@EmployeeID, @CourseID, @RequestEmpIDs, @RequestDate, @Status, @Comments, @ImageLink)";

                int affectedRows = await db.ExecuteAsync(sql, form);
                return affectedRows > 0;
            }
        }

        public async Task<bool> UpdateRequestFormAsync(int id, CourseRequestForm form)
        {
            using (var db = _dbHelper.GetConnection())
            {
                var sql = @"UPDATE CourseRequestForm 
                            SET EmployeeID = @EmployeeID, CourseID = @CourseID, RequestEmpIDs = @RequestEmpIDs, 
                                RequestDate = @RequestDate, Status = @Status, Comments = @Comments, ImageLink = @ImageLink
                            WHERE RequestID = @RequestID";

                int affectedRows = await db.ExecuteAsync(sql, new { form.EmployeeID, form.CourseID, form.RequestEmpIDs, form.RequestDate, form.Status, form.Comments, form.ImageLink, RequestID = id });
                return affectedRows > 0;
            }
        }

        public async Task<bool> DeleteRequestFormAsync(int id)
        {
            using (var db = _dbHelper.GetConnection())
            {
                var sql = "DELETE FROM CourseRequestForm WHERE RequestID = @RequestID";
                int affectedRows = await db.ExecuteAsync(sql, new { RequestID = id });
                return affectedRows > 0;
            }
        }

        public async Task<bool> UpdateRequestStatusAsync(int requestId, string status)
        {
            using (var db = _dbHelper.GetConnection())
            {
                var sql = "UPDATE CourseRequestForm SET Status = @Status WHERE RequestID = @RequestID";
                int affectedRows = await db.ExecuteAsync(sql, new { Status = status, RequestID = requestId });
                return affectedRows > 0;
            }
        }

        public async Task<bool> ApproveRequestAsync(int requestId)
        {
            return await UpdateRequestStatusAsync(requestId, "Approved");
        }

        public async Task<bool> RejectRequestAsync(int requestId)
        {
            return await UpdateRequestStatusAsync(requestId, "Rejected");
        }
    }
}
