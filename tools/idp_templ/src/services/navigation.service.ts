import { Injectable, signal } from '@angular/core';

export interface NavItem {
  label: string;
  path?: string;
  children?: NavItem[];
  expanded?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  currentSection = signal<string>('Introduction');
  
  menuItems = signal<NavItem[]>([
    {
      label: 'Getting Started',
      expanded: true,
      children: [
        { label: 'Introduction', path: '/docs/introduction' },
        { label: 'Installation', path: '/docs/installation' },
        { label: 'Architecture', path: '/docs/architecture' },
      ]
    },
    {
      label: 'Core Services',
      expanded: true,
      children: [
        { label: 'Auth Service', path: '/docs/auth-service' },
        { label: 'Student API', path: '/docs/student-api' },
        { label: 'Gradebook', path: '/docs/gradebook' },
      ]
    },
    {
      label: 'Reference',
      expanded: true,
      children: [
        { label: 'API Reference', path: '/api-docs' },
        { label: 'CLI Commands', path: '/docs/cli' },
      ]
    },
    {
      label: 'Platform Tools',
      expanded: true,
      children: [
        { label: 'Local Dev', path: '/tools' },
        { label: 'Logs & Tracing', path: '/logs' },
      ]
    }
  ]);

  toggleExpand(item: NavItem) {
    item.expanded = !item.expanded;
    // Trigger signal update by creating a new array ref (shallow copy is enough for top level)
    this.menuItems.update(items => [...items]);
  }
}