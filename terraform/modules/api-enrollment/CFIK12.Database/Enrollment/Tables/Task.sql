CREATE TABLE [Enrollment].[Task] (
    [Id]               UNIQUEIDENTIFIER NOT NULL,
    [Name]             VARCHAR (255)    NOT NULL,
    [TaskType]         VARCHAR (50)     NOT NULL,
    [CreatedTimestamp] ROWVERSION       NOT NULL,
    [ActionUri]        VARCHAR (MAX)    NULL,
    [AccountId]        UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT [pk_Task] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [fk_task_account] FOREIGN KEY ([AccountId]) REFERENCES [Enrollment].[Account] ([Id])
);

