CREATE TABLE [Enrollment].[EnrollmentProgram] (
    [Id]          UNIQUEIDENTIFIER NOT NULL,
    [Token]       VARCHAR (256)    NULL,
    [Name]        VARCHAR (256)    NULL,
    [Key]         VARCHAR (256)    NULL,
    [KeyPath]     VARCHAR (MAX)    NULL,
    [Version]     INT              NULL,
    [IsCurrent]   BIT              NOT NULL,
    [IsPublished] BIT              NOT NULL,
    CONSTRAINT [pk_EnrollmentProgram] PRIMARY KEY CLUSTERED ([Id] ASC)
);

