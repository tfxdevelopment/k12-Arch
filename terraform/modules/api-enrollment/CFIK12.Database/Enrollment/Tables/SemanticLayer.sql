CREATE TABLE [Enrollment].[SemanticLayer] (
    [Id]                  UNIQUEIDENTIFIER NOT NULL,
    [EnrollmentProgramId] UNIQUEIDENTIFIER NOT NULL,
    [PersonaId]           INT              NOT NULL,
    [Name]                VARCHAR (100)    NULL,
    [Version]             VARCHAR (50)     NULL,
    [IsCurrent]           BIT              NOT NULL,
    CONSTRAINT [pk_SemanticLayer] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [fk_semanticlayer] FOREIGN KEY ([EnrollmentProgramId]) REFERENCES [Enrollment].[EnrollmentProgram] ([Id])
);

