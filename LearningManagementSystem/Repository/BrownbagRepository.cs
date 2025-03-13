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

        public IEnumerable<Brownbag> GetAllBrownbags()
        {
            using (var db = _dbHelper.GetConnection())
            {
                var response =  db.Query<Brownbag>("SELECT * FROM BrownbagRequest");
                return response;
            }
        }

        public IEnumerable<Brownbag> GetBrownbagsByEmployeeId(int employeeId)
        {
            using (var db = _dbHelper.GetConnection())
            {
                string sql = "Select * from BrownbagRequest where EmployeeId = @EmployeeId";
                var response = db.Query<Brownbag>(sql, new { EmployeeId = employeeId});
                return response;
            }
        }

        public bool RequestDateChecker(DateTime requestDate)
        {
            using (var db = _dbHelper.GetConnection())
            {
                var sql = "SELECT COUNT(*) FROM BrownbagRequest WHERE RequestDate = @RequestDate";
                int requestExists = db.ExecuteScalar<int>(sql, new { RequestDate = requestDate });
                if(requestExists > 0)
                {
                    return true;
                }
                return false;
            }
        }

        public int CreateBrownbag(Brownbag brownbag)
        {
            using (var db = _dbHelper.GetConnection())
            {
                
                bool requestExists = RequestDateChecker(brownbag.RequestDate);

                if (requestExists)
                {
                    Console.WriteLine("There already exists a brownbag session on the choosen date!!");
                    return 0;
                }

                var sql = "INSERT INTO BrownbagRequest (EmployeeId, EmployeeName, TopicType, TopicName, Agenda, SpeakerDescription, RequestDate) VALUES (@EmployeeID, @EmployeeName, @TopicType, @TopicName, @Agenda, @SpeakerDescription, @RequestDate)";
                int response = db.Execute(sql, new
                {
                    brownbag.EmployeeID,
                    brownbag.EmployeeName,
                    brownbag.TopicType,
                    brownbag.TopicName,
                    brownbag.Agenda,
                    brownbag.SpeakerDescription,
                    brownbag.RequestDate
                });
                return response;
            }
        }

        public int UpdateBrownbagById(int id, Brownbag brownbag)
        {
            using (var db = _dbHelper.GetConnection())
            {
                bool requestExists = RequestDateChecker(brownbag.RequestDate);

                if (requestExists)
                {
                    Console.WriteLine("There already exists a brownbag session on the choosen date!!");
                    return 0;
                }

                var sql = "UPDATE BrownbagRequest SET EmployeeID = @EmployeeId, EmployeeName = @EmployeeName, TopicType = @TopicType, TopicName = @TopicName, Agenda = @Agenda, SpeakerDescription = @SpeakerDescription, RequestDate = @RequestDate WHERE RequestID = @RequestID";
                int response = db.Execute(sql, new 
                { brownbag.EmployeeID, brownbag.EmployeeName, brownbag.TopicType, brownbag.TopicName, brownbag.Agenda, brownbag.SpeakerDescription, brownbag.RequestDate, RequestID = id 
                });
                return response;
            }
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
