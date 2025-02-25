CREATE TABLE [Enrollment].[AccountMessage]
(
	[Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY , 
    [AccountId] UNIQUEIDENTIFIER NULL, 
    [SenderId] UNIQUEIDENTIFIER NULL, 
    [SenderName] VARCHAR(50) NULL, 
    [SenderTypeId] INT NOT NULL, 
    [RecipientId] UNIQUEIDENTIFIER NULL, 
    [RecipientName] VARCHAR(50) NULL, 
    [RecipientTypeId] INT NOT NULL,  
    [Message] VARCHAR(500) NULL, 
    [DateSent] DATETIME NOT NULL DEFAULT GETUTCDATE(), 
    [DateRead] DATETIME NULL, 
    [DateArchived] DATETIME NULL,
    [AccountMessageTopicId] UNIQUEIDENTIFIER NOT NULL, 
    CONSTRAINT [FK_AccountMessages_Account] FOREIGN KEY ([AccountId]) REFERENCES [Enrollment].[Account]([Id]),
    CONSTRAINT [FK_AccountMessage_AccountMessageSenderType] FOREIGN KEY ([SenderTypeId]) REFERENCES [Enrollment].[AccountMessageParticipantType]([Id]), 
    CONSTRAINT [FK_AccountMessage_AccountMessageRecipientType] FOREIGN KEY ([RecipientTypeId]) REFERENCES [Enrollment].[AccountMessageParticipantType]([Id]), 

)
