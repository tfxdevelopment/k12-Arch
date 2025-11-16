# CFIK12 Database Schema Documentation

## Overview

The CFIK12 database is a multi-schema SQL Server database that supports the K-12 enrollment management system. The database follows a domain-driven design with clear separation of concerns across 10 distinct schemas.

**Database Type:** Azure SQL Database
**Access Pattern:** Dapper micro-ORM (Entity Framework for model generation only)
**Authentication:** Azure AD Managed Identity

## Table of Contents

- [Schema Overview](#schema-overview)
- [Awards Schema](#awards-schema)
- [Comms Schema](#comms-schema)
- [Enrollment Schema](#enrollment-schema)
- [Households Schema](#households-schema)
- [K12 Schema](#k12-schema)
- [Panda Schema](#panda-schema)
- [Partner Schema](#partner-schema)
- [Provider Schema](#provider-schema)
- [Schools Schema](#schools-schema)
- [Security Schema](#security-schema)
- [Entity Relationship Diagrams](#entity-relationship-diagrams)
- [Indexes and Performance](#indexes-and-performance)

---

## Schema Overview

| Schema | Purpose | Key Tables | Related Domain |
|--------|---------|------------|----------------|
| **Awards** | Lottery and award management | AcademicYear, Applications, LotteryStudents, ESALotterySettings, OSLotterySettings, ProgramType | Awards/Lottery System |
| **Comms** | Communications and notifications | Communication, CommunicationTemplate, EmailBlast, AccountMessage, MergeField | Messaging/Notifications |
| **Enrollment** | Enrollment program management | EnrollmentProgram, Application, Prompt, PromptComponent, Input, Applicant | Enrollment Workflows |
| **Households** | Household and student data | Household, Student | Family Management |
| **K12** | Core domain entities | Account, Person, Phone, Grade, BusinessAddress, Agreement | Core Domain |
| **Panda** | PandaDoc integration | Template, SentDocument, DocumentStatus | Document Generation |
| **Partner** | Partner/provider management | ProgramPartner, ProgramPartnerType, Notes | Provider Management |
| **Provider** | Provider-specific data | EmployeeType, EmployeeSubServices, ProviderEnrollmentStatus | Provider Services |
| **Schools** | School and institution management | Institution, Program, StudentEnrollment, SchoolTerm, Grade | School Management |
| **Security** | Security and sensitive data | HashData, UserResourceAccessMap | Security/Access Control |

---

## Awards Schema

The Awards schema manages lottery systems, applications, and award allocations for ESA (Education Scholarship Account) and OS (Opportunity Scholarship) programs.

### Tables

#### Awards.AcademicYear

Defines academic year periods for award programs.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| Id | INT IDENTITY | No | Primary key |
| StartDate | DATETIME | No | Academic year start date |
| EndDate | DATETIME | No | Academic year end date |

**Primary Key:** `PK_Awards_AcademicYear` (Id)

**Indexes:**
- `IX_StartendDate` - Nonclustered index on (StartDate, EndDate)

**Story Reference:** K12-3268
**Author:** Thomas Franey

---

#### Awards.Applications

Tracks student applications to lottery programs.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| Id | UNIQUEIDENTIFIER | No | Primary key |
| StudentId | UNIQUEIDENTIFIER | No | Foreign key to LotteryStudents |
| ProgramTypeId | INT | No | Foreign key to ProgramType (ESA/OS) |
| AcademicYearId | INT | No | Foreign key to AcademicYear |
| ApplicationDate | DATETIME | No | Date application submitted |
| Completed | BIT | No | Application completion status (default: 0) |

**Primary Key:** `PK_Awards_Applications` (Id)

**Foreign Keys:**
- `FK_Awards_Applications_LotteryStudents` → Awards.LotteryStudents(Id)
- `FK_Awards_Applications_ProgramType` → Awards.ProgramType(Id)
- `FK_Awards_Applications_AwardsAcademicYear` → Awards.AcademicYear(Id)

**Indexes:**
- `IX_Awards_Application_AcademicYear` - Nonclustered index on (AcademicYearId, ProgramTypeId)
- `IX_Awards_Application_Student` - Nonclustered index on (StudentId)
- `IX_Awards_Application_Date` - Nonclustered index on (ApplicationDate)

**Story Reference:** K12-3371
**Author:** Mounisha Badarla

---

#### Awards.LotteryStudents

Stores student lottery information and assigned lottery numbers.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| Id | UNIQUEIDENTIFIER | No | Primary key |
| FirstName | NVARCHAR(255) | No | Student first name |
| LastName | NVARCHAR(255) | No | Student last name |
| HouseHoldId | UNIQUEIDENTIFIER | No | Associated household |
| EsaLotteryNumber | INT | Yes | ESA lottery assignment number |
| OsLotteryNumber | INT | Yes | OS lottery assignment number |

**Primary Key:** `PK_Awards_LotteryStudents` (Id)

**Indexes:**
- `IX_Awards_LotteryStudent_Household` - Nonclustered index on (HouseHoldId)

**Story Reference:** K12-3171
**Author:** Mounisha Badarla

---

#### Awards.ESALotterySettings

Configuration settings for ESA (Education Scholarship Account) lottery program.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| Id | UNIQUEIDENTIFIER | No | Primary key |
| AcademicYearId | INT | No | Foreign key to AcademicYear (unique) |
| ApplicationWindowStartDate | DATETIME | No | Application period start |
| ApplicationWindowEndDate | DATETIME | Yes | Application period end |
| PriorityWindowStartDate | DATETIME | Yes | Priority enrollment start |
| PriorityWindowEndDate | DATETIME | Yes | Priority enrollment end |
| RenewalWindowStartDate | DATETIME | Yes | Renewal period start |
| RenewalWindowEndDate | DATETIME | Yes | Renewal period end |
| AwardAcceptanceDeadlineDate | DATETIME | Yes | Award acceptance deadline |
| FallEndorsementWindowStartDate | DATETIME | Yes | Fall endorsement period start |
| FallEndorsementWindowEndDate | DATETIME | Yes | Fall endorsement period end |
| SpringEndorsementWindowStartDate | DATETIME | Yes | Spring endorsement period start |
| SpringEndorsementWindowEndDate | DATETIME | Yes | Spring endorsement period end |
| CertificationWindowStartDate | DATETIME | Yes | Certification period start |
| CertificationWindowEndDate | DATETIME | Yes | Certification period end |
| SchoolChoiceDeadlineDate | DATETIME | Yes | School choice deadline |
| ESABaseAwardAmount | DECIMAL(10,2) | Yes | Base award amount |
| ESAEnhancedAwardAmount | DECIMAL(10,2) | Yes | Enhanced award amount |
| Completed | BIT | No | Setup completion status (default: 0) |

**Primary Key:** `PK_Awards_ESALotterySettings` (Id)

**Unique Constraints:**
- `AK_Awards_ESALotteryAcademicYear` - Unique(AcademicYearId)

**Foreign Keys:**
- `FK_Awards_ESALotterySettings_AwardsAcademicYear` → Awards.AcademicYear(Id)

**Indexes:**
- `UIX_ESALotterySettings_AcademicYear` - Unique index on (AcademicYearId)
- `IX_ESALotterySettings_StartEndAppWindowDate` - Nonclustered index on (ApplicationWindowStartDate, ApplicationWindowEndDate)
- `IX_ESALotterySettings_StartEndPriorWindowDate` - Nonclustered index on (PriorityWindowStartDate, PriorityWindowEndDate)
- `IX_ESALotterySettings_StartEndRenewalWindowDate` - Nonclustered index on (RenewalWindowStartDate, RenewalWindowEndDate)

---

#### Awards.OSLotterySettings

Configuration settings for OS (Opportunity Scholarship) lottery program with tiered award amounts.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| Id | UNIQUEIDENTIFIER | No | Primary key |
| AcademicYearId | INT | No | Foreign key to AcademicYear (unique) |
| ApplicationWindowStartDate | DATETIME | No | Application period start |
| ApplicationWindowEndDate | DATETIME | Yes | Application period end |
| PriorityWindowStartDate | DATETIME | Yes | Priority enrollment start |
| PriorityWindowEndDate | DATETIME | Yes | Priority enrollment end |
| RenewalWindowStartDate | DATETIME | Yes | Renewal period start |
| RenewalWindowEndDate | DATETIME | Yes | Renewal period end |
| AwardAcceptanceDeadlineDate | DATETIME | Yes | Award acceptance deadline |
| FallEndorsementWindowStartDate | DATETIME | Yes | Fall endorsement period start |
| FallEndorsementWindowEndDate | DATETIME | Yes | Fall endorsement period end |
| SpringEndorsementWindowStartDate | DATETIME | Yes | Spring endorsement period start |
| SpringEndorsementWindowEndDate | DATETIME | Yes | Spring endorsement period end |
| CertificationWindowStartDate | DATETIME | Yes | Certification period start |
| CertificationWindowEndDate | DATETIME | Yes | Certification period end |
| SchoolChoiceDeadlineDate | DATETIME | Yes | School choice deadline |
| BaseFPLAmount | DECIMAL(10,2) | Yes | Base Federal Poverty Level amount |
| HouseholdIncrement | DECIMAL(10,2) | Yes | Household size increment |
| Tier1Threshold | DECIMAL(10,2) | Yes | Tier 1 income threshold |
| Tier1AwardAmount | DECIMAL(10,2) | Yes | Tier 1 award amount |
| Tier2Threshold | DECIMAL(10,2) | Yes | Tier 2 income threshold |
| Tier2AwardAmount | DECIMAL(10,2) | Yes | Tier 2 award amount |
| Tier3Threshold | DECIMAL(10,2) | Yes | Tier 3 income threshold |
| Tier3AwardAmount | DECIMAL(10,2) | Yes | Tier 3 award amount |
| Tier4Threshold | DECIMAL(10,2) | Yes | Tier 4 income threshold |
| Tier4AwardAmount | DECIMAL(10,2) | Yes | Tier 4 award amount |
| Completed | BIT | No | Setup completion status (default: 0) |

**Primary Key:** `PK_Awards_OSLotterySettings` (Id)

**Unique Constraints:**
- `AK_Awards_OSLotteryAcademicYear` - Unique(AcademicYearId)

**Foreign Keys:**
- `FK_Awards_OSLotterySettings_AwardsAcademicYear` → Awards.AcademicYear(Id)

**Indexes:**
- `UIX_OSLotterySettings_AcademicYear` - Unique index on (AcademicYearId)
- `IX_OSLotterySettings_StartEndAppWindowDate` - Nonclustered index on (ApplicationWindowStartDate, ApplicationWindowEndDate)
- `IX_OSLotterySettings_StartEndPriorWindowDate` - Nonclustered index on (PriorityWindowStartDate, PriorityWindowEndDate)
- `IX_OSLotterySettings_StartEndRenewalWindowDate` - Nonclustered index on (RenewalWindowStartDate, RenewalWindowEndDate)

---

#### Awards.ProgramType

Lookup table for program types (ESA, OS, etc.).

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| Id | INT | No | Primary key |
| Code | NVARCHAR(4) | No | Program code (e.g., "ESA", "OS") |
| Title | NVARCHAR(255) | No | Program title/name |

**Primary Key:** `PK_Awards_ProgramType` (Id)

**Story Reference:** K12-3269
**Author:** Thomas Franey

---

## Comms Schema

The Comms schema handles all communications, notifications, email blasts, and message templating for the system.

### Tables

#### Comms.Communication

Main communication/campaign entity linking templates to scheduled communications.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| Id | UNIQUEIDENTIFIER | No | Primary key (default: newid()) |
| Name | VARCHAR(100) | No | Communication name |
| Description | NVARCHAR(500) | Yes | Communication description |
| CommunicationTemplateId | UNIQUEIDENTIFIER | No | Foreign key to template |
| StartDate | DATETIMEOFFSET(7) | Yes | Communication start date |
| EndDate | DATETIMEOFFSET(7) | Yes | Communication end date |
| CreatedBy | UNIQUEIDENTIFIER | No | Account that created communication |
| CreateDate | DATETIMEOFFSET(7) | No | Creation timestamp (default: sysdatetimeoffset()) |
| ModifiedBy | UNIQUEIDENTIFIER | Yes | Account that modified communication |
| ModifiedDate | DATETIMEOFFSET(7) | Yes | Modification timestamp |

**Primary Key:** `PK_Communication` (Id)

**Foreign Keys:**
- `FK_Communication_Account` → K12.Account(Id) (CreatedBy)
- `FK_Communication_CommunicationTemplate` → Comms.CommunicationTemplate(Id)
- `FK_Communication_ModifiedAccount` → K12.Account(Id) (ModifiedBy)

**Indexes:**
- `IX_Communication` - Nonclustered index on (CommunicationTemplateId)

---

#### Comms.CommunicationTemplate

Templates for emails, notifications, and alert banners with merge field support.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| Id | UNIQUEIDENTIFIER | No | Primary key |
| CommunicationTypeId | INT | Yes | Type (email, SMS, notification, etc.) |
| ProgramPartnerTypeId | INT | Yes | Target partner type |
| CommunicationTemplateStatusId | INT | Yes | Template status (default: 1) |
| AlertBannerTypeId | INT | Yes | Alert banner type if applicable |
| Name | VARCHAR(100) | No | Template name |
| SubjectTemplate | NVARCHAR(255) | No | Email subject template with merge fields |
| CommTemplateBody | NVARCHAR(4000) | No | Communication body HTML template |
| CommTemplateText | NVARCHAR(4000) | Yes | Plain text version |
| NotificationTemplateBody | NVARCHAR(4000) | Yes | In-app notification template |
| Description | NVARCHAR(1000) | Yes | Template description |
| CreatedBy | UNIQUEIDENTIFIER | No | Account that created template |
| ModifiedBy | UNIQUEIDENTIFIER | Yes | Account that modified template |
| DateCreated | DATETIMEOFFSET(7) | No | Creation timestamp (default: getdate()) |
| DateModified | DATETIMEOFFSET(7) | Yes | Modification timestamp |
| DatePublished | DATETIMEOFFSET(7) | Yes | Publication timestamp |
| DateArchived | DATETIMEOFFSET(7) | Yes | Archive timestamp |

**Primary Key:** `PK_CommunicationTemplate` (Id)

**Foreign Keys:**
- `FK_CommunicationTemplate_AccountCreated` → K12.Account(Id)
- `FK_CommunicationTemplate_AccountModified` → K12.Account(Id)
- `FK_CommunicationTemplate_AlertBannerType` → Comms.AlertBannerType(Id)
- `FK_CommunicationTemplate_CommunicationTemplateStatus` → Comms.CommunicationTemplateStatus(Id)
- `FK_CommunicationTemplate_CommunicationType` → Comms.CommunicationType(Id)
- `FK_CommunicationTemplate_ProgramPartnerType` → Partner.ProgramPartnerType(Id)

---

#### Other Comms Tables

Additional tables in the Comms schema include:
- **CommunicationSchedule** - Scheduled communication runs
- **CommunicationRecipient** - Communication recipients and delivery status
- **AccountMessage** - User inbox messages
- **AccountMessageTopic** - Message categorization
- **EmailBlast** - Bulk email campaigns
- **MergeField** - Template merge field definitions
- **MergeFieldPartition** - Data partitions for merge fields
- **MergeFieldSource** - Data sources for merge fields
- **MessageParentCategory** - Message category hierarchy
- **MessageChildCategory** - Message sub-categories
- **MessageAutoAssignmentConfiguration** - Auto-assignment rules
- **RecipientNotification** - User notifications
- **RecipientAlertBanner** - User alert banners
- **AlertBannerType** - Alert banner type lookup
- **CommunicationType** - Communication type lookup
- **CommunicationTemplateStatus** - Template status lookup

---

## Enrollment Schema

The Enrollment schema manages the dynamic enrollment program builder, including programs, prompts, inputs, and application workflows.

### Tables

#### Enrollment.EnrollmentProgram

Enrollment programs configured via the enrollment builder with versioning support.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| Id | UNIQUEIDENTIFIER | No | Primary key |
| Token | VARCHAR(256) | Yes | Unique token |
| Name | VARCHAR(256) | Yes | Program name (unique) |
| Key | VARCHAR(256) | Yes | Program key |
| KeyPath | VARCHAR(MAX) | Yes | Hierarchical key path |
| Version | INT | Yes | Version number |
| IsCurrent | BIT | No | Is current version flag |
| IsPublished | BIT | No | Is published flag |
| IsActive | BIT | No | Is active flag (default: 1) |
| RequiresPublish | BIT | No | Requires publish flag (default: 1) |

**Primary Key:** `pk_EnrollmentProgram` (Id)

**Unique Constraints:**
- `UQ_EnrollmentProgram_Name` - Unique nonclustered index on (Name)

---

#### Enrollment.Application

Application/enrollment session tracking for applicants.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| Id | UNIQUEIDENTIFIER | No | Primary key |
| EnrollmentProgramId | UNIQUEIDENTIFIER | No | Foreign key to EnrollmentProgram |
| ApplicantId | UNIQUEIDENTIFIER | No | Foreign key to Applicant |
| Status | VARCHAR(50) | Yes | Application status |
| CurrentPromptKeyPath | VARCHAR(MAX) | Yes | Current step key path |
| LastPromptKeyPath | VARCHAR(MAX) | Yes | Last completed step key path |

**Primary Key:** `pk_EnrollmentSession` (Id)

**Foreign Keys:**
- `fk_application` → Enrollment.EnrollmentProgram(Id)
- `fk_application_applicant` → Enrollment.Applicant(Id)

---

#### Enrollment.Prompt

Prompts/questions within enrollment programs with conditional logic support.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| Id | UNIQUEIDENTIFIER | No | Primary key |
| ProgramId | UNIQUEIDENTIFIER | No | Foreign key to EnrollmentProgram |
| Token | VARCHAR(256) | No | Unique token |
| Name | VARCHAR(256) | No | Prompt name (unique within program) |
| Key | VARCHAR(256) | Yes | Prompt key |
| KeyPath | VARCHAR(MAX) | Yes | Hierarchical key path |
| Title | VARCHAR(256) | Yes | Display title |
| IsRequired | BIT | Yes | Required field flag |
| Header | VARCHAR(256) | Yes | Header text |
| SubHeader | VARCHAR(MAX) | Yes | Sub-header text |
| Instructions | VARCHAR(MAX) | Yes | Instruction text |
| ConditionKeySource | NVARCHAR(255) | Yes | Conditional logic source key |
| ComparisonOperator | NVARCHAR(50) | Yes | Conditional comparison operator |
| ConditionValueKey | NVARCHAR(255) | Yes | Conditional value key |
| ConditionValue | NVARCHAR(255) | Yes | Conditional value |

**Primary Key:** `pk_EnrollmentProgram_0` (Id)

**Foreign Keys:**
- `fk_prompts_enrollmentprogram` → Enrollment.EnrollmentProgram(Id) ON DELETE CASCADE

**Unique Constraints:**
- `unique_ProgramId_Prompt_Name` - Unique(ProgramId, Name)

---

#### Other Enrollment Tables

Additional tables in the Enrollment schema include:
- **Account** - Enrollment account information
- **Address** - Address data
- **AddressType** - Address type lookup
- **Applicant** - Applicant profiles
- **ApplicantBusinessInfo** - Business information for applicants
- **ApplicationEvent** - Application lifecycle events
- **Dimension** - Dimension metadata
- **Employee** - Employee information
- **EmployeeSchool** - Employee-school associations
- **EmployeeSubServices** - Employee sub-services
- **EmployeeSubServiceType** - Sub-service type lookup
- **EmployeeTherapy** - Therapy provider information
- **EmployeeTutor** - Tutor information
- **EmployeeType** - Employee type lookup
- **EmployeeValidatedStatus** - Validation status lookup
- **EnrollmentBuilderHistory** - Program builder change history
- **EnrollmentBuilderHistoryNote** - History notes
- **EnrollmentProgramEvent** - Program lifecycle events
- **HistoryType** - History type lookup
- **Input** - Input field definitions
- **InputOption** - Input option choices
- **Measure** - Measurement metadata
- **Persona** - User persona definitions
- **PromptComponent** - Prompt UI components
- **PromptData** - Prompt response data
- **PromptHierarchy** - Prompt hierarchy relationships
- **PromptIdFileUpload** - File upload tracking
- **SemanticLayer** - Semantic layer metadata
- **SemanticLayerEvent** - Semantic layer events

---

## Households Schema

The Households schema manages household and student relationships.

### Tables

#### Households.Household

Household information linking legal guardians to their address and account.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| Id | UNIQUEIDENTIFIER | No | Primary key (default: newid()) |
| HouseHoldName | NVARCHAR(255) | No | Household name |
| LegalGuardianPersonId | UNIQUEIDENTIFIER | No | Foreign key to K12.Person |
| LegalGuardianAccountId | UNIQUEIDENTIFIER | No | Foreign key to K12.Account |
| PersonalAddressId | UNIQUEIDENTIFIER | No | Foreign key to K12.PersonalAddress |
| DateCreated | DATETIMEOFFSET(7) | No | Creation timestamp (default: sysdatetimeoffset()) |

**Primary Key:** `PK_Household` (Id)

**Foreign Keys:**
- `FK_Household_LegalGuadianPerson` → K12.Person(Id)
- `FK_Household_PersonalAddress` → K12.PersonalAddress(Id)
- `FK_Household_Account` → K12.Account(Id)

---

#### Households.Student

Student information linked to households and persons.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| Id | UNIQUEIDENTIFIER | No | Primary key (also FK to K12.Person) |
| StudentId | INT | Yes | Student ID number |
| HouseholdId | UNIQUEIDENTIFIER | No | Foreign key to Household |
| ProgramTypeId | INT | Yes | Program type |
| IsDisabled | BIT | No | Disability status (default: 0) |
| DateCreated | DATETIMEOFFSET(7) | No | Creation timestamp (default: sysdatetimeoffset()) |

**Primary Key:** `PK_Household_Student` (Id)

**Foreign Keys:**
- `FK_Household_Student_Person` → K12.Person(Id)
- `FK_Household_Household` → Household.Household(Id)

---

## K12 Schema

The K12 schema contains core domain entities used across the entire system.

### Tables

#### K12.Account

User account information with authentication tokens and persona assignment.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| Id | UNIQUEIDENTIFIER | No | Primary key |
| PersonId | UNIQUEIDENTIFIER | No | Foreign key to Person |
| Token | VARCHAR(256) | No | Unique authentication token |
| ApplicantId | UNIQUEIDENTIFIER | Yes | Foreign key to Enrollment.Applicant (unique) |
| PersonaId | INT | No | Foreign key to Enrollment.Persona |
| Email | VARCHAR(255) | Yes | Email address |
| UPN | VARCHAR(255) | Yes | User Principal Name (Azure AD) |
| DateCreated | DATETIMEOFFSET | No | Creation timestamp (default: sysdatetimeoffset()) |
| DateUpdated | DATETIMEOFFSET | Yes | Last update timestamp (default: sysdatetimeoffset()) |
| Source | VARCHAR(20) | Yes | Account source system |

**Primary Key:** `pk_K12_Account` (Id)

**Foreign Keys:**
- `fk_k12_account_person` → K12.Person(Id)
- `fk_k12_account_applicant` → Enrollment.Applicant(Id)
- `fk_k12_account_persona` → Enrollment.Persona(Id)

**Unique Constraints:**
- `unq_K12_Account_token` - Unique nonclustered(Token)
- `unq_K12_Account_ApplicantId` - Unique nonclustered(ApplicantId)

---

#### K12.Person

Core person entity containing name and demographic information.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| Id | UNIQUEIDENTIFIER | No | Primary key |
| FirstName | VARCHAR(100) | Yes | First name |
| LastName | VARCHAR(100) | Yes | Last name |
| MiddleName | VARCHAR(100) | Yes | Middle name |
| Title | VARCHAR(100) | Yes | Title (Mr., Mrs., Dr., etc.) |
| Suffix | VARCHAR(25) | Yes | Suffix (Jr., Sr., III, etc.) |
| DateCreated | DATETIMEOFFSET(7) | No | Creation timestamp (default: sysdatetimeoffset()) |
| DateUpdated | DATETIMEOFFSET(7) | Yes | Last update timestamp (default: sysdatetimeoffset()) |
| Source | VARCHAR(20) | Yes | Source system |

**Primary Key:** `pk_K12_Person` (Id)

---

#### Other K12 Tables

Additional tables in the K12 schema include:
- **Phone** - Phone number information
- **PhoneType** - Phone type lookup
- **Grade** - Grade level lookup
- **Household** - Household information (different from Households schema)
- **BusinessAddress** - Business address information
- **PersonalAddress** - Personal address information (not shown in files read)
- **Agreement** - Agreement/contract tracking
- **AgreementStructure** - Agreement structure definitions
- **AccountAgreementSubmission** - Agreement submission tracking
- **DocumentType** - Document type lookup
- **FileExtension** - File extension lookup
- **Schedules** - Scheduling information
- **SubTask** - Sub-task definitions
- **TaskType** - Task type lookup
- **TaskTypeSubTask** - Task-SubTask relationships
- **TaskStatus** - Task status lookup
- **TaskNote** - Task notes
- **TaskNoteType** - Task note type lookup

---

## Panda Schema

The Panda schema manages PandaDoc integration for document generation and tracking.

### Tables

#### Panda.Template

PandaDoc template definitions.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| TemplateId | NVARCHAR(31) | No | Primary key (PandaDoc template ID) |
| Title | NVARCHAR(255) | No | Template title |
| IsActive | BIT | Yes | Active status (default: 1) |
| CreatedDate | DATETIMEOFFSET(7) | No | Creation timestamp (default: sysdatetimeoffset()) |
| ModifiedDate | DATETIMEOFFSET(7) | Yes | Modification timestamp |

**Primary Key:** `PK_Panda_Template_Id` (TemplateId)

---

#### Panda.SentDocument

Tracks documents sent via PandaDoc to accounts and partners.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| DocumentId | NVARCHAR(31) | No | PandaDoc document ID |
| TemplateId | NVARCHAR(31) | No | Foreign key to Template |
| AccountId | UNIQUEIDENTIFIER | No | Foreign key to K12.Account |
| ProgramPartnerId | UNIQUEIDENTIFIER | No | Foreign key to Partner.ProgramPartner |
| Title | NVARCHAR(255) | No | Document title |
| StatusId | INT | No | Foreign key to DocumentStatus (default: 1) |
| DocumentName | NVARCHAR(255) | Yes | Document filename |
| Version | INT | Yes | Document version (default: 1) |
| CreatedDate | DATETIMEOFFSET(7) | No | Creation timestamp (default: sysdatetimeoffset()) |
| ModifiedDate | DATETIMEOFFSET(7) | Yes | Modification timestamp |

**Primary Key:** `PK_Panda_SentDocument_Unique` (DocumentId, AccountId, ProgramPartnerId)

**Foreign Keys:**
- `FK_Panda_SentDocument_TemplateId` → Panda.Template(TemplateId)
- `FK_Panda_SentDocument_AccountId` → K12.Account(Id)
- `FK_Panda_SentDocument_ProgramPartnerId` → Partner.ProgramPartner(Id)
- `FK_Panda_SentDocument_StatusId` → Panda.DocumentStatus(Id)

---

#### Panda.DocumentStatus

Document status lookup table (not shown in files read, but referenced).

---

## Partner Schema

The Partner schema manages program partners (providers, schools, vendors, etc.).

### Tables

#### Partner.ProgramPartnerType

Lookup table for partner types (Provider, School, Vendor, etc.).

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| Id | INT IDENTITY | No | Primary key |
| Name | VARCHAR(50) | No | Type name |
| Description | NVARCHAR(255) | Yes | Type description |

**Primary Key:** `PK_ProgramPartnerType` (Id)

---

#### Other Partner Tables

Additional tables in the Partner schema include:
- **ProgramPartner** - Main partner entity (referenced but not shown)
- **ProgramPartnerPhone** - Partner phone numbers
- **Notes** - Partner notes

---

## Provider Schema

The Provider schema contains provider-specific data and classifications.

### Tables

Provider-specific tables include:
- **EmployeeType** - Employee type lookup
- **EmployeeSubServices** - Sub-services offered by employees
- **EmployeeSubServiceType** - Sub-service type lookup
- **EmployeeValidatedStatus** - Validation status lookup
- **ProviderEnrollmentStatus** - Provider enrollment status lookup
- **ProviderSize** - Provider size categories
- **ProviderType** - Provider type lookup
- **TherapyLicenseType** - Therapy license type lookup

---

## Schools Schema

The Schools schema manages school and institution data, programs, and student enrollments.

### Tables

#### Schools.Institution

School or institution entity with business information.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| Id | UNIQUEIDENTIFIER | No | Primary key (default: newid()) |
| HDMAAccountId | UNIQUEIDENTIFIER | Yes | Foreign key to K12.Account |
| Name | NVARCHAR(255) | Yes | Institution name |
| FederalEmployerID | NVARCHAR(255) | Yes | Federal EIN |
| FiscalYearEndDate | DATETIME2 | Yes | Fiscal year end date |
| BackgroundCheckValidatedDate | DATETIME2 | Yes | Background check validation date |
| BackgroundCheckNameOnFile | NVARCHAR(255) | Yes | Name on background check |
| BusinessAddressId | UNIQUEIDENTIFIER | Yes | Foreign key to K12.BusinessAddress |

**Primary Key:** `PK_Insitution` (Id)

**Foreign Keys:**
- `FK_Insitution_HDMAAccount` → K12.Account(Id)
- `FK_Insitution_BusinessAddress` → K12.BusinessAddress(Id)

---

#### Schools.Program

School program definitions.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| ProgramId | INT IDENTITY | No | Primary key |
| Name | NVARCHAR(255) | No | Program name |
| IsActive | BIT | No | Active status (default: 1) |

**Primary Key:** `PK_Program` (ProgramId)

**Note:** TODO comment indicates this table may be deprecated.

---

#### Other Schools Tables

Additional tables in the Schools schema include:
- **SchoolGrade** - Grade levels offered by schools
- **Grade** - Grade level lookup
- **SchoolTerm** - School term definitions
- **SchoolTermGrade** - Grade availability by term
- **SchoolType** - School type lookup
- **OperationalScheduleType** - Operational schedule lookup
- **StudentEnrollment** - Student enrollment records
- **StudentProgram** - Student program associations
- **EnrollmentStatus** - Enrollment status lookup
- **PaymentStatus** - Payment status lookup

---

## Security Schema

The Security schema handles sensitive data hashing and user access control.

### Tables

#### Security.HashData

Stores hashed sensitive data (SSN, DOB) for persons.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| Id | UNIQUEIDENTIFIER | No | Primary key (FK to K12.Person) |
| SSN_Hash | VARCHAR(255) | No | Hashed Social Security Number |
| DOB_Hash | VARCHAR(255) | No | Hashed Date of Birth |
| Mask_SSN | VARCHAR(4) | No | Last 4 digits of SSN (masked) |
| DateCreated | DATETIMEOFFSET(7) | No | Creation timestamp |

**Primary Key:** `PK_Household` (Id)

**Foreign Keys:**
- `FK_Security_HashData` → K12.Person(Id)

**Purpose:** Stores one-way hashed sensitive data for compliance and security. Original SSN and DOB are never stored in plain text.

---

#### Security.UserResourceAccessMap

Maps users to resources they can access with Azure AD integration.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| UserObjectId | UNIQUEIDENTIFIER | No | Azure AD user object ID |
| ResourceId | UNIQUEIDENTIFIER | No | Resource identifier |
| ResourceType | NVARCHAR(50) | No | Resource type (School, Household, etc.) |
| EntraResourceType | NVARCHAR(50) | No | Entra resource type (Group, Role, etc.) |
| EntraResourceName | NVARCHAR(100) | No | Entra resource name |
| AccessType | NVARCHAR(50) | No | Type of access granted |
| DateCreated | DATETIME2(7) | No | Creation timestamp (default: getutcdate()) |

**Primary Key:** `PK_UserResourceAccessMap` (UserObjectId, ResourceId, ResourceType)

**Indexes:**
- `IX_UserResourceAccessMap_UserObjectId` - Nonclustered index on (UserObjectId)

**Purpose:** Controls fine-grained access to resources based on Azure AD group/role membership.

---

## Entity Relationship Diagrams

### Core Domain Relationships

```
K12.Person
    ├─> K12.Account (PersonId)
    ├─> Security.HashData (Id)
    └─> Households.Student (Id)

K12.Account
    ├─> Enrollment.Applicant (ApplicantId)
    ├─> Enrollment.Persona (PersonaId)
    ├─> Households.Household (LegalGuardianAccountId)
    └─> Comms.Communication (CreatedBy)
```

### Awards Domain Relationships

```
Awards.AcademicYear
    ├─> Awards.ESALotterySettings (AcademicYearId)
    ├─> Awards.OSLotterySettings (AcademicYearId)
    └─> Awards.Applications (AcademicYearId)

Awards.LotteryStudents
    └─> Awards.Applications (StudentId)

Awards.ProgramType
    └─> Awards.Applications (ProgramTypeId)
```

### Enrollment Domain Relationships

```
Enrollment.EnrollmentProgram
    ├─> Enrollment.Application (EnrollmentProgramId)
    └─> Enrollment.Prompt (ProgramId)

Enrollment.Applicant
    ├─> K12.Account (ApplicantId)
    └─> Enrollment.Application (ApplicantId)
```

### Households Domain Relationships

```
Households.Household
    ├─> K12.Person (LegalGuardianPersonId)
    ├─> K12.Account (LegalGuardianAccountId)
    ├─> K12.PersonalAddress (PersonalAddressId)
    └─> Households.Student (HouseholdId)
```

### Communications Domain Relationships

```
Comms.CommunicationTemplate
    ├─> Comms.CommunicationType (CommunicationTypeId)
    ├─> Partner.ProgramPartnerType (ProgramPartnerTypeId)
    ├─> Comms.CommunicationTemplateStatus (CommunicationTemplateStatusId)
    ├─> Comms.AlertBannerType (AlertBannerTypeId)
    └─> Comms.Communication (CommunicationTemplateId)

Comms.Communication
    └─> K12.Account (CreatedBy, ModifiedBy)
```

### Schools Domain Relationships

```
Schools.Institution
    ├─> K12.Account (HDMAAccountId)
    └─> K12.BusinessAddress (BusinessAddressId)
```

### Panda Domain Relationships

```
Panda.Template
    └─> Panda.SentDocument (TemplateId)

Panda.SentDocument
    ├─> K12.Account (AccountId)
    ├─> Partner.ProgramPartner (ProgramPartnerId)
    └─> Panda.DocumentStatus (StatusId)
```

---

## Indexes and Performance

### Key Indexing Strategies

1. **Foreign Key Indexes:** All foreign key columns have nonclustered indexes for efficient joins
2. **Date Range Indexes:** Composite indexes on start/end date pairs for range queries
3. **Lookup Optimization:** Unique indexes on natural keys (Token, Name, etc.)
4. **Composite Indexes:** Multi-column indexes on frequently queried combinations

### Performance Considerations

- **Dapper Usage:** Repository pattern uses Dapper for lightweight data access
- **No ORM Overhead:** Entity Framework is used only for model generation, not runtime queries
- **Parameterized Queries:** All Dapper queries use parameterization to prevent SQL injection
- **Managed Identity:** Database connections use Azure AD authentication for security

### Common Query Patterns

The database is optimized for:
- Enrollment session lookups by applicant
- Lottery application queries by academic year and program type
- Communication template retrieval by type and status
- Household and student relationship queries
- Resource access validation queries

---

## Database Maintenance

### Pre-Deployment Scripts

Pre-deployment scripts handle schema changes and data migrations:
- `Awards/PreDeployment/Script.DeSeedLotterySettings_K12_3201.sql`
- `Comms/PreDeployment/Script.DropCommsSchemaTables.sql`
- `K12/PreDeployment/AudienceIdToProgramPartnerTypeId.sql`
- `K12/PreDeployment/FixSchoolsOnSchemaRework.sql`
- `K12/PreDeployment/RemoveTaskTypes.sql`
- `Provider/PreDeployment/Script.DropEmployeeProviderId.sql`

### Post-Deployment Scripts

Post-deployment scripts seed reference data:
- `Awards/PostDeployment/Script.SeedProgramTypes.sql`
- `Awards/PostDeployment/Script.SeedAcademicYear.sql`
- `Awards/PostDeployment/Script.SeedESALotterySettings.sql`
- `Comms/PostDeployment/Script.SeedAccountMessageTests.sql`
- `Enrollment/PostDeployment/Script.SeedEnrollmentTypesAndStatuses.sql`
- `K12/PostDeployment/Script.SeedK12TypesAndStatuses.sql`
- `K12/PostDeployment/Script.SeedEntraAccounts.sql`
- `Partner/PostDeployment/Script.SeedPartnerTypesAndStatuses.sql`
- `Partner/PostDeployment/Script.MigrateProviderToProgramPartner.sql`

### Stored Procedures

- `Awards/Stored Procedures/spGenerateLottery.sql` - Lottery generation procedure

### Sequences

- `Partner/Sequences/RecordNumberSeq.sql` - Record number sequence generator

---

## Security and Compliance

### Data Protection

1. **Sensitive Data Hashing:** SSN and DOB stored as one-way hashes in Security.HashData
2. **Masked Display:** Only last 4 digits of SSN stored for display purposes
3. **Managed Identity:** Azure AD Managed Identity for database authentication
4. **Row-Level Security:** UserResourceAccessMap enforces access control

### Access Control

Users must be granted database access via Azure SQL:

```sql
CREATE USER [<function-app-name>] FROM EXTERNAL PROVIDER;
ALTER ROLE db_datareader ADD MEMBER [<function-app-name>];
ALTER ROLE db_datawriter ADD MEMBER [<function-app-name>];
GRANT EXECUTE TO [<function-app-name>];
```

---

## Appendix

### Schema Evolution Notes

- The database follows a code-first approach with SQL scripts for schema definitions
- Entity Framework is used to generate C# models but NOT for data access
- All data access uses Dapper micro-ORM for performance and control
- Schema changes require SQL migration scripts in Pre/Post-Deployment folders

### Development Environment

- **Local Development:** Docker SQL Server container (see build-docker.sh)
- **Connection:** localhost, User: sa, Password: YourStrong!Passw0rd
- **Azure Environments:** Development, Testing, Staging, Production
- **IP Whitelisting:** Required for direct database access

### Related Documentation

- [Backend Architecture](./Backend-Architecture.md) (if exists)
- [API Documentation](./API-Documentation.md) (if exists)
- [Deployment Guide](./Deployment-Guide.md) (if exists)

---

**Last Updated:** 2025-01-16
**Database Version:** Current as of project snapshot
**Contact:** DevOps Team for database access and migrations
