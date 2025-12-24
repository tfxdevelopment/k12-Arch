# C4 Level 3: Frontend Component Diagram

## Angular Nx Monorepo Architecture

```mermaid
C4Component
    title Component Diagram for K12 MyPortal Frontend (Angular 19 + Nx)

    Container_Boundary(frontend, "k12-web-enrollment Nx Monorepo") {
        Container_Boundary(apps, "Applications") {
            Component(admin, "Admin App", "Angular 19", "Administrative portal (port 4200)")
            Component(enrollment, "Enrollment App", "Angular 19", "Household enrollment (port 4300)")
            Component(providers, "Providers App", "Angular 19", "Provider management (port 4500)")
            Component(schools, "Schools App", "Angular 19", "School management (port 4600)")
        }

        Container_Boundary(shared, "Shared Library (projects/shared/)") {
            Component(shared_components, "Shared Components", "Angular", "Reusable UI components")
            Component(shared_services, "Shared Services", "TypeScript", "HTTP services, state management")
            Component(shared_guards, "Guards", "Angular", "Route protection, auth guards")
            Component(shared_interceptors, "Interceptors", "Angular", "HTTP interceptors")
            Component(shared_models, "Models/Enums", "TypeScript", "Shared types and interfaces")
        }
    }

    System_Ext(apim, "Azure API Management", "API Gateway")
    System_Ext(entra, "Microsoft Entra ID B2C", "Identity Provider")
    System_Ext(signalr, "Azure SignalR", "Real-time notifications")

    Rel(admin, shared_components, "Uses")
    Rel(admin, shared_services, "Uses")
    Rel(admin, shared_guards, "Uses")
    Rel(enrollment, shared_components, "Uses")
    Rel(enrollment, shared_services, "Uses")
    Rel(providers, shared_components, "Uses")
    Rel(schools, shared_components, "Uses")

    Rel(shared_services, apim, "API calls", "HTTPS/JSON")
    Rel(shared_guards, entra, "Auth check", "MSAL")
    Rel(shared_services, signalr, "Real-time", "WebSocket")
```

## Monorepo Structure

```
k12-web-enrollment/
├── apps/
│   ├── admin/                    # Admin Portal (4200)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── app.routes.ts
│   │   │   │   ├── app.config.ts
│   │   │   │   ├── app.component.ts
│   │   │   │   └── features/     # Feature modules
│   │   │   │       ├── dashboard/
│   │   │   │       ├── programs/
│   │   │   │       ├── applications/
│   │   │   │       ├── users/
│   │   │   │       └── reports/
│   │   │   └── environments/
│   │   └── project.json
│   │
│   ├── enrollment/               # Household Enrollment (4300)
│   │   └── src/app/features/
│   │       ├── application/
│   │       ├── documents/
│   │       ├── household/
│   │       └── status/
│   │
│   ├── providers/                # Provider Portal (4500)
│   │   └── src/app/features/
│   │       ├── dashboard/
│   │       ├── services/
│   │       ├── invoices/
│   │       └── staff/
│   │
│   └── schools/                  # School Portal (4600)
│       └── src/app/features/
│           ├── dashboard/
│           ├── students/
│           ├── enrollment/
│           └── funding/
│
├── projects/
│   └── shared/                   # Shared Library
│       ├── components/           # Reusable UI components
│       │   ├── layout/
│       │   ├── forms/
│       │   ├── tables/
│       │   └── dialogs/
│       ├── services/             # HTTP and state services
│       │   ├── api.service.ts
│       │   ├── auth.service.ts
│       │   ├── signalr.service.ts
│       │   └── state/
│       ├── guards/               # Route guards
│       │   ├── auth.guard.ts
│       │   ├── role.guard.ts
│       │   └── unsaved-changes.guard.ts
│       ├── interceptors/         # HTTP interceptors
│       │   ├── auth.interceptor.ts
│       │   ├── error.interceptor.ts
│       │   └── loading.interceptor.ts
│       ├── models/               # TypeScript interfaces
│       │   ├── student.model.ts
│       │   ├── application.model.ts
│       │   └── ...
│       ├── enums/                # Enumerations
│       │   ├── application-status.enum.ts
│       │   └── ...
│       └── public-api.ts         # Library exports
│
├── nx.json                       # Nx workspace configuration
├── package.json                  # Dependencies
└── tsconfig.base.json            # TypeScript configuration
```

## Application Architecture Pattern

```mermaid
flowchart TB
    subgraph App["Angular Application"]
        subgraph Routing["Routing Layer"]
            router["Angular Router"]
            guards["Route Guards"]
        end

        subgraph Components["Component Layer"]
            smart["Smart Components<br/>(Container)"]
            dumb["Dumb Components<br/>(Presentational)"]
        end

        subgraph State["State Management"]
            services["RxJS Services"]
            subjects["BehaviorSubjects"]
            signals["Angular Signals"]
        end

        subgraph HTTP["HTTP Layer"]
            interceptors["Interceptors"]
            api_service["API Service"]
        end
    end

    subgraph External["External Systems"]
        api["Backend API"]
        auth["Entra ID"]
        realtime["SignalR"]
    end

    router --> guards
    guards --> smart
    smart --> dumb
    smart --> services
    services --> subjects
    services --> signals
    services --> api_service
    api_service --> interceptors
    interceptors --> api
    guards --> auth
    services --> realtime

    style Routing fill:#e3f2fd
    style Components fill:#e8f5e9
    style State fill:#fff3e0
    style HTTP fill:#fce4ec
    style External fill:#f5f5f5
```

## Shared Components Library

### Layout Components

```mermaid
flowchart TB
    subgraph Layout["Layout Components"]
        app_shell["AppShellComponent<br/>Main application wrapper"]
        header["HeaderComponent<br/>Top navigation bar"]
        sidebar["SidebarComponent<br/>Left navigation"]
        footer["FooterComponent<br/>Bottom bar"]
        breadcrumb["BreadcrumbComponent<br/>Navigation trail"]
    end

    app_shell --> header
    app_shell --> sidebar
    app_shell --> footer
    sidebar --> breadcrumb

    style Layout fill:#e3f2fd
```

| Component | Purpose | Used By |
|-----------|---------|---------|
| `AppShellComponent` | Main layout wrapper with header/sidebar/content | All apps |
| `HeaderComponent` | Top navigation, user menu, notifications | All apps |
| `SidebarComponent` | Left navigation menu (configurable per app) | All apps |
| `BreadcrumbComponent` | Navigation breadcrumb trail | All apps |
| `FooterComponent` | Footer with links, version info | All apps |

### Form Components

| Component | Purpose | Features |
|-----------|---------|----------|
| `FormFieldComponent` | Wrapper for form inputs | Validation display, labels |
| `DatePickerComponent` | Date selection | Min/max dates, format |
| `FileUploadComponent` | Document upload | Drag & drop, preview |
| `AddressFormComponent` | Address entry | Auto-complete (Melissa) |
| `PhoneInputComponent` | Phone number entry | Formatting, validation |
| `SSNInputComponent` | SSN entry | Masking, validation |

### Table Components

| Component | Purpose | Features |
|-----------|---------|----------|
| `DataTableComponent` | Data grid | Sorting, filtering, pagination |
| `ActionColumnComponent` | Row actions | Edit, delete, view buttons |
| `StatusChipComponent` | Status display | Color-coded chips |
| `ExportButtonComponent` | Data export | CSV, Excel, PDF |

### Dialog Components

| Component | Purpose | Features |
|-----------|---------|----------|
| `ConfirmDialogComponent` | Confirmation modal | Yes/No actions |
| `AlertDialogComponent` | Alert messages | Info, warning, error |
| `FormDialogComponent` | Modal forms | Configurable fields |
| `ViewDialogComponent` | Read-only details | Data display |

## Shared Services

### API Service

```typescript
// projects/shared/services/api.service.ts
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Generic CRUD operations
  get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, { params });
  }

  post<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body);
  }

  put<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, body);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`);
  }
}
```

### Auth Service (MSAL Integration)

```mermaid
sequenceDiagram
    participant User
    participant App
    participant MSAL
    participant EntraB2C
    participant API

    User->>App: Access protected route
    App->>MSAL: Check authentication
    MSAL->>MSAL: Check token cache

    alt Token valid
        MSAL->>App: Return cached token
    else Token expired or missing
        MSAL->>EntraB2C: Redirect to login
        User->>EntraB2C: Enter credentials + MFA
        EntraB2C->>MSAL: Return tokens
        MSAL->>App: Authentication complete
    end

    App->>API: API request + JWT
    API->>App: Protected data
    App->>User: Display content
```

### SignalR Service

```typescript
// projects/shared/services/signalr.service.ts
@Injectable({ providedIn: 'root' })
export class SignalRService {
  private hubConnection: HubConnection;
  private notifications$ = new BehaviorSubject<Notification[]>([]);

  readonly notifications = this.notifications$.asObservable();

  async connect(userId: string): Promise<void> {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.signalRUrl}`, {
        accessTokenFactory: () => this.authService.getAccessToken()
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('ReceiveNotification', (notification: Notification) => {
      const current = this.notifications$.value;
      this.notifications$.next([notification, ...current]);
    });

    await this.hubConnection.start();
    await this.hubConnection.invoke('JoinUserGroup', userId);
  }
}
```

### State Management Pattern

```mermaid
flowchart LR
    subgraph Component["Smart Component"]
        template["Template"]
        class_comp["Component Class"]
    end

    subgraph Service["State Service"]
        behavior["BehaviorSubject<State>"]
        selector["Selectors (computed)"]
        actions["Action Methods"]
    end

    subgraph API["API Layer"]
        http["HTTP Service"]
    end

    class_comp -->|"subscribe"| selector
    class_comp -->|"call"| actions
    template -->|"async pipe"| selector
    actions -->|"next()"| behavior
    actions -->|"request"| http
    http -->|"response"| actions
    behavior -->|"pipe()"| selector

    style Component fill:#e8f5e9
    style Service fill:#fff3e0
    style API fill:#e3f2fd
```

**Example State Service:**

```typescript
// projects/shared/services/state/applications.state.ts
interface ApplicationsState {
  applications: Application[];
  selectedId: string | null;
  loading: boolean;
  error: string | null;
}

@Injectable({ providedIn: 'root' })
export class ApplicationsStateService {
  private state$ = new BehaviorSubject<ApplicationsState>({
    applications: [],
    selectedId: null,
    loading: false,
    error: null
  });

  // Selectors
  readonly applications$ = this.state$.pipe(map(s => s.applications));
  readonly selected$ = this.state$.pipe(
    map(s => s.applications.find(a => a.id === s.selectedId))
  );
  readonly loading$ = this.state$.pipe(map(s => s.loading));

  // Actions
  loadApplications(): void {
    this.updateState({ loading: true, error: null });
    this.api.get<Application[]>('applications').pipe(
      tap(applications => this.updateState({ applications, loading: false })),
      catchError(error => {
        this.updateState({ loading: false, error: error.message });
        return EMPTY;
      })
    ).subscribe();
  }

  selectApplication(id: string): void {
    this.updateState({ selectedId: id });
  }

  private updateState(partial: Partial<ApplicationsState>): void {
    this.state$.next({ ...this.state$.value, ...partial });
  }
}
```

## Guards and Interceptors

### Auth Guard

```typescript
// projects/shared/guards/auth.guard.ts
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};
```

### Role Guard

```typescript
// projects/shared/guards/role.guard.ts
export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const requiredRoles = route.data['roles'] as string[];

  const userRoles = authService.getUserRoles();
  const hasRole = requiredRoles.some(role => userRoles.includes(role));

  if (hasRole) {
    return true;
  }

  return inject(Router).createUrlTree(['/forbidden']);
};
```

### HTTP Interceptors

```mermaid
flowchart LR
    subgraph Interceptors["HTTP Interceptor Chain"]
        auth["AuthInterceptor<br/>Add JWT token"]
        loading["LoadingInterceptor<br/>Show/hide spinner"]
        error["ErrorInterceptor<br/>Handle errors"]
        retry["RetryInterceptor<br/>Retry failed requests"]
    end

    request["HTTP Request"] --> auth
    auth --> loading
    loading --> error
    error --> retry
    retry --> api["API"]

    api --> retry
    retry --> error
    error --> loading
    loading --> auth
    auth --> response["HTTP Response"]

    style Interceptors fill:#fff3e0
```

| Interceptor | Purpose | Implementation |
|-------------|---------|----------------|
| `AuthInterceptor` | Add JWT Bearer token to requests | Inject token from MSAL |
| `LoadingInterceptor` | Show loading spinner during requests | Emit to loading service |
| `ErrorInterceptor` | Handle HTTP errors globally | Show toast notifications |
| `RetryInterceptor` | Retry failed requests | Exponential backoff |

## Application-Specific Features

### Admin Portal (4200)

| Feature Module | Purpose |
|----------------|---------|
| `DashboardModule` | System overview, metrics, alerts |
| `ProgramsModule` | Program management, configuration |
| `ApplicationsModule` | Application review, approval |
| `UsersModule` | User management, roles |
| `ReportsModule` | Reporting, analytics |
| `TasksModule` | Work queue management |
| `SettingsModule` | System configuration |

### Enrollment Portal (4300)

| Feature Module | Purpose |
|----------------|---------|
| `ApplicationModule` | Application wizard |
| `DocumentsModule` | Document upload |
| `HouseholdModule` | Family management |
| `StatusModule` | Application status tracking |
| `AwardsModule` | Award information |

### Providers Portal (4500)

| Feature Module | Purpose |
|----------------|---------|
| `DashboardModule` | Provider overview |
| `ServicesModule` | Service management |
| `InvoicesModule` | Invoice submission |
| `StaffModule` | Staff management |
| `StudentsModule` | Assigned students |

### Schools Portal (4600)

| Feature Module | Purpose |
|----------------|---------|
| `DashboardModule` | School overview |
| `StudentsModule` | Student enrollment |
| `AttendanceModule` | Attendance tracking |
| `FundingModule` | Funding allocation |
| `StaffModule` | Staff management |

## Build Configuration

### Nx Project Configuration

```json
// apps/admin/project.json
{
  "name": "admin",
  "projectType": "application",
  "targets": {
    "build": {
      "executor": "@angular-devkit/build-angular:browser",
      "options": {
        "outputPath": "dist/apps/admin",
        "index": "apps/admin/src/index.html",
        "main": "apps/admin/src/main.ts"
      },
      "configurations": {
        "development": {
          "optimization": false,
          "sourceMap": true
        },
        "production": {
          "optimization": true,
          "sourceMap": false,
          "budgets": [
            { "type": "initial", "maximumWarning": "500kb", "maximumError": "1mb" }
          ]
        }
      }
    },
    "serve": {
      "executor": "@angular-devkit/build-angular:dev-server",
      "options": {
        "port": 4200
      }
    }
  },
  "implicitDependencies": ["shared"]
}
```

### Critical Build Workflow

```mermaid
flowchart LR
    subgraph Build["Build Order (Critical!)"]
        shared["1. Build Shared Library<br/>npm run build:shared"]
        apps["2. Build/Serve Apps<br/>npm run start:admin"]
    end

    shared -->|"Must complete first"| apps

    note["⚠️ Changes to shared library<br/>require rebuild + restart"]

    style Build fill:#fff3e0
```

**Commands:**
```bash
# Always build shared first
npm run build:shared

# Then start individual apps
npm run start:admin      # https://localhost:4200
npm run start:enrollment # http://localhost:4300
npm run start:providers  # http://localhost:4500
npm run start:schools    # http://localhost:4600
```

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Angular** | 19.2.6 | Component framework |
| **Nx** | 21.4.1 | Monorepo management |
| **TypeScript** | 5.7.3 | Type safety |
| **Angular Material** | 19.2.9 | UI components |
| **PrimeNG** | 17.18.9 | Additional UI components |
| **RxJS** | 7.8.1 | Reactive programming |
| **MSAL Angular** | 4.0.12 | Entra ID authentication |
| **SignalR** | 8.x | Real-time communication |
| **Jest** | 29.7.0 | Unit testing |
| **Cypress** | 13.x | E2E testing |

## Related Documentation

- [Container Diagram](02-container-diagram.md)
- [Backend Component Diagram](06-backend-component-diagram.md)
- [ADR-004: Nx Monorepo for Frontend](../../adr/ADR-004-nx-monorepo-frontend.md)
- [ADR-007: Angular 19 Framework](../../adr/ADR-007-angular-19-framework.md)
- [Development Guide](../../05-development/README.md)

---

*Created: December 2025*
*Author: Architecture Team*
*Review Date: Q1 2026*
