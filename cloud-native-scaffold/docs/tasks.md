# Tasks - API Stubs and Infrastructure

## Phase 1: Shared Contracts

- [ ] Add Programs DTOs to K12.Contracts
  - [ ] Create `Programs/ProgramDto.cs`
  - [ ] Create `Programs/CreateProgramRequest.cs`
  - [ ] Create `Programs/UpdateProgramRequest.cs`
- [ ] Add Admin DTOs to K12.Contracts
  - [ ] Create `Admin/UserDto.cs`
  - [ ] Create `Admin/CreateUserRequest.cs`
  - [ ] Create `Admin/UpdateUserRequest.cs`

---

## Phase 2: Programs API Features

### 2.1 GetPrograms Query

- [ ] Create `Features/GetPrograms/` folder
- [ ] Implement `GetProgramsQuery.cs`
- [ ] Implement `GetProgramsHandler.cs` (stub)
- [ ] Implement `GetProgramsEndpoint.cs`

### 2.2 GetProgramById Query

- [ ] Create `Features/GetProgramById/` folder
- [ ] Implement `GetProgramByIdQuery.cs`
- [ ] Implement `GetProgramByIdHandler.cs` (stub)
- [ ] Implement `GetProgramByIdEndpoint.cs`

### 2.3 CreateProgram Command

- [ ] Create `Features/CreateProgram/` folder
- [ ] Implement `CreateProgramCommand.cs`
- [ ] Implement `CreateProgramValidator.cs`
- [ ] Implement `CreateProgramHandler.cs` (stub)
- [ ] Implement `CreateProgramEndpoint.cs`

### 2.4 UpdateProgram Command

- [ ] Create `Features/UpdateProgram/` folder
- [ ] Implement `UpdateProgramCommand.cs`
- [ ] Implement `UpdateProgramValidator.cs`
- [ ] Implement `UpdateProgramHandler.cs` (stub)
- [ ] Implement `UpdateProgramEndpoint.cs`

### 2.5 Programs API Integration

- [ ] Create `DependencyInjection.cs`
- [ ] Update `Program.cs` to register services and map endpoints

---

## Phase 3: Admin API Features

### 3.1 GetUsers Query

- [ ] Create `Features/GetUsers/` folder
- [ ] Implement `GetUsersQuery.cs`
- [ ] Implement `GetUsersHandler.cs` (stub)
- [ ] Implement `GetUsersEndpoint.cs`

### 3.2 GetUserById Query

- [ ] Create `Features/GetUserById/` folder
- [ ] Implement `GetUserByIdQuery.cs`
- [ ] Implement `GetUserByIdHandler.cs` (stub)
- [ ] Implement `GetUserByIdEndpoint.cs`

### 3.3 CreateUser Command

- [ ] Create `Features/CreateUser/` folder
- [ ] Implement `CreateUserCommand.cs`
- [ ] Implement `CreateUserValidator.cs`
- [ ] Implement `CreateUserHandler.cs` (stub)
- [ ] Implement `CreateUserEndpoint.cs`

### 3.4 UpdateUser Command

- [ ] Create `Features/UpdateUser/` folder
- [ ] Implement `UpdateUserCommand.cs`
- [ ] Implement `UpdateUserValidator.cs`
- [ ] Implement `UpdateUserHandler.cs` (stub)
- [ ] Implement `UpdateUserEndpoint.cs`

### 3.5 Admin API Integration

- [ ] Create `DependencyInjection.cs`
- [ ] Update `Program.cs` to register services and map endpoints

---

## Phase 4: Infrastructure Stubs

### 4.1 Database Migrations Project

- [ ] Create `src/Database.Migrations/` project
- [ ] Add `Database.Migrations.csproj`
- [ ] Add `Program.cs` with DbUp runner
- [ ] Add `Scripts/001_InitialSchema.sql` placeholder
- [ ] Add project to solution

### 4.2 CI/CD Pipeline

- [ ] Create `.github/workflows/ci-cd.yml`
- [ ] Configure build job
- [ ] Configure test job (placeholder)
- [ ] Configure deployment job (placeholder)

---

## Phase 5: Verification

- [ ] Build solution: `dotnet build`
- [ ] Run Aspire AppHost to verify endpoints
- [ ] Verify Swagger UI shows new endpoints
