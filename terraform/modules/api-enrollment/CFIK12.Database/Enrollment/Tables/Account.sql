CREATE TABLE [Enrollment].[Account] (
    [Id]          UNIQUEIDENTIFIER NOT NULL,
    [ApplicantId] UNIQUEIDENTIFIER NOT NULL,
    [PersonaId]   INT              NOT NULL,
    CONSTRAINT [pk_Account] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [fk_account_applicant] FOREIGN KEY ([ApplicantId]) REFERENCES [Enrollment].[Applicant] ([Id]),
    CONSTRAINT [unq_Account_ApplicantId] UNIQUE NONCLUSTERED ([ApplicantId] ASC)
);

