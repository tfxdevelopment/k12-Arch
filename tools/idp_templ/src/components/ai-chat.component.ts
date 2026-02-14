import { Component, inject, signal } from '@angular/core';
import { GeminiService } from '../services/gemini.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="mt-8 p-4 rounded-xl border border-slate-800 bg-slate-900/50">
      <h3 class="text-nuxt-green font-bold text-lg mb-2 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Ask Platform AI
      </h3>
      <p class="text-slate-400 text-sm mb-4">Have questions about the architecture or configs? Ask below.</p>
      
      <div class="flex gap-2">
        <input 
          type="text" 
          [(ngModel)]="query" 
          (keyup.enter)="ask()"
          placeholder="e.g. How do I restart the auth service?" 
          class="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-nuxt-green transition-colors"
        >
        <button (click)="ask()" [disabled]="loading()" class="bg-nuxt-green text-black font-semibold px-4 py-2 rounded-lg hover:bg-[#00c975] disabled:opacity-50 transition-colors">
          @if (loading()) { ... } @else { Ask }
        </button>
      </div>

      @if (response()) {
        <div class="mt-4 p-4 bg-slate-950 rounded-lg border border-slate-800 text-sm text-slate-300 leading-relaxed animate-fade-in">
          {{ response() }}
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
  `]
})
export class AiChatComponent {
  private gemini = inject(GeminiService);
  
  query = '';
  response = signal<string>('');
  loading = signal<boolean>(false);

  async ask() {
    if (!this.query.trim()) return;
    this.loading.set(true);
    
    // Simulate context injection
    const context = "This is the K12 MyPortal IDP. We use Micro-frontends (MFE) orchestrated via Webpack Module Federation. Backend is NestJS. Database is Postgres. Local dev uses Docker Compose. We have services: Auth, Student, Gradebook. Tools available: restart, logs, config view.";
    
    const answer = await this.gemini.askAssistant(this.query, context);
    this.response.set(answer);
    this.loading.set(false);
  }
}