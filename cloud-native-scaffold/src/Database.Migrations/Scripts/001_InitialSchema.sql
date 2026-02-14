-- ============================================================================
-- K12 Cloud Native - Initial Database Schema
-- Migration: 001_InitialSchema.sql
-- Created: 2026-01-31
-- Description: Creates the initial database schema for K12 cloud-native apps
-- ============================================================================

-- ============================================================================
-- PROGRAMS SCHEMA
-- ============================================================================

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Programs')
BEGIN
    CREATE TABLE [dbo].[Programs]
    (
        [Id]          UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
        [Name]        NVARCHAR(200)    NOT NULL,
        [Description] NVARCHAR(MAX)    NULL,
        [IsActive]    BIT              NOT NULL DEFAULT 1,
        [CreatedOn]   DATETIMEOFFSET   NOT NULL DEFAULT SYSDATETIMEOFFSET(),
        [UpdatedOn]   DATETIMEOFFSET   NULL
    );

    CREATE INDEX [IX_Programs_Name] ON [dbo].[Programs]([Name]);
    CREATE INDEX [IX_Programs_IsActive] ON [dbo].[Programs]([IsActive]);
END
GO

-- ============================================================================
-- USERS SCHEMA
-- ============================================================================

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE [dbo].[Users]
    (
        [Id]          UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
        [Email]       NVARCHAR(256)    NOT NULL,
        [DisplayName] NVARCHAR(200)    NOT NULL,
        [IsActive]    BIT              NOT NULL DEFAULT 1,
        [CreatedOn]   DATETIMEOFFSET   NOT NULL DEFAULT SYSDATETIMEOFFSET(),
        [UpdatedOn]   DATETIMEOFFSET   NULL
    );

    CREATE UNIQUE INDEX [IX_Users_Email] ON [dbo].[Users]([Email]);
    CREATE INDEX [IX_Users_IsActive] ON [dbo].[Users]([IsActive]);
END
GO

-- ============================================================================
-- ENROLLMENTS SCHEMA
-- ============================================================================

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'EnrollmentApplications')
BEGIN
    CREATE TABLE [dbo].[EnrollmentApplications]
    (
        [Id]          UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
        [HouseholdId] UNIQUEIDENTIFIER NOT NULL,
        [ProgramId]   UNIQUEIDENTIFIER NOT NULL,
        [StudentId]   UNIQUEIDENTIFIER NOT NULL,
        [Status]      NVARCHAR(50)     NOT NULL DEFAULT 'Submitted',
        [Responses]   NVARCHAR(MAX)    NULL, -- JSON data
        [SubmittedOn] DATETIMEOFFSET   NOT NULL DEFAULT SYSDATETIMEOFFSET(),
        [UpdatedOn]   DATETIMEOFFSET   NULL
    );

    CREATE INDEX [IX_EnrollmentApplications_HouseholdId] ON [dbo].[EnrollmentApplications]([HouseholdId]);
    CREATE INDEX [IX_EnrollmentApplications_ProgramId] ON [dbo].[EnrollmentApplications]([ProgramId]);
    CREATE INDEX [IX_EnrollmentApplications_Status] ON [dbo].[EnrollmentApplications]([Status]);
END
GO

PRINT 'Initial schema created successfully.';
GO
