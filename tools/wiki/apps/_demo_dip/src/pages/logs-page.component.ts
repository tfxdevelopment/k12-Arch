import { Component, signal, effect, computed } from '@angular/core';
import { DatePipe } from '@angular/common';

interface LogEntry {
  id: number;
  timestamp: Date;
  service: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
}

@Component({
  selector: 'app-logs-page',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="h-[calc(100vh-8rem)] flex flex-col">
      <div class="flex justify-between items-center mb-4">
        <div>
           <h1 class="text-2xl font-bold text-white">System Logs</h1>
           <p class="text-slate-400 text-sm">Real-time log aggregation from local dev environment.</p>
        </div>
        <div class="flex gap-2">
          <button (click)="clearLogs()" class="px-3 py-1.5 text-xs text-slate-300 border border-slate-700 rounded hover:bg-slate-800">Clear</button>
          <button (click)="togglePause()" class="px-3 py-1.5 text-xs text-slate-300 border border-slate-700 rounded hover:bg-slate-800">
            {{ paused() ? 'Resume' : 'Pause' }}
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex gap-2 mb-4 overflow-x-auto pb-2">
         @for (svc of services; track svc) {
           <button 
             (click)="toggleFilter(svc)"
             [class]="selectedService() === svc ? 'bg-nuxt-green text-black border-nuxt-green' : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500'"
             class="px-3 py-1 rounded-full text-xs font-medium border transition-colors whitespace-nowrap">
             {{ svc }}
           </button>
         }
      </div>

      <!-- Terminal Window -->
      <div class="flex-1 bg-[#0c0e14] rounded-lg border border-slate-800 overflow-hidden flex flex-col font-mono text-sm relative group">
        <!-- Window Controls -->
        <div class="h-8 bg-[#1a1d2d] flex items-center px-4 gap-2 border-b border-slate-800">
          <div class="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
          <div class="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
          <div class="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
          <span class="ml-2 text-xs text-slate-500">bash - tail -f /var/log/myportal/*</span>
        </div>

        <!-- Log Output -->
        <div class="flex-1 overflow-y-auto p-4 space-y-1 custom-scroll" #logContainer>
          @for (log of filteredLogs(); track log.id) {
            <div class="flex gap-3 hover:bg-white/5 p-0.5 rounded">
              <span class="text-slate-500 select-none shrink-0">{{ log.timestamp | date:'HH:mm:ss.SSS' }}</span>
              <span [class]="getLevelColor(log.level) + ' w-12 shrink-0 font-bold'">{{ log.level }}</span>
              <span class="text-blue-400 w-24 shrink-0 truncate">[{{ log.service }}]</span>
              <span class="text-slate-300 break-all">{{ log.message }}</span>
            </div>
          }
          @if (filteredLogs().length === 0) {
            <div class="text-slate-600 italic p-4 text-center">No logs matching filter...</div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .custom-scroll::-webkit-scrollbar { width: 8px; }
    .custom-scroll::-webkit-scrollbar-track { background: #0c0e14; }
    .custom-scroll::-webkit-scrollbar-thumb { background: #2d3748; border-radius: 4px; }
  `]
})
export class LogsPageComponent {
  logs = signal<LogEntry[]>([]);
  services = ['All', 'Auth Service', 'Student API', 'Gateway', 'Database'];
  selectedService = signal('All');
  paused = signal(false);
  
  private intervalId: any;
  private idCounter = 0;

  constructor() {
    this.startLogStream();
  }

  filteredLogs = computed(() => {
    const current = this.logs();
    const filter = this.selectedService();
    if (filter === 'All') return current;
    return current.filter(l => l.service === filter);
  });

  startLogStream() {
    this.intervalId = setInterval(() => {
      if (this.paused()) return;
      this.addRandomLog();
    }, 800);
  }

  addRandomLog() {
    const services = ['Auth Service', 'Student API', 'Gateway', 'Database'];
    const levels: ('INFO' | 'WARN' | 'ERROR' | 'DEBUG')[] = ['INFO', 'INFO', 'INFO', 'DEBUG', 'WARN', 'ERROR'];
    const messages = [
      'Received request GET /health',
      'Processing payload size=1024b',
      'Connection pool acquired',
      'Transaction commit successful',
      'User authenticated: sub=123901',
      'Cache miss for key: student_profile_88',
      'Query took 45ms',
      'Rate limit remaining: 994',
    ];

    const svc = services[Math.floor(Math.random() * services.length)];
    const lvl = levels[Math.floor(Math.random() * levels.length)];
    const msg = messages[Math.floor(Math.random() * messages.length)];

    const newLog: LogEntry = {
      id: this.idCounter++,
      timestamp: new Date(),
      service: svc,
      level: lvl,
      message: lvl === 'ERROR' ? 'Connection refused: 127.0.0.1:5432' : msg
    };

    this.logs.update(logs => {
      const newLogs = [...logs, newLog];
      if (newLogs.length > 200) newLogs.shift(); // Keep buffer small
      return newLogs;
    });
  }

  toggleFilter(svc: string) {
    this.selectedService.set(svc);
  }

  togglePause() {
    this.paused.set(!this.paused());
  }

  clearLogs() {
    this.logs.set([]);
  }

  getLevelColor(level: string) {
    switch (level) {
      case 'INFO': return 'text-green-500';
      case 'WARN': return 'text-yellow-500';
      case 'ERROR': return 'text-red-500';
      case 'DEBUG': return 'text-blue-500';
      default: return 'text-slate-500';
    }
  }
}
