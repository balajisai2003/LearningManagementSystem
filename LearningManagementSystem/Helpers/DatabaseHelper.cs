using System.Data;
using Microsoft.Data.SqlClient;
using Npgsql;

namespace LearningManagementSystem.Helpers
{
    public class DatabaseHelper
    {
        private readonly string _connectionString;

        public DatabaseHelper(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("AzureConnection");
        }

        public IDbConnection GetConnection() => new SqlConnection(_connectionString);
    }
}
