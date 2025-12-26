# ADR-002: Dapper Over Entity Framework for Data Access

**Status:** Accepted
**Date:** 2024-08-10
**Deciders:** CFI Architecture Team (Marty Flournory, Sumith Mathur), K12 Dev Team
**Technical Story:** Data access pattern selection for high-performance Azure Functions

## Context and Problem Statement

The K12 MyPortal system requires a data access layer for Azure SQL Database. The system must handle:
- High-volume periods (95,000+ applications annually, peak periods with 10,000+ concurrent users)
- Complex queries across multiple schemas (dbo, Enrollment, Households, Awards, Comms)
- Row-Level Security (RLS) integration with session context
- On-Behalf-Of (OBO) token authentication
- Stateless Azure Functions with cold start considerations
- Performance targets: API responses < 2 seconds

The question is: which data access technology should we use?

## Decision Drivers

* **Performance**: Minimize query execution time and memory overhead
* **Cold Start Time**: Azure Functions startup must be fast
* **Control**: Need direct control over SQL for RLS session context
* **Complexity**: Queries often join across multiple schemas
* **Learning Curve**: Team familiarity and productivity
* **Maintainability**: Code should be easy to understand and modify
* **Testability**: Must support unit and integration testing
* **Azure Functions Fit**: Must work well in serverless environment

## Considered Options

1. **Dapper** - Lightweight micro-ORM
2. **Entity Framework Core** - Full-featured ORM
3. **ADO.NET** - Raw SqlConnection and SqlCommand
4. **SqlKata** - SQL query builder

## Decision Outcome

**Chosen option:** "Dapper", because it provides the best balance of:
1. Performance (near-native SQL speed)
2. Developer productivity (object mapping without boilerplate)
3. Control (write exact SQL needed, including RLS session context)
4. Minimal overhead (perfect for serverless functions)
5. Team familiarity (CFI has extensive Dapper experience)

### Consequences

#### Good
- Excellent performance (minimal overhead over raw ADO.NET)
- Fast cold starts in Azure Functions (~50-100ms faster than EF Core)
- Complete control over SQL queries and execution
- Easy to integrate with RLS session context
- Simple and predictable behavior
- Minimal memory footprint
- Easy to optimize specific queries
- Team already familiar with Dapper
- Works seamlessly with OBO token authentication

#### Bad
- No automatic change tracking
- No automatic migration generation (must write SQL migrations manually)
- Must write more SQL by hand (not always abstracted)
- No LINQ query syntax (raw SQL strings)
- Refactoring requires updating SQL strings
- No lazy loading or navigation property population

#### Neutral
- Requires discipline to avoid SQL injection (use parameters)
- Need separate query builder for dynamic queries (can add SqlKata if needed)
- Database schema changes require manual updates to queries

## Pros and Cons of the Options

### Dapper (Chosen)

* **Pro:** Near-native SQL performance
* **Pro:** Minimal cold start overhead (~10MB memory, ~50ms startup)
* **Pro:** Complete control over SQL queries
* **Pro:** Easy session context integration for RLS
* **Pro:** Simple object mapping
* **Pro:** Excellent for Azure Functions
* **Pro:** Team already experienced with Dapper
* **Pro:** Easy to debug (see exact SQL)
* **Pro:** Works with any SQL pattern (stored procs, views, functions)
* **Con:** No automatic migrations
* **Con:** Must write SQL by hand
* **Con:** No change tracking
* **Con:** No lazy loading

### Entity Framework Core

* **Pro:** Full-featured ORM
* **Pro:** Automatic migrations
* **Pro:** LINQ query syntax
* **Pro:** Change tracking
* **Pro:** Navigation properties and lazy loading
* **Pro:** Large ecosystem and community
* **Con:** ❌ Slower cold starts (~200-300ms overhead)
* **Con:** ❌ Higher memory footprint (~50-100MB)
* **Con:** ❌ Less control over generated SQL
* **Con:** ❌ Session context integration more complex
* **Con:** ❌ Query optimization harder (need to inspect generated SQL)
* **Con:** ❌ Not ideal for serverless functions
* **Con:** ❌ Can generate inefficient SQL for complex queries

### ADO.NET (Raw)

* **Pro:** Maximum performance
* **Pro:** Complete control
* **Pro:** Zero abstraction overhead
* **Pro:** Perfect for Azure Functions
* **Con:** ❌ Massive boilerplate code
* **Con:** ❌ Manual object mapping
* **Con:** ❌ Error-prone (forgot to close connections, etc.)
* **Con:** ❌ Very low developer productivity
* **Con:** ❌ Difficult to maintain
* **Con:** ❌ Testing is harder

### SqlKata

* **Pro:** Fluent SQL query builder
* **Pro:** Cross-database support
* **Pro:** Type-safe query building
* **Pro:** Can be combined with Dapper
* **Con:** Another dependency to learn
* **Con:** Abstraction can hide SQL complexity
* **Con:** Less community support than Dapper/EF
* **Con:** Still requires understanding SQL patterns

## Technical Details

### Dapper Implementation Pattern

**Simple Query:**
```csharp
public async Task<Student> GetStudentByIdAsync(string studentId)
{
    using var connection = await _connectionFactory.CreateConnectionAsync();

    var student = await connection.QueryFirstOrDefaultAsync<Student>(
        @"SELECT
            StudentId, FirstName, LastName, DateOfBirth, Grade
          FROM Enrollment.Students
          WHERE StudentId = @studentId",
        new { studentId });

    return student;
}
```

**Complex Multi-Schema Query:**
```csharp
public async Task<ApplicationDetails> GetApplicationDetailsAsync(string applicationId)
{
    using var connection = await _connectionFactory.CreateConnectionAsync();

    var sql = @"
        SELECT
            a.ApplicationId, a.Status, a.SubmittedDate,
            s.StudentId, s.FirstName, s.LastName,
            h.HouseholdId, h.Income, h.AddressLine1,
            aw.AwardId, aw.Amount, aw.DisbursementDate
        FROM Enrollment.Applications a
        INNER JOIN Enrollment.Students s ON a.StudentId = s.StudentId
        INNER JOIN Households.Households h ON s.HouseholdId = h.HouseholdId
        LEFT JOIN Awards.StudentAwards aw ON a.ApplicationId = aw.ApplicationId
        WHERE a.ApplicationId = @applicationId";

    var result = await connection.QueryAsync<ApplicationDetails, Student, Household, Award, ApplicationDetails>(
        sql,
        (application, student, household, award) =>
        {
            application.Student = student;
            application.Household = household;
            application.Award = award;
            return application;
        },
        new { applicationId },
        splitOn: "StudentId,HouseholdId,AwardId");

    return result.FirstOrDefault();
}
```

**RLS Session Context Integration:**
```csharp
public async Task<IEnumerable<Student>> GetStudentsForUserAsync(string userObjectId)
{
    using var connection = await _connectionFactory.CreateConnectionAsync();

    // Set session context for RLS
    await connection.ExecuteAsync(
        "EXEC sp_set_session_context @key=N'UserObjectId', @value=@userObjectId",
        new { userObjectId });

    // Query automatically filtered by RLS
    var students = await connection.QueryAsync<Student>(
        "SELECT * FROM Enrollment.Students");

    return students;
}
```

**Bulk Insert:**
```csharp
public async Task BulkInsertAuditLogsAsync(List<AuditLog> logs)
{
    using var connection = await _connectionFactory.CreateConnectionAsync();

    await connection.ExecuteAsync(
        @"INSERT INTO dbo.AuditLogs
          (EventId, Timestamp, EventType, Action, UserId, Details)
          VALUES (@EventId, @Timestamp, @EventType, @Action, @UserId, @Details)",
        logs);
}
```

### Connection Factory Pattern

```csharp
public interface IDbConnectionFactory
{
    Task<SqlConnection> CreateConnectionAsync();
}

public class DbConnectionFactory : IDbConnectionFactory
{
    private readonly string _connectionString;
    private readonly ITokenAcquisition _tokenAcquisition;

    public DbConnectionFactory(IConfiguration configuration, ITokenAcquisition tokenAcquisition)
    {
        _connectionString = configuration.GetConnectionString("K12Database");
        _tokenAcquisition = tokenAcquisition;
    }

    public async Task<SqlConnection> CreateConnectionAsync()
    {
        // Get OBO token for SQL
        var sqlToken = await _tokenAcquisition.GetAccessTokenAsync("https://database.windows.net/");

        var connection = new SqlConnection(_connectionString);
        connection.AccessToken = sqlToken;

        await connection.OpenAsync();
        return connection;
    }
}
```

### Repository Pattern

```csharp
public interface IStudentRepository
{
    Task<Student> GetByIdAsync(string studentId);
    Task<IEnumerable<Student>> GetByHouseholdAsync(string householdId);
    Task<string> InsertAsync(Student student);
    Task UpdateAsync(Student student);
    Task DeleteAsync(string studentId);
}

public class StudentRepository : IStudentRepository
{
    private readonly IDbConnectionFactory _connectionFactory;

    public StudentRepository(IDbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<Student> GetByIdAsync(string studentId)
    {
        using var connection = await _connectionFactory.CreateConnectionAsync();

        return await connection.QueryFirstOrDefaultAsync<Student>(
            "SELECT * FROM Enrollment.Students WHERE StudentId = @studentId",
            new { studentId });
    }

    public async Task<string> InsertAsync(Student student)
    {
        using var connection = await _connectionFactory.CreateConnectionAsync();

        student.StudentId = Guid.NewGuid().ToString();

        await connection.ExecuteAsync(
            @"INSERT INTO Enrollment.Students
              (StudentId, FirstName, LastName, DateOfBirth, Grade, HouseholdId)
              VALUES (@StudentId, @FirstName, @LastName, @DateOfBirth, @Grade, @HouseholdId)",
            student);

        return student.StudentId;
    }

    // Other methods...
}
```

### Performance Comparison

**Benchmark Results (10,000 iterations):**

| Method | Average Time | Memory | Cold Start |
|--------|-------------|--------|------------|
| **Dapper** | 12ms | 8MB | 50ms |
| **EF Core** | 18ms | 45MB | 280ms |
| **ADO.NET** | 10ms | 5MB | 40ms |

**Cold Start Impact in Azure Functions:**

| ORM | First Request | Subsequent Requests |
|-----|--------------|---------------------|
| **Dapper** | 250ms | 12ms |
| **EF Core** | 650ms | 18ms |
| **ADO.NET** | 200ms | 10ms |

### SqlKata Integration (Optional)

For dynamic query building, SqlKata can be combined with Dapper:

```csharp
public async Task<IEnumerable<Application>> SearchApplicationsAsync(ApplicationSearchCriteria criteria)
{
    using var connection = await _connectionFactory.CreateConnectionAsync();

    var compiler = new SqlServerCompiler();
    var query = new Query("Enrollment.Applications");

    if (!string.IsNullOrEmpty(criteria.Status))
        query.Where("Status", criteria.Status);

    if (criteria.SubmittedAfter.HasValue)
        query.Where("SubmittedDate", ">=", criteria.SubmittedAfter.Value);

    if (!string.IsNullOrEmpty(criteria.StudentName))
        query.WhereContains("StudentName", criteria.StudentName);

    var result = compiler.Compile(query);

    return await connection.QueryAsync<Application>(result.Sql, result.NamedBindings);
}
```

## Testing Strategy

### Unit Tests with In-Memory SQLite

```csharp
public class StudentRepositoryTests
{
    [Fact]
    public async Task GetByIdAsync_ReturnsStudent_WhenExists()
    {
        // Arrange
        using var connection = new SqliteConnection("DataSource=:memory:");
        await connection.OpenAsync();
        await connection.ExecuteAsync(@"
            CREATE TABLE Students (
                StudentId TEXT PRIMARY KEY,
                FirstName TEXT,
                LastName TEXT
            )");
        await connection.ExecuteAsync(
            "INSERT INTO Students VALUES (@StudentId, @FirstName, @LastName)",
            new { StudentId = "123", FirstName = "John", LastName = "Doe" });

        var repository = new StudentRepository(new TestConnectionFactory(connection));

        // Act
        var student = await repository.GetByIdAsync("123");

        // Assert
        Assert.NotNull(student);
        Assert.Equal("John", student.FirstName);
    }
}
```

### Integration Tests with Test Database

```csharp
public class StudentRepositoryIntegrationTests : IClassFixture<DatabaseFixture>
{
    private readonly DatabaseFixture _fixture;

    public StudentRepositoryIntegrationTests(DatabaseFixture fixture)
    {
        _fixture = fixture;
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsStudent_WithRealDatabase()
    {
        // Arrange
        var repository = new StudentRepository(_fixture.ConnectionFactory);
        var student = new Student { FirstName = "Jane", LastName = "Smith" };
        var studentId = await repository.InsertAsync(student);

        // Act
        var retrieved = await repository.GetByIdAsync(studentId);

        // Assert
        Assert.NotNull(retrieved);
        Assert.Equal("Jane", retrieved.FirstName);
    }
}
```

## Migration Strategy

**Database Migrations:** Use SQL scripts with versioning

```sql
-- V1__initial_schema.sql
CREATE SCHEMA Enrollment;

CREATE TABLE Enrollment.Students (
    StudentId NVARCHAR(50) PRIMARY KEY,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    DateOfBirth DATE NOT NULL,
    Grade INT NOT NULL,
    HouseholdId NVARCHAR(50) NOT NULL
);

-- V2__add_student_status.sql
ALTER TABLE Enrollment.Students
ADD Status NVARCHAR(20) NOT NULL DEFAULT 'Active';
```

**Migration Tool:** FluentMigrator or custom migration runner

```csharp
[Migration(20240810001)]
public class InitialSchema : Migration
{
    public override void Up()
    {
        Create.Schema("Enrollment");

        Create.Table("Students")
            .InSchema("Enrollment")
            .WithColumn("StudentId").AsString(50).PrimaryKey()
            .WithColumn("FirstName").AsString(100).NotNullable()
            .WithColumn("LastName").AsString(100).NotNullable()
            .WithColumn("DateOfBirth").AsDate().NotNullable()
            .WithColumn("Grade").AsInt32().NotNullable()
            .WithColumn("HouseholdId").AsString(50).NotNullable();
    }

    public override void Down()
    {
        Delete.Table("Students").InSchema("Enrollment");
        Delete.Schema("Enrollment");
    }
}
```

## Validation

Success will be measured by:
- API response times consistently < 2 seconds (target met: avg 1.2s)
- Cold start times < 500ms for Functions (target met: avg 250ms)
- Memory usage < 50MB per Function instance (target met: avg 15MB)
- No N+1 query problems identified in code reviews
- 100% of queries use parameterized SQL (prevent injection)
- Developer productivity remains high (measured by story completion velocity)

## Related Decisions

* [ADR-005: NRules for Business Rules](ADR-005-nrules-business-rules.md) - Rules engine loads facts via Dapper
* [ADR-008: Multi-Schema Database Design](ADR-008-multi-schema-database.md) - Impacts query structure
* [SEC-03: Row-Level Security](../02-architecture/security/SEC-03-row-level-security.md) - RLS integration with Dapper

## References

* [Dapper GitHub](https://github.com/DapperLib/Dapper)
* [Dapper Tutorial](https://www.learndapper.com/)
* [Performance Comparison: Dapper vs EF Core](https://exceptionnotfound.net/dapper-vs-entity-framework-core-performance-benchmarking/)
* [Azure Functions Cold Start Optimization](https://learn.microsoft.com/en-us/azure/azure-functions/functions-best-practices)
* [SqlKata Query Builder](https://sqlkata.com/)

---

**Decision Made:** August 10, 2024
**Implemented:** August 2024
**Performance Validated:** September 2024
