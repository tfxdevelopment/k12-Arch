CREATE TABLE [Enrollment].[ApplicationEvent] (
    [Id]            UNIQUEIDENTIFIER NOT NULL,
    [ApplicationId] UNIQUEIDENTIFIER NOT NULL,
    [EventType]     VARCHAR (50)     NOT NULL,
    [Detail]        TEXT             NULL,
    [EventDateTime] DATETIME         NOT NULL,
    CONSTRAINT [pk_ApplicationEvents] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [fk_applicationevent] FOREIGN KEY ([ApplicationId]) REFERENCES [Enrollment].[Application] ([Id]) ON DELETE CASCADE
);

