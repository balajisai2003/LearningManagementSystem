using System.Data;
using Npgsql;

namespace LearningManagementSystem.Helpers
{
    public class DatabaseHelper
    {
        private readonly string _connectionString;

        public DatabaseHelper(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("PostgresConnection");
        }

        public IDbConnection GetConnection() => new NpgsqlConnection(_connectionString);
    }
}
