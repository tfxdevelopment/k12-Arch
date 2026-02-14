import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="fixed top-0 left-0 right-0 h-16 bg-nuxt-base/80 backdrop-blur-md border-b border-slate-800 z-50">
      <div class="max-w-[1440px] mx-auto px-4 h-full flex items-center justify-between">
        
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-nuxt-green rounded flex items-center justify-center text-black font-bold text-xl">M</div>
          <span class="font-bold text-xl text-white tracking-tight">MyPortal <span class="text-nuxt-green">IDP</span></span>
        </div>

        <!-- Main Nav -->
        <nav class="hidden md:flex items-center gap-1">
          <a routerLink="/docs/introduction" routerLinkActive="text-nuxt-green bg-nuxt-green/10" class="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-colors">Docs</a>
          <a routerLink="/api-docs" routerLinkActive="text-nuxt-green bg-nuxt-green/10" class="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-colors">API</a>
          <a routerLink="/tools" routerLinkActive="text-nuxt-green bg-nuxt-green/10" class="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-colors">Tools</a>
          <a routerLink="/logs" routerLinkActive="text-nuxt-green bg-nuxt-green/10" class="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-colors">Logs</a>
          <a href="#" class="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-colors">Templates</a>
          <a href="#" class="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-colors">Resources</a>
        </nav>

        <!-- Right Actions -->
        <div class="flex items-center gap-4">
          <!-- Search Mock -->
          <button class="hidden lg:flex items-center gap-2 bg-slate-900 border border-slate-700 hover:border-nuxt-green/50 text-slate-400 px-3 py-1.5 rounded-lg text-sm transition-colors group">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:text-nuxt-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Search (Ctrl+K)</span>
          </button>
          
          <!-- GitHub Icon -->
          <a href="#" class="text-slate-400 hover:text-white">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path></svg>
          </a>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {}