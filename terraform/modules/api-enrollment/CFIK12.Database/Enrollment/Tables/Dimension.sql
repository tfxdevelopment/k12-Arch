CREATE TABLE [Enrollment].[Dimension] (
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
    CONSTRAINT [pk_Dimension] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [fk_semanticlayer_dimension] FOREIGN KEY ([SemanticLayerId]) REFERENCES [Enrollment].[SemanticLayer] ([Id])
);

