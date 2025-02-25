CREATE TABLE [Enrollment].[Input] (
    [Id]               UNIQUEIDENTIFIER NOT NULL,
    [PrompComponentId] UNIQUEIDENTIFIER NOT NULL,
    [Label]            VARCHAR (256)    NULL,
    [Key]              VARCHAR (256)    NULL,
    [Order]            INT              NULL,
    [KeyPath] VARCHAR(MAX) NULL, 
    [Instructions] VARCHAR(MAX) NULL, 
    [InputType] NVARCHAR(128) NULL, 
    [DataType] NVARCHAR(128) NULL, 
    [IsRequired] BIT NULL, 
    [Min] INT NULL, 
    [Value] VARCHAR(256) NULL, 
    [Icon] VARCHAR(256) NULL, 
    CONSTRAINT [pk_EnrollmentProgram_2] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [fk_inputs_promptcomponents] FOREIGN KEY ([PrompComponentId]) REFERENCES [Enrollment].[PromptComponent] ([Id]) ON DELETE CASCADE
);

