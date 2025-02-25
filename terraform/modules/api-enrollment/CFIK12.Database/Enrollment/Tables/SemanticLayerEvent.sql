CREATE TABLE [Enrollment].[SemanticLayerEvent] (
    [Id]              UNIQUEIDENTIFIER NOT NULL,
    [SemanticLayerId] UNIQUEIDENTIFIER NOT NULL,
    [EventType]       VARCHAR (50)     NOT NULL,
    [Detail]          TEXT             NULL,
    [EventDateTime]   DATETIME         NOT NULL,
    CONSTRAINT [pk_SemanticLayerEvent] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [fk_semanticlayerevent] FOREIGN KEY ([SemanticLayerId]) REFERENCES [Enrollment].[SemanticLayer] ([Id])
);

