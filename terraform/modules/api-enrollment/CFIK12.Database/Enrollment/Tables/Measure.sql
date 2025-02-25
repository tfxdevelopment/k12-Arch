CREATE TABLE [Enrollment].[Measure] (
    [Id]                     UNIQUEIDENTIFIER NOT NULL,
    [SemanticLayerId]        UNIQUEIDENTIFIER NOT NULL,
    [PromptComponentKeyPath] VARCHAR (MAX)    NOT NULL,
    [InputKey]               VARCHAR (50)     NULL,
    [Entity]                 VARCHAR (500)    NULL,
    [Attribute]              VARCHAR (500)    NULL,
    [ValueType]              VARCHAR (50)     NULL,
    [ValueFormat]            VARCHAR (MAX)    NULL,
    [IsCurrent]              BIT              NOT NULL,
    [CreatedDateTime]        DATETIME         NOT NULL,
    [UpdatedDateTime]        DATETIME         NULL,
    CONSTRAINT [pk_Measure] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [fk_semanticlayer_measure] FOREIGN KEY ([SemanticLayerId]) REFERENCES [Enrollment].[SemanticLayer] ([Id])
);

