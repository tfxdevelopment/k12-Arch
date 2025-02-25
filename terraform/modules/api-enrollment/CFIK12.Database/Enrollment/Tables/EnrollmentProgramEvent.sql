CREATE TABLE [Enrollment].[EnrollmentProgramEvent] (
    [Id]                  UNIQUEIDENTIFIER NOT NULL,
    [EnrollmentProgramId] UNIQUEIDENTIFIER NOT NULL,
    [EventType]           VARCHAR (50)     NOT NULL,
    [Detail]              TEXT             NULL,
    [EventDateTime]       DATETIME         NOT NULL,
    CONSTRAINT [pk_EnrollmentProgramEvents] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [fk_enrollmentprogramevent] FOREIGN KEY ([EnrollmentProgramId]) REFERENCES [Enrollment].[EnrollmentProgram] ([Id])
);

