using Dapper;
using LearningManagementSystem.Helpers;
using LearningManagementSystem.Models;

namespace LearningManagementSystem.Repository
{
    public class CourseRequestFormRepository
    {
        private readonly DatabaseHelper _dbHelper;

        public CourseRequestFormRepository(DatabaseHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        public IEnumerable<CourseRequestForm> GetAllCourseRequestForms()
        {
            using (var db = _dbHelper.GetConnection())
            {
                return db.Query<CourseRequestForm>("SELECT * FROM CourseRequestForm");
            }
        }

        public int CreateRequestForm(CourseRequestForm form)
        {
            using (var db = _dbHelper.GetConnection())
            {
                var sql = "INSERT INTO CourseRequestForm (EmployeeID, CourseID, RequestEmpIDs, RequestDate, Status, Comments, ImageLink) VALUES (@EmployeeID, @CourseID, @RequestEmpIDs, @RequestDate, @Status, @Comments, @ImageLink)";
                int response = db.Execute(sql, form);
                return response;
            }
        }

        public CourseRequestForm UpdateRequestFormById(int id, CourseRequestForm form)
        {
            using (var db = _dbHelper.GetConnection())
            {
                var sql = "UPDATE CourseRequestForm SET EmployeeID = @EmployeeID, CourseID = @CourseID, RequestEmpIDs = @RequestEmpIDs, RequestDate = @RequestDate, Status = @Status, Comments = @Comments, ImageLink = @ImageLink WHERE RequestID = @RequestID";
                db.Execute(sql, new { form.EmployeeID, form.CourseID, form.RequestEmpIDs, form.RequestDate, form.Status, form.Comments, form.ImageLink, RequestID = id });
                return GetRequestById(id);
            }
        }

        public int DeleteRequestFormById(int id)
        {
            using (var db = _dbHelper.GetConnection())
            {
                var sql = "DELETE FROM CourseRequestForm WHERE RequestID = @RequestID";
                int response = db.Execute(sql, new { RequestID = id });
                return response;
            }
        }

        public CourseRequestForm ApproveRequestForm(int requestId)
        {
            using (var db = _dbHelper.GetConnection())
            {
                var sql = "UPDATE CourseRequestForm SET Status = 'Approved' WHERE RequestID = @RequestID";
                int response = db.Execute(sql, new { RequestID = requestId });

                CourseRequestForm updatedForm = GetRequestById(requestId);
                return updatedForm;

            }
        }

        public CourseRequestForm RejectRequestForm(int requestId)
        {
            using (var db = _dbHelper.GetConnection())
            {
                var sql = "UPDATE CourseRequestForm SET Status = 'Rejected' WHERE RequestID = @RequestID";
                int response = db.Execute(sql, new { RequestID = requestId });

                CourseRequestForm updatedForm = GetRequestById(requestId);
                return updatedForm;
            }
        }

        public List<CourseRequestForm> GetRequests()
        {
            using (var db = _dbHelper.GetConnection())
            {
                var sql = "SELECT * FROM CourseRequestForm";
                List<CourseRequestForm> response =db.Query<CourseRequestForm>(sql).ToList();
                return response;
            }
        }

        public CourseRequestForm GetRequestById(int id)
        {
            using (var db = _dbHelper.GetConnection())
            {
                var sql = "SELECT * FROM CourseRequestForm WHERE RequestID = @RequestID";
                CourseRequestForm response = db.Query<CourseRequestForm>(sql, new { RequestID = id }).FirstOrDefault();
                return response;
            }
        }

        public List<CourseRequestForm> GetRequestsByEmployeeId(int employeeId)
        {
            using (var db = _dbHelper.GetConnection())
            {
                var sql = "SELECT * FROM CourseRequestForm WHERE EmployeeID = @EmployeeID";
                List<CourseRequestForm> response = db.Query<CourseRequestForm>(sql, new { EmployeeID = employeeId }).ToList();
                return response;
            }
        }

    }
}
