using Dapper;
using LearningManagementSystem.Helpers;
using LearningManagementSystem.Models;

namespace LearningManagementSystem.Repository
{
    public class BrownbagRepository
    {
        private readonly DatabaseHelper _dbHelper;

        public BrownbagRepository(DatabaseHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        public async Task<IEnumerable<Brownbag>> GetAllBrownbags()
        {
            using (var db = _dbHelper.GetConnection())
            {
                var response = await db.QueryAsync<Brownbag>("SELECT * FROM BrownbagRequest");
                return response;
            }
        }

        public async Task<IEnumerable<Brownbag>> GetBrownbagsByEmployeeId(int employeeId)
        {
            using (var db = _dbHelper.GetConnection())
            {
                string sql = "Select * from BrownbagRequest where EmployeeId = @EmployeeId";
                var response = await db.QueryAsync<Brownbag>(sql, new { EmployeeId = employeeId });
                return response;
            }
        }

        public async Task<bool> RequestDateCheckerAsync(DateTime requestDate)
        {
            using (var db = _dbHelper.GetConnection())
            {
                var sql = "SELECT COUNT(*) FROM BrownbagRequest WHERE RequestDate = @RequestDate";
                int requestExists = await db.ExecuteScalarAsync<int>(sql, new { RequestDate = requestDate });
                if (requestExists > 0)
                {
                    return true;
                }
                return false;
            }
        }

        public async Task<int> CreateBrownbag(Brownbag brownbag)
        {
            using (var db = _dbHelper.GetConnection())
            {

                bool requestExists = await RequestDateCheckerAsync(brownbag.RequestDate);

                if (requestExists)
                {
                    Console.WriteLine("There already exists a brownbag session on the choosen date!!");
                    return 0;
                }

                var sql = "INSERT INTO BrownbagRequest (EmployeeId, EmployeeName, TopicType, TopicName, Agenda, SpeakerDescription, RequestDate) VALUES (@EmployeeID, @EmployeeName, @TopicType, @TopicName, @Agenda, @SpeakerDescription, @RequestDate)";
                int response = await db.ExecuteAsync(sql, new
                {
                    brownbag.EmployeeID,
                    brownbag.EmployeeName,
                    brownbag.TopicType,
                    brownbag.TopicName,
                    brownbag.Agenda,
                    brownbag.SpeakerDescription,
                    brownbag.RequestDate,
                });
                return response;
            }
        }

        public async Task<int> UpdateBrownbagByIdAsync(int id, Brownbag brownbag)
        {
            using (var db = _dbHelper.GetConnection())
            {
                bool requestExists = await RequestDateCheckerAsync(brownbag.RequestDate);

                if (requestExists)
                {
                    Console.WriteLine("There already exists a brownbag session on the choosen date!!");
                    return 0;
                }

                var sql = "UPDATE BrownbagRequest SET EmployeeID = @EmployeeId, EmployeeName = @EmployeeName, TopicType = @TopicType, TopicName = @TopicName, Agenda = @Agenda, SpeakerDescription = @SpeakerDescription, RequestDate = @RequestDate, Status = @Status WHERE RequestID = @RequestID";
                int response = db.Execute(sql, new
                {
                    brownbag.EmployeeID,
                    brownbag.EmployeeName,
                    brownbag.TopicType,
                    brownbag.TopicName,
                    brownbag.Agenda,
                    brownbag.SpeakerDescription,
                    brownbag.RequestDate,
                    brownbag.Status,
                    RequestID = id,
                });
                return response;
            }
        }

        public int UpdateBrownbagStatusById(int id, string status)
        {
            using (var db = _dbHelper.GetConnection())
            {
                var sql = "UPDATE BrownbagRequest SET Status = @Status WHERE RequestID = @RequestID";
                int response = db.Execute(sql, new { Status = status, RequestID = id });
                return response;
            }
        }

        public bool ApproveBrownbagById(int id)
        {
            var response = UpdateBrownbagStatusById(id, "Approved");
            if (response > 0)
            {
                return true;
            }
            return false;
        }

        public bool RejectBrownbagById(int id)
        {
            var response = UpdateBrownbagStatusById(id, "Rejected");
            if (response > 0)
            {
                return true;
            }
            return false;
        }

        public int DeleteBrownbagById(int id)
        {
            using (var db = _dbHelper.GetConnection())
            {
                var sql = "DELETE FROM BrownbagRequest WHERE RequestID = @RequestID";
                int response = db.Execute(sql, new { RequestID = id });
                return response;
            }
        }

        public Brownbag GetBrownbagById(int id)
        {
            using (var db = _dbHelper.GetConnection())
            {
                var sql = "SELECT * FROM BrownbagRequest WHERE RequestID = @RequestID";
                var response = db.QueryFirstOrDefault<Brownbag>(sql, new { RequestID = id });
                return response;
            }
        }
    }
}
