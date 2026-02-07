import { Routes } from '@angular/router';
import { DocsPageComponent } from './pages/docs-page.component';
import { ToolsPageComponent } from './pages/tools-page.component';
import { LogsPageComponent } from './pages/logs-page.component';
import { ApiDocsPageComponent } from './pages/api-docs-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'docs/introduction', pathMatch: 'full' },
  { path: 'docs/:id', component: DocsPageComponent },
  { path: 'api-docs', component: ApiDocsPageComponent },
  { path: 'tools', component: ToolsPageComponent },
  { path: 'logs', component: LogsPageComponent },
  { path: '**', redirectTo: 'docs/introduction' }
];