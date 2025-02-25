CREATE TABLE [Enrollment].[Persona] (
    [Id]   INT          IDENTITY (1, 1) NOT NULL,
    [Name] VARCHAR (50) NULL,
    CONSTRAINT [pk_Persona] PRIMARY KEY CLUSTERED ([Id] ASC)
);

