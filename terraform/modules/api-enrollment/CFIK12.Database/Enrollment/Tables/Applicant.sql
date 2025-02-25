CREATE TABLE [Enrollment].[Applicant] (
    [Id]        UNIQUEIDENTIFIER NOT NULL,
    [FirstName] VARCHAR (100)    NULL,
    [LastName]  VARCHAR (100)    NULL,
    [Email]     VARCHAR (250)    NULL,
    CONSTRAINT [pk_Applicant] PRIMARY KEY CLUSTERED ([Id] ASC)
);

