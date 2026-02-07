import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass, JsonPipe } from '@angular/common';

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  summary: string;
  tag: string;
  description?: string;
  responses: Record<number, any>;
}

@Component({
  selector: 'app-api-docs-page',
  standalone: true,
  imports: [FormsModule, NgClass, JsonPipe],
  template: `
    <div class="max-w-6xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-4">API Reference</h1>
        <p class="text-slate-400 mb-6">Interactive API documentation for the MyPortal microservices.</p>
        
        <!-- Search -->
        <div class="relative">
          <input 
            type="text" 
            [(ngModel)]="searchQuery"
            placeholder="Filter endpoints..." 
            class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-nuxt-green transition-colors pl-10"
          >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-500 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div class="space-y-8">
        @for (group of groupedEndpoints(); track group.tag) {
          <div class="bg-slate-900/30 rounded-xl border border-slate-800 overflow-hidden">
            <div class="px-6 py-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
              <h2 class="text-xl font-bold text-white flex items-center gap-2">
                {{ group.tag }}
                <span class="text-xs font-normal text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{{ group.endpoints.length }}</span>
              </h2>
            </div>
            
            <div class="divide-y divide-slate-800">
              @for (endpoint of group.endpoints; track endpoint.path + endpoint.method) {
                <div class="group">
                  <!-- Endpoint Header (Click to expand) -->
                  <button (click)="toggleExpand(endpoint)" class="w-full px-6 py-4 flex items-center gap-4 hover:bg-slate-800/50 transition-colors text-left">
                    <span [class]="getMethodClass(endpoint.method) + ' font-mono font-bold px-2 py-1 rounded text-xs w-16 text-center shrink-0'">
                      {{ endpoint.method }}
                    </span>
                    <span class="font-mono text-sm text-slate-300 font-medium shrink-0">{{ endpoint.path }}</span>
                    <span class="text-sm text-slate-500 truncate">{{ endpoint.summary }}</span>
                    
                    <div class="ml-auto">
                       <svg [class.rotate-180]="isExpanded(endpoint)" class="w-4 h-4 text-slate-500 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                       </svg>
                    </div>
                  </button>

                  <!-- Expanded Details -->
                  @if (isExpanded(endpoint)) {
                    <div class="px-6 py-6 bg-[#0b0e16] border-t border-slate-800">
                      <p class="text-slate-400 text-sm mb-6">{{ endpoint.description }}</p>

                      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <!-- Request Config (Simulated) -->
                        <div>
                          <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Parameters</h4>
                          <div class="bg-slate-900 rounded border border-slate-800 p-4 text-sm text-slate-400 italic text-center">
                            No parameters required
                          </div>
                          
                          <div class="mt-6">
                            <button class="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded border border-slate-700 transition-colors">
                              Try it out
                            </button>
                          </div>
                        </div>

                        <!-- Responses -->
                        <div>
                          <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Responses</h4>
                          <div class="space-y-4">
                            @for (status of getResponseCodes(endpoint); track status) {
                              <div class="text-xs">
                                <div class="flex items-center gap-2 mb-2">
                                  <div class="w-2 h-2 rounded-full bg-green-500"></div>
                                  <span class="font-mono text-green-400">{{ status }}</span>
                                  <span class="text-slate-500">application/json</span>
                                </div>
                                <pre class="bg-[#020420] p-3 rounded border border-slate-800 text-slate-300 font-mono overflow-x-auto custom-scroll">{{ endpoint.responses[status] | json }}</pre>
                              </div>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .custom-scroll::-webkit-scrollbar { height: 6px; }
    .custom-scroll::-webkit-scrollbar-track { background: #020420; }
    .custom-scroll::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
  `]
})
export class ApiDocsPageComponent {
  searchQuery = signal('');
  expandedEndpoints = signal<Set<string>>(new Set());

  endpoints: ApiEndpoint[] = [
    {
      tag: 'Auth Service',
      method: 'POST',
      path: '/api/v1/auth/login',
      summary: 'Authenticate a user',
      description: 'Exchange credentials for a JWT access token and refresh token.',
      responses: {
        200: { accessToken: "eyJhbG...", expiresIn: 3600 }
      }
    },
    {
      tag: 'Auth Service',
      method: 'GET',
      path: '/api/v1/auth/me',
      summary: 'Get current user profile',
      description: 'Retrieve the profile information for the currently authenticated session.',
      responses: {
        200: { id: "usr_123", email: "teacher@school.org", role: "FACULTY" }
      }
    },
    {
      tag: 'Student API',
      method: 'GET',
      path: '/api/v1/students',
      summary: 'List all students',
      description: 'Returns a paginated list of students visible to the current user.',
      responses: {
        200: { data: [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }], total: 450 }
      }
    },
    {
      tag: 'Student API',
      method: 'POST',
      path: '/api/v1/students',
      summary: 'Enroll a new student',
      description: 'Create a new student record in the district database.',
      responses: {
        201: { id: 3, name: "Charlie", status: "ENROLLED" }
      }
    },
    {
      tag: 'Gradebook',
      method: 'GET',
      path: '/api/v1/grades/course/:id',
      summary: 'Get course grades',
      description: 'Fetch the full gradebook for a specific course ID.',
      responses: {
        200: { courseId: "SCI-101", grades: [] }
      }
    },
    {
      tag: 'Gradebook',
      method: 'PUT',
      path: '/api/v1/grades/:id',
      summary: 'Update a specific grade',
      description: 'Modify the score or feedback for a specific grade assignment.',
      responses: {
        200: { success: true }
      }
    }
  ];

  groupedEndpoints = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const filtered = this.endpoints.filter(e => 
      e.path.toLowerCase().includes(query) || 
      e.summary.toLowerCase().includes(query) ||
      e.tag.toLowerCase().includes(query)
    );

    const groups: { tag: string, endpoints: ApiEndpoint[] }[] = [];
    const tags = Array.from(new Set(filtered.map(e => e.tag)));

    tags.forEach(tag => {
      groups.push({
        tag,
        endpoints: filtered.filter(e => e.tag === tag)
      });
    });

    return groups;
  });

  getMethodClass(method: string) {
    switch (method) {
      case 'GET': return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      case 'POST': return 'bg-green-500/10 text-green-500 border border-green-500/20';
      case 'PUT': return 'bg-orange-500/10 text-orange-500 border border-orange-500/20';
      case 'DELETE': return 'bg-red-500/10 text-red-500 border border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-500';
    }
  }

  toggleExpand(endpoint: ApiEndpoint) {
    const key = endpoint.method + endpoint.path;
    this.expandedEndpoints.update(set => {
      const newSet = new Set(set);
      if (newSet.has(key)) newSet.delete(key);
      else newSet.add(key);
      return newSet;
    });
  }

  isExpanded(endpoint: ApiEndpoint) {
    return this.expandedEndpoints().has(endpoint.method + endpoint.path);
  }

  getResponseCodes(endpoint: ApiEndpoint) {
    return Object.keys(endpoint.responses).map(Number);
  }
}