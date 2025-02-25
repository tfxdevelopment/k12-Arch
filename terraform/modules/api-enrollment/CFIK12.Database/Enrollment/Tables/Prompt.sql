CREATE TABLE [Enrollment].[Prompt] (
    [Id]        UNIQUEIDENTIFIER NOT NULL,
    [ProgramId] UNIQUEIDENTIFIER NOT NULL,
    [Token]     VARCHAR (256)    NULL,
    [Name]      VARCHAR (256)    NULL,
    [Key]       VARCHAR (256)    NULL,
    [KeyPath]   VARCHAR (MAX)    NULL,
    [Order]     INT              NULL,
    [Title] VARCHAR(256) NULL, 
    [IsRequired] BIT NULL, 
    [Header] VARCHAR(256) NULL, 
    [SubHeader] VARCHAR(MAX) NULL, 
    [Instructions] VARCHAR(MAX) NULL, 
    CONSTRAINT [pk_EnrollmentProgram_0] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [fk_prompts_enrollmentprogram] FOREIGN KEY ([ProgramId]) REFERENCES [Enrollment].[EnrollmentProgram] ([Id]) ON DELETE CASCADE
);

