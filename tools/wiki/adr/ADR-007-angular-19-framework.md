# ADR-007: Angular 19 Framework for Frontend

**Status:** Accepted
**Date:** 2024-08-12
**Deciders:** CFI Architecture Team (Marty Flournory, Sumith Mathur), K12 Frontend Team
**Technical Story:** Frontend framework selection for 4 user-facing portals

## Context and Problem Statement

The K12 MyPortal system requires four sophisticated frontend applications:
- **Admin Portal** - Complex data management, reporting, system configuration
- **Enrollment Portal** - Multi-step forms, document upload, application tracking
- **Provider Portal** - Service management, student tracking, billing
- **Schools Portal** - Student enrollment, reporting, compliance

Requirements:
- **Enterprise-grade**: Scalable, maintainable, production-ready
- **Type Safety**: Strong typing to prevent runtime errors
- **Accessibility**: WCAG 2.1 Level AA compliance (required for government)
- **Security**: XSS protection, CSRF protection, secure authentication integration
- **Performance**: Fast initial load, efficient change detection
- **Mobile-Responsive**: Work on desktop, tablet, mobile
- **Entra ID B2C Integration**: MSAL for authentication/authorization
- **Complex Forms**: Multi-step wizards, validation, conditional fields
- **Modern UI**: Material Design with customization
- **Developer Experience**: Good tooling, testing, debugging

The question is: which frontend framework should we use?

## Decision Drivers

* **Enterprise Maturity**: Battle-tested in large-scale applications
* **Type Safety**: TypeScript-first approach
* **Team Expertise**: CFI team familiarity with Angular
* **Microsoft Integration**: Seamless MSAL integration for Entra ID B2C
* **Accessibility**: First-class accessibility support (government requirement)
* **Comprehensive Framework**: Batteries-included (no decision fatigue)
* **Long-term Support**: Stable, predictable release cycle
* **Testing**: Robust testing tools built-in
* **Government Sector**: Proven in government applications

## Considered Options

1. **Angular 19** - Full-featured TypeScript framework
2. **React** - Popular UI library with vast ecosystem
3. **Vue 3** - Progressive JavaScript framework
4. **Svelte** - Compile-time framework

## Decision Outcome

**Chosen option:** "Angular 19", because it provides:
1. TypeScript-first design (best type safety)
2. Comprehensive framework (routing, forms, HTTP, testing all included)
3. Excellent Microsoft MSAL integration for Entra ID B2C
4. Angular Material for accessible UI components
5. Strong enterprise support and governance
6. CFI team already experienced with Angular
7. Predictable release cycle (new major version every 6 months)
8. Built-in accessibility features (a11y) for WCAG compliance
9. Proven in government sector applications

### Consequences

#### Good
- Strong type safety with TypeScript prevents many runtime errors
- Comprehensive framework reduces decision fatigue (one way to do things)
- Angular Material provides accessible components out-of-box
- Excellent MSAL integration for Entra ID B2C authentication
- RxJS for reactive programming and complex async flows
- Built-in dependency injection for testability
- Powerful CLI for code generation and scaffolding
- Strong testing tools (Jasmine, Karma, Jest, Cypress)
- Clear architectural patterns (components, services, modules)
- Regular updates and long-term support (LTS)

#### Bad
- Steeper learning curve than React or Vue
- More opinionated (less flexibility)
- Larger bundle size than alternatives (but tree-shaking helps)
- Requires understanding RxJS and Observables
- Migration between major versions can be complex
- Less flexible than React (Angular way vs any way)

#### Neutral
- Requires commitment to Angular ecosystem
- Need to keep up with semi-annual major releases
- Some developers prefer JSX over Angular templates

## Pros and Cons of the Options

### Angular 19 (Chosen)

* **Pro:** TypeScript-first with excellent type safety
* **Pro:** Comprehensive framework (routing, forms, HTTP, testing included)
* **Pro:** Angular Material for accessible UI components
* **Pro:** Excellent MSAL integration for Entra ID
* **Pro:** Strong enterprise support
* **Pro:** CFI team experienced with Angular
* **Pro:** Built-in accessibility (a11y) features
* **Pro:** Dependency injection for testability
* **Pro:** RxJS for complex async operations
* **Pro:** Powerful CLI and tooling
* **Pro:** Clear architectural patterns
* **Pro:** Proven in government applications
* **Con:** Steeper learning curve
* **Con:** More opinionated (less flexible)
* **Con:** Larger bundle size (mitigated with tree-shaking)
* **Con:** Requires understanding RxJS

### React

* **Pro:** Massive ecosystem and community
* **Pro:** Flexibility (many ways to solve problems)
* **Pro:** Smaller bundle size
* **Pro:** JSX syntax many developers prefer
* **Pro:** Easy to learn basics
* **Con:** Not TypeScript-first (TypeScript is addon)
* **Con:** Decision fatigue (routing, state, forms, etc.)
* **Con:** MSAL integration less polished than Angular
* **Con:** Need to choose UI library separately
* **Con:** Accessibility requires more manual work
* **Con:** CFI team less experienced with React
* **Con:** State management complexity (Redux, MobX, Context)

### Vue 3

* **Pro:** Easy to learn
* **Pro:** Good TypeScript support (Composition API)
* **Pro:** Smaller bundle size than Angular
* **Pro:** Flexible (progressive framework)
* **Con:** Smaller enterprise adoption than Angular/React
* **Con:** Smaller ecosystem than React
* **Con:** MSAL integration not as mature
* **Con:** Fewer enterprise-grade UI libraries
* **Con:** CFI team not experienced with Vue
* **Con:** Less proven in government sector

### Svelte

* **Pro:** Smallest bundle size (compiles to vanilla JS)
* **Pro:** Easy to learn
* **Pro:** No virtual DOM overhead
* **Pro:** Reactive by default
* **Con:** Much smaller ecosystem
* **Con:** Newer (less mature) than Angular/React/Vue
* **Con:** TypeScript support improving but not as good
* **Con:** Few enterprise-grade UI libraries
* **Con:** MSAL integration would require custom work
* **Con:** CFI team not experienced with Svelte
* **Con:** Unproven in large enterprise applications

## Technical Details

### Angular 19 Key Features

**Standalone Components (Default):**
```typescript
// No NgModule required for new components
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-student-card',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
    <div class="student-card">
      <h3>{{ student.name }}</h3>
      <button mat-raised-button (click)="viewDetails()">
        View Details
      </button>
    </div>
  `,
  styles: [`
    .student-card {
      padding: 16px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
  `]
})
export class StudentCardComponent {
  @Input() student!: Student;

  viewDetails() {
    // Handle click
  }
}
```

**Signals (New Reactivity System):**
```typescript
import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-application-status',
  template: `
    <div>
      <p>Applications: {{ applicationCount() }}</p>
      <p>Approved: {{ approvedCount() }}</p>
      <p>Approval Rate: {{ approvalRate() }}%</p>
    </div>
  `
})
export class ApplicationStatusComponent {
  applicationCount = signal(0);
  approvedCount = signal(0);

  // Computed signal (updates automatically)
  approvalRate = computed(() => {
    const total = this.applicationCount();
    const approved = this.approvedCount();
    return total > 0 ? (approved / total * 100).toFixed(1) : 0;
  });
}
```

**Reactive Forms with Type Safety:**
```typescript
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

interface StudentForm {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  grade: number;
  specialNeeds: boolean;
}

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="studentForm" (ngSubmit)="onSubmit()">
      <input formControlName="firstName" placeholder="First Name">
      <input formControlName="lastName" placeholder="Last Name">
      <input formControlName="dateOfBirth" type="date">
      <select formControlName="grade">
        <option *ngFor="let g of grades" [value]="g">{{ g }}</option>
      </select>
      <label>
        <input type="checkbox" formControlName="specialNeeds">
        Special Needs
      </label>
      <button type="submit" [disabled]="!studentForm.valid">Submit</button>
    </form>
  `
})
export class StudentFormComponent {
  studentForm: FormGroup<any>;

  grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  constructor(private fb: FormBuilder) {
    this.studentForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      dateOfBirth: [null, Validators.required],
      grade: [null, [Validators.required, Validators.min(1), Validators.max(12)]],
      specialNeeds: [false]
    });
  }

  onSubmit() {
    if (this.studentForm.valid) {
      const student: StudentForm = this.studentForm.value;
      // Submit student
    }
  }
}
```

### MSAL Integration for Entra ID B2C

**app.config.ts:**
```typescript
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import {
  MsalModule,
  MsalService,
  MsalGuard,
  MsalInterceptor,
  MsalBroadcastService
} from '@azure/msal-angular';
import {
  PublicClientApplication,
  InteractionType,
  BrowserCacheLocation
} from '@azure/msal-browser';

import { routes } from './app.routes';

// Azure Government Cloud endpoints
const msalConfig = {
  auth: {
    clientId: 'your-client-id',
    authority: 'https://login.microsoftonline.us/your-tenant-id/B2C_1A_signup_signin',
    knownAuthorities: ['login.microsoftonline.us'],
    redirectUri: 'https://enrollment.myportal.gov/',
    postLogoutRedirectUri: 'https://enrollment.myportal.gov/'
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
    storeAuthStateInCookie: false
  }
};

const msalGuardConfig = {
  interactionType: InteractionType.Redirect,
  authRequest: {
    scopes: ['https://k12api.azurewebsites.us/api/read']
  }
};

const msalInterceptorConfig = {
  interactionType: InteractionType.Redirect,
  protectedResourceMap: new Map([
    ['https://k12-api-prod-func.azurewebsites.us/api/*', ['https://k12api.azurewebsites.us/api/read']]
  ])
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([/* custom interceptors */])
    ),
    provideAnimations(),
    importProvidersFrom(
      MsalModule.forRoot(
        new PublicClientApplication(msalConfig),
        msalGuardConfig,
        msalInterceptorConfig
      )
    ),
    MsalService,
    MsalGuard,
    MsalBroadcastService
  ]
};
```

**Protected Route:**
```typescript
import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [MsalGuard]
  },
  {
    path: 'applications',
    loadChildren: () => import('./applications/applications.routes').then(m => m.routes),
    canActivate: [MsalGuard]
  }
];
```

**Authentication Service:**
```typescript
import { Injectable } from '@angular/core';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { filter, Subject, takeUntil } from 'rxjs';
import { InteractionStatus, EventType } from '@azure/msal-browser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _destroying$ = new Subject<void>();

  isAuthenticated = false;
  username: string | null = null;
  roles: string[] = [];

  constructor(
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService
  ) {
    this.initialize();
  }

  private initialize() {
    // Subscribe to login/logout events
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: any) =>
          msg.eventType === EventType.LOGIN_SUCCESS ||
          msg.eventType === EventType.LOGOUT_SUCCESS
        ),
        takeUntil(this._destroying$)
      )
      .subscribe((result: any) => {
        this.checkAndSetActiveAccount();
      });

    // Subscribe to interaction status
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.checkAndSetActiveAccount();
      });

    this.checkAndSetActiveAccount();
  }

  private checkAndSetActiveAccount() {
    const activeAccount = this.msalService.instance.getActiveAccount();

    if (activeAccount) {
      this.isAuthenticated = true;
      this.username = activeAccount.username;
      this.roles = activeAccount.idTokenClaims?.['extension_Roles'] || [];
    } else {
      this.isAuthenticated = false;
      this.username = null;
      this.roles = [];
    }
  }

  login() {
    this.msalService.loginRedirect();
  }

  logout() {
    this.msalService.logoutRedirect();
  }

  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

  ngOnDestroy() {
    this._destroying$.next();
    this._destroying$.complete();
  }
}
```

### Angular Material Integration

**Material Theme Configuration:**
```scss
// styles.scss
@use '@angular/material' as mat;

@include mat.core();

// Define custom theme colors
$primary-palette: mat.define-palette(mat.$indigo-palette);
$accent-palette: mat.define-palette(mat.$pink-palette, A200, A100, A400);
$warn-palette: mat.define-palette(mat.$red-palette);

$theme: mat.define-light-theme((
  color: (
    primary: $primary-palette,
    accent: $accent-palette,
    warn: $warn-palette,
  ),
  typography: mat.define-typography-config(),
  density: 0,
));

@include mat.all-component-themes($theme);

// Accessibility: High contrast mode support
@media (prefers-contrast: high) {
  // Enhanced contrast styles
}
```

**Material Components Usage:**
```typescript
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-students-table',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatPaginatorModule],
  template: `
    <table mat-table [dataSource]="students">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Name</th>
        <td mat-cell *matCellDef="let student">{{ student.name }}</td>
      </ng-container>

      <ng-container matColumnDef="grade">
        <th mat-header-cell *matHeaderCellDef>Grade</th>
        <td mat-cell *matCellDef="let student">{{ student.grade }}</td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell *matCellDef="let student">
          <button mat-icon-button (click)="edit(student)">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button (click)="delete(student)">
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>

    <mat-paginator
      [length]="totalStudents"
      [pageSize]="10"
      [pageSizeOptions]="[5, 10, 25, 100]">
    </mat-paginator>
  `
})
export class StudentsTableComponent {
  students: Student[] = [];
  totalStudents = 0;
  displayedColumns = ['name', 'grade', 'actions'];

  edit(student: Student) { /* ... */ }
  delete(student: Student) { /* ... */ }
}
```

### Accessibility (WCAG 2.1 Level AA)

**Built-in Accessibility Features:**
```typescript
import { Component } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-application-submit',
  template: `
    <button
      (click)="submitApplication()"
      [attr.aria-label]="'Submit application for ' + studentName"
      [attr.aria-busy]="isSubmitting"
      [disabled]="isSubmitting">
      {{ isSubmitting ? 'Submitting...' : 'Submit Application' }}
    </button>

    <!-- Screen reader only status messages -->
    <div class="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {{ statusMessage }}
    </div>
  `,
  styles: [`
    .sr-only {
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    }
  `]
})
export class ApplicationSubmitComponent {
  studentName = 'John Doe';
  isSubmitting = false;
  statusMessage = '';

  constructor(private liveAnnouncer: LiveAnnouncer) {}

  submitApplication() {
    this.isSubmitting = true;
    this.statusMessage = 'Submitting application...';

    // Submit application
    this.apiService.submitApplication().subscribe({
      next: () => {
        this.isSubmitting = false;
        this.statusMessage = 'Application submitted successfully';
        this.liveAnnouncer.announce('Application submitted successfully');
      },
      error: () => {
        this.isSubmitting = false;
        this.statusMessage = 'Error submitting application. Please try again.';
        this.liveAnnouncer.announce('Error submitting application');
      }
    });
  }
}
```

### Performance Optimization

**Lazy Loading Modules:**
```typescript
export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.routes)
  },
  {
    path: 'reports',
    loadComponent: () => import('./reports/reports.component').then(m => m.ReportsComponent)
  }
];
```

**OnPush Change Detection:**
```typescript
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-student-list',
  changeDetection: ChangeDetectionStrategy.OnPush,  // Faster change detection
  template: `...`
})
export class StudentListComponent {
  @Input() students!: Student[];
}
```

### Testing

**Unit Test with Angular Testing Library:**
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentCardComponent } from './student-card.component';

describe('StudentCardComponent', () => {
  let component: StudentCardComponent;
  let fixture: ComponentFixture<StudentCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentCardComponent);
    component = fixture.componentInstance;
    component.student = {
      id: '123',
      name: 'John Doe',
      grade: 10
    };
    fixture.detectChanges();
  });

  it('should display student name', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h3').textContent).toContain('John Doe');
  });

  it('should call viewDetails on button click', () => {
    spyOn(component, 'viewDetails');
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect(component.viewDetails).toHaveBeenCalled();
  });
});
```

**E2E Test with Cypress:**
```typescript
// cypress/e2e/enrollment.cy.ts
describe('Enrollment Flow', () => {
  beforeEach(() => {
    cy.visit('/enrollment');
    cy.login('parent@example.com', 'password');
  });

  it('should complete enrollment application', () => {
    cy.get('[data-testid="start-application"]').click();

    // Step 1: Student Information
    cy.get('[formControlName="firstName"]').type('Jane');
    cy.get('[formControlName="lastName"]').type('Doe');
    cy.get('[formControlName="dateOfBirth"]').type('2010-05-15');
    cy.get('[data-testid="next-step"]').click();

    // Step 2: Household Information
    cy.get('[formControlName="income"]').type('50000');
    cy.get('[data-testid="next-step"]').click();

    // Step 3: Document Upload
    cy.get('[data-testid="upload-proof-of-income"]').attachFile('income.pdf');
    cy.get('[data-testid="next-step"]').click();

    // Submit
    cy.get('[data-testid="submit-application"]').click();
    cy.contains('Application submitted successfully').should('be.visible');
  });
});
```

## Bundle Size Analysis

**Production Build:**
```bash
npm run build -- --configuration=production

# Output:
# Initial Chunk Files               | Names         |  Raw Size
# main.a1b2c3d4.js                  | main          |  350.12 kB
# polyfills.e5f6g7h8.js             | polyfills     |   90.45 kB
# styles.i9j0k1l2.css               | styles        |   45.23 kB
#
# Lazy Chunk Files                  | Names         |  Raw Size
# admin-module.m3n4o5p6.js          | admin-module  |  120.67 kB
# reports-module.q7r8s9t0.js        | reports       |   85.34 kB
```

## Validation

Success will be measured by:
- All 4 portals successfully built and deployed with Angular 19
- WCAG 2.1 Level AA compliance verified by accessibility audit (100% pass)
- MSAL authentication working with Entra ID B2C (Government Cloud)
- Lighthouse performance score >90 for all applications
- Bundle sizes <500KB for initial load (gzipped)
- Developers productive within 2 weeks
- No major accessibility violations reported

## Related Decisions

* [ADR-003: Entra ID B2C for CIAM](ADR-003-entra-id-b2c-ciam.md) - Authentication integration
* [ADR-004: Nx Monorepo for Frontend](ADR-004-nx-monorepo-frontend.md) - Repository structure
* [ADR-001: Azure Government Cloud](ADR-001-azure-government-cloud.md) - Impacts MSAL endpoints

## References

* [Angular Documentation](https://angular.dev/)
* [Angular Material](https://material.angular.io/)
* [MSAL Angular](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-angular)
* [Angular Accessibility](https://angular.dev/best-practices/a11y)
* [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
* [Angular Style Guide](https://angular.dev/style-guide)

---

**Decision Made:** August 12, 2024
**Implemented:** August 2024
**Version:** Angular 19.2.6
**Repository:** https://dev.azure.com/CFI-AzureDevOps/K12/_git/k12-web-enrollment
