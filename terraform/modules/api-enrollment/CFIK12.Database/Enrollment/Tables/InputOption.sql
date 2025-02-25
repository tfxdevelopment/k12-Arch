CREATE TABLE [Enrollment].[InputOption] (
    [Id]      UNIQUEIDENTIFIER NOT NULL,
    [InputId] UNIQUEIDENTIFIER NOT NULL,
    [Label]   VARCHAR (256)    NULL,
    [Value]   VARCHAR (256)    NULL,
    [Order]   INT              NULL,
    [DataType] NVARCHAR(128) NULL, 
    CONSTRAINT [pk_EnrollmentProgram_3] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [fk_inputoptions_input] FOREIGN KEY ([InputId]) REFERENCES [Enrollment].[Input] ([Id]) ON DELETE CASCADE
);

