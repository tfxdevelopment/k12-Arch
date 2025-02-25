CREATE TABLE [Enrollment].[PromptComponent] (
    [Id]       UNIQUEIDENTIFIER NOT NULL,
    [PromptId] UNIQUEIDENTIFIER NOT NULL,
    [Token]    VARCHAR (256)    NULL,
    [Name]     VARCHAR (256)    NULL,
    [Key]      VARCHAR (256)    NULL,
    [KeyPath]  VARCHAR (MAX)    NULL,
    [Order]    INT              NULL,
    [ComponentType] NVARCHAR(128) NULL, 
    [Header] VARCHAR(256) NULL, 
    [Instructions] VARCHAR(MAX) NULL, 
    CONSTRAINT [pk_EnrollmentProgram_1] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [fk_promptcomponents_prompts] FOREIGN KEY ([PromptId]) REFERENCES [Enrollment].[Prompt] ([Id]) ON DELETE CASCADE
);

