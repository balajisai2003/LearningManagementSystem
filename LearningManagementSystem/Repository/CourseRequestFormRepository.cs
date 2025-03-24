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

        //public async Task<IEnumerable<CourseRequestForm>> GetAllRequestsAsync()
        //{
        //    using (var db = _dbHelper.GetConnection())
        //    {
        //        return await db.QueryAsync<CourseRequestForm>("SELECT * FROM CourseRequestForm");
        //    }
        //}

        public async Task<IEnumerable<CourseRequestFormWithDetails>> GetAllRequestsAsync()
        {
            using (var db = _dbHelper.GetConnection())
            {
                var sql = @"
            SELECT crf.*, c.*
            FROM CourseRequestForm crf
            JOIN Courses c ON crf.CourseID = c.CourseID";
                var result = await db.QueryAsync<CourseRequestForm, Course, CourseRequestFormWithDetails>(
                    sql,
                    (courseRequestForm, course) =>
                    {
                        return new CourseRequestFormWithDetails
                        {
                            RequestID = courseRequestForm.RequestID,
                            EmployeeID = courseRequestForm.EmployeeID,
                            CourseID = courseRequestForm.CourseID,
                            RequestEmpIDs = courseRequestForm.RequestEmpIDs,
                            RequestDate = courseRequestForm.RequestDate,
                            Status = courseRequestForm.Status,
                            Comments = courseRequestForm.Comments,
                            ImageLink = courseRequestForm.ImageLink,
                            CourseDetails = course
                        };
                    },
                    splitOn: "CourseID"
                );
                return result;
            }
        }


        public async Task<IEnumerable<CourseRequestForm>> GetBulkRequestsAsync()
        {
            using (var dbHelper = _dbHelper.GetConnection())
            {
                string query = "select RequestID,RequestEmpIds from CourseRequestForm";
                List<int> BulkRequests = new List<int>();
                var response = await dbHelper.QueryAsync<BulkResponseHelper>(query);
                foreach (BulkResponseHelper responseHelper in response)
                {
                    List<string> empIds = responseHelper.RequestEmpIds.Split(',').ToList<string>();
                    if (responseHelper.RequestEmpIds.Contains(','))
                    {
                        BulkRequests.Add(responseHelper.RequestID);
                    }
                }
                if (BulkRequests.Count > 0)
                {
                    return await dbHelper.QueryAsync<CourseRequestForm>("SELECT * FROM CourseRequestForm WHERE RequestID IN @RequestID", new { RequestID = BulkRequests });
                }
                else
                {
                    return new List<CourseRequestForm>();
                }
            }
        }

        //public async Task<CourseRequestForm> GetRequestByIdAsync(int id)
        //{
        //    using (var db = _dbHelper.GetConnection())
        //    {
        //        var sql = "SELECT * FROM CourseRequestForm WHERE RequestID = @RequestID";
        //        return await db.QueryFirstOrDefaultAsync<CourseRequestForm>(sql, new { RequestID = id });
        //    }
        //}
        public async Task<CourseRequestFormWithDetails> GetRequestByIdAsync(int id)
        {
            using (var db = _dbHelper.GetConnection())
            {
                var sql = @"
            SELECT crf.*, c.*
            FROM CourseRequestForm crf
            JOIN Courses c ON crf.CourseID = c.CourseID
            WHERE crf.RequestID = @RequestID";
                var result = await db.QueryAsync<CourseRequestForm, Course, CourseRequestFormWithDetails>(
                    sql,
                    (courseRequestForm, course) =>
                    {
                        return new CourseRequestFormWithDetails
                        {
                            RequestID = courseRequestForm.RequestID,
                            EmployeeID = courseRequestForm.EmployeeID,
                            CourseID = courseRequestForm.CourseID,
                            RequestEmpIDs = courseRequestForm.RequestEmpIDs,
                            RequestDate = courseRequestForm.RequestDate,
                            Status = courseRequestForm.Status,
                            Comments = courseRequestForm.Comments,
                            ImageLink = courseRequestForm.ImageLink,
                            CourseDetails = course
                        };
                    },
                    new { RequestID = id },
                    splitOn: "CourseID"
                );
                return result.FirstOrDefault();
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

        public async Task<int> CreateRequestFormAsync(CourseRequestForm form)
        {
            using (var db = _dbHelper.GetConnection())
            {
                var sql = @"
            INSERT INTO CourseRequestForm (EmployeeID, CourseID, RequestEmpIDs, RequestDate, Status, Comments, ImageLink) 
            OUTPUT INSERTED.RequestID
            VALUES (@EmployeeID, @CourseID, @RequestEmpIDs, @RequestDate, @Status, @Comments, @ImageLink)";

                int requestId = await db.ExecuteScalarAsync<int>(sql, form);
                if (requestId > 0)
                {
                    return requestId;
                }
                return -1;
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

    public class BulkResponseHelper
    {
        public int RequestID { get; set; }
        public string RequestEmpIds { get; set; }
    }

    public class CourseRequestFormWithDetails
    {
        public int RequestID { get; set; }
        public int EmployeeID { get; set; }
        public int CourseID { get; set; }
        public string RequestEmpIDs { get; set; }
        public DateTime RequestDate { get; set; }
        public string Status { get; set; }
        public string Comments { get; set; }
        public string ImageLink { get; set; }
        public Course CourseDetails { get; set; }
    }

}
