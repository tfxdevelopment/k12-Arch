CREATE TABLE [Enrollment].[PromptIdFileUpload] (
    [Id]             INT           IDENTITY (1, 1) NOT NULL,
    [PromptId]       VARCHAR (100) NOT NULL,
    [FileUploadName] VARCHAR (400) NOT NULL,
    [FileExtension]  VARCHAR (10)  NOT NULL,
    [FileName]       VARCHAR (400) NULL,
    CONSTRAINT [PK_PromptIdFileUpload] PRIMARY KEY CLUSTERED ([Id] ASC)
);

