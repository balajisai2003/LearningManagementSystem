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
                string sql = "Select * from BrownbagRquest where EmpId = @EmpID";
                var response = db.Query<Brownbag>(sql, employeeId);
                return response;
            }
        }

        public int CreateBrownbag(Brownbag brownbag)
        {
            using (var db = _dbHelper.GetConnection())
            {
                var checkSql = "SELECT COUNT(*) FROM BrownbagRequest WHERE RequestDate = @RequestDate";
                int count = db.ExecuteScalar<int>(checkSql, new { brownbag.RequestDate });

                if (count > 0)
                {
                    Console.WriteLine("There already exists a brownbag session on the choosen date!!");
                    return 0;
                }

                var sql = "INSERT INTO BrownbagRequest (EmpID, EmpName, TopicType, TopicName, Agenda, SpeakerDescription, RequestDate) VALUES (@EmpID, @EmpName, @TopicType, @TopicName, @Agenda, @SpeakerDescription, @RequestDate)";
                int response = db.Execute(sql, brownbag);
                return response;
            }
        }

        public int UpdateBrownbagById(int id, Brownbag brownbag)
        {
            using (var db = _dbHelper.GetConnection())
            {
                var checkSql = "SELECT COUNT(*) FROM BrownbagRequest WHERE RequestDate = @RequestDate";
                int count = db.ExecuteScalar<int>(checkSql, new { brownbag.RequestDate });

                if (count > 0)
                {
                    Console.WriteLine("There already exists a brownbag session on the choosen date!!");
                    return 0;
                }

                var sql = "UPDATE BrownbagRequest SET EmpID = @EmpID, EmpName = @EmpName, TopicType = @TopicType, TopicName = @TopicName, Agenda = @Agenda, SpeakerDescription = @SpeakerDescription, RequestDate = @RequestDate WHERE RequestID = @RequestID";
                int response = db.Execute(sql, new { brownbag.EmployeeID, brownbag.EmployeeName, brownbag.TopicType, brownbag.TopicName, brownbag.Agenda, brownbag.SpeakerDescription, brownbag.RequestDate, RequestID = id });
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
