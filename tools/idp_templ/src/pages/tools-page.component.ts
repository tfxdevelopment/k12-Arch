import { Component, signal } from '@angular/core';

interface ServiceStatus {
  name: string;
  status: 'running' | 'stopped' | 'error' | 'starting';
  port: number;
  cpu: string;
  memory: string;
  uptime: string;
  version: string;
}

@Component({
  selector: 'app-tools-page',
  standalone: true,
  template: `
    <div class="max-w-6xl mx-auto">
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">Local Orchestration</h1>
          <p class="text-slate-400">Manage your local microservice fleet and MFE host.</p>
        </div>
        <div class="flex gap-3">
          <button (click)="restartAll()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors border border-slate-700">
            Restart All
          </button>
          <button class="px-4 py-2 bg-nuxt-green text-black rounded-lg text-sm font-bold hover:bg-[#00c975] transition-colors">
            + Add Service
          </button>
        </div>
      </div>

      <!-- Services Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
        @for (svc of services(); track svc.name) {
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-600 transition-all group">
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center gap-3">
                <div [class]="getStatusColor(svc.status) + ' w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]'"></div>
                <h3 class="font-bold text-white text-lg">{{ svc.name }}</h3>
              </div>
              <span class="text-xs font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded">v{{ svc.version }}</span>
            </div>

            <div class="grid grid-cols-2 gap-y-2 text-sm text-slate-400 mb-6 font-mono">
              <span>Port:</span> <span class="text-slate-200">{{ svc.port }}</span>
              <span>Memory:</span> <span class="text-slate-200">{{ svc.memory }}</span>
              <span>CPU:</span> <span class="text-slate-200">{{ svc.cpu }}</span>
              <span>Uptime:</span> <span class="text-slate-200">{{ svc.uptime }}</span>
            </div>

            <div class="flex items-center gap-2 pt-4 border-t border-slate-800">
              <button (click)="toggleService(svc)" class="flex-1 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition-colors">
                {{ svc.status === 'running' ? 'Stop' : 'Start' }}
              </button>
              <button class="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition-colors" title="View Logs">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
              <button class="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition-colors" title="Config">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543 .826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        }
      </div>

      <!-- Quick Actions / Scripts -->
      <h2 class="text-xl font-bold text-white mb-4">Development Scripts</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
           <div class="flex flex-col">
             <span class="text-white font-medium">Reset Database</span>
             <span class="text-slate-500 text-xs">Drops all tables and runs seeds</span>
           </div>
           <button class="px-3 py-1.5 bg-red-900/20 text-red-400 border border-red-900/50 rounded hover:bg-red-900/40 transition-colors text-sm">Run</button>
        </div>
        <div class="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
           <div class="flex flex-col">
             <span class="text-white font-medium">Lint All</span>
             <span class="text-slate-500 text-xs">Runs eslint across all monorepo packages</span>
           </div>
           <button class="px-3 py-1.5 bg-blue-900/20 text-blue-400 border border-blue-900/50 rounded hover:bg-blue-900/40 transition-colors text-sm">Run</button>
        </div>
      </div>
    </div>
  `
})
export class ToolsPageComponent {
  services = signal<ServiceStatus[]>([
    { name: 'Auth Service', status: 'running', port: 3001, cpu: '0.4%', memory: '128MB', uptime: '4h 12m', version: '2.4.0' },
    { name: 'Student API', status: 'running', port: 3002, cpu: '1.2%', memory: '256MB', uptime: '4h 11m', version: '1.8.2' },
    { name: 'Gradebook API', status: 'stopped', port: 3003, cpu: '0%', memory: '0MB', uptime: '-', version: '0.9.1' },
    { name: 'Redis Cache', status: 'running', port: 6379, cpu: '0.1%', memory: '48MB', uptime: '12d', version: '6.2' },
    { name: 'Postgres DB', status: 'running', port: 5432, cpu: '0.8%', memory: '412MB', uptime: '12d', version: '14.1' },
    { name: 'MFE Shell', status: 'starting', port: 4200, cpu: '8.5%', memory: '140MB', uptime: '10s', version: '0.0.1' },
  ]);

  getStatusColor(status: string) {
    switch (status) {
      case 'running': return 'bg-nuxt-green text-nuxt-green';
      case 'stopped': return 'bg-slate-500 text-slate-500';
      case 'error': return 'bg-red-500 text-red-500';
      case 'starting': return 'bg-yellow-400 text-yellow-400 animate-pulse';
      default: return 'bg-slate-500';
    }
  }

  toggleService(svc: ServiceStatus) {
    this.services.update(list => list.map(s => {
      if (s.name === svc.name) {
        return { 
          ...s, 
          status: s.status === 'running' ? 'stopped' : 'running',
          uptime: s.status === 'running' ? '-' : '0s'
        };
      }
      return s;
    }));
  }

  restartAll() {
    this.services.update(list => list.map(s => ({ ...s, status: 'starting' })));
    setTimeout(() => {
      this.services.update(list => list.map(s => ({ ...s, status: 'running' })));
    }, 2000);
  }
}