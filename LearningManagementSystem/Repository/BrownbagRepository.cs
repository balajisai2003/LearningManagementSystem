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
                return db.Query<Brownbag>("SELECT * FROM BrownbagRequest");
            }
        }

        public int CreateBrownbag(Brownbag brownbag)
        {
            using (var db = _dbHelper.GetConnection())
            {
                var sql = "INSERT INTO BrownbagRequest (EmpID, EmpName, TopicType, TopicName, Agenda, SpeakerDescription, RequestDate) VALUES (@EmpID, @EmpName, @TopicType, @TopicName, @Agenda, @SpeakerDescription, @RequestDate)";
                int response = db.Execute(sql, brownbag);
                return response;
            }
        }

        public int UpdateBrownbagById(int id, Brownbag brownbag)
        {
            using (var db = _dbHelper.GetConnection())
            {
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
    }
}
