CREATE TABLE [Enrollment].[Application] (
    [Id]                   UNIQUEIDENTIFIER NOT NULL,
    [EnrollmentProgramId]  UNIQUEIDENTIFIER NOT NULL,
    [ApplicantId]          UNIQUEIDENTIFIER NOT NULL,
    [Status]               VARCHAR (50)     NULL,
    [CurrentPromptKeyPath] VARCHAR (MAX)    NULL,
    [LastPromptKeyPath]    VARCHAR (MAX)    NULL,
    CONSTRAINT [pk_EnrollmentSession] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [fk_application] FOREIGN KEY ([EnrollmentProgramId]) REFERENCES [Enrollment].[EnrollmentProgram] ([Id]),
    CONSTRAINT [fk_application_applicant] FOREIGN KEY ([ApplicantId]) REFERENCES [Enrollment].[Applicant] ([Id])
);

