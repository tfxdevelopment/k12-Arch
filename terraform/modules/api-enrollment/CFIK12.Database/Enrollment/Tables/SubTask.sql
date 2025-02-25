CREATE TABLE [Enrollment].[SubTask] (
    [Id]               UNIQUEIDENTIFIER NOT NULL,
    [AccountId]        UNIQUEIDENTIFIER NOT NULL,
    [Name]             VARCHAR (255)    NOT NULL,
    [TaskType]         VARCHAR (50)     NOT NULL,
    [CreatedTimestamp] ROWVERSION       NOT NULL,
    [ActionUri]        VARCHAR (MAX)    NULL,
    CONSTRAINT [pk_Task_0] PRIMARY KEY CLUSTERED ([Id] ASC)
);

