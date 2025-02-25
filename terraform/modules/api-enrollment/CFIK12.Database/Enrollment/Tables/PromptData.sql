CREATE TABLE [Enrollment].[PromptData] (
    [Id]                     UNIQUEIDENTIFIER NOT NULL,
    [ApplicationId]          UNIQUEIDENTIFIER NOT NULL,
    [PromptComponentKeyPath] VARCHAR (MAX)    NOT NULL,
    [InputKey]               VARCHAR (MAX)    NOT NULL,
    [Value]                  VARCHAR (MAX)    NOT NULL,
    CONSTRAINT [pk_PromptData] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [fk_promptdata_application] FOREIGN KEY ([ApplicationId]) REFERENCES [Enrollment].[Application] ([Id]) ON DELETE CASCADE
);

