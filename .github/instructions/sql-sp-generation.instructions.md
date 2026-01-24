---
description: "Instructions for generating SQL Server stored procedures"
applyTo: "**/*.sql"
---

# SQL Stored Procedure Generation Instructions

Follow these guidelines when generating SQL Server stored procedures.

## Naming Conventions

- Use `usp_` prefix for user stored procedures
- Use PascalCase for procedure names
- Include action verb: `usp_GetCustomerById`, `usp_InsertOrder`, `usp_UpdateProduct`
- Avoid generic names like `usp_DoWork`

## Template Structure

```sql
CREATE OR ALTER PROCEDURE [dbo].[usp_ProcedureName]
    @Parameter1 INT,
    @Parameter2 NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Business logic here
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        THROW;
    END CATCH;
END;
GO
```

## Parameter Guidelines

- Use appropriate data types matching column definitions
- Provide defaults for optional parameters
- Use `OUTPUT` parameters for return values
- Validate inputs before processing

## Error Handling

```sql
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;
    
    DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
    DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
    DECLARE @ErrorState INT = ERROR_STATE();
    
    RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
END CATCH;
```

## Performance Considerations

- Use `SET NOCOUNT ON` to reduce network traffic
- Avoid `SELECT *`; specify column names explicitly
- Use appropriate indexes
- Consider query hints only when necessary
- Use table-valued parameters for bulk operations

## Security

- Use parameterized queries to prevent SQL injection
- Grant EXECUTE permissions at stored procedure level
- Avoid dynamic SQL when possible
- Use `WITH EXECUTE AS` for elevated permissions when needed

## Documentation

```sql
/*
    Procedure: usp_GetOrdersByCustomer
    Description: Retrieves all orders for a specific customer
    Parameters:
        @CustomerId - The unique identifier for the customer
        @StartDate - Optional filter for order date range start
        @EndDate - Optional filter for order date range end
    Returns: Order details including items and totals
    Author: [Name]
    Created: [Date]
    Modified: [Date] - [Description of changes]
*/
```
