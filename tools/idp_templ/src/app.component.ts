import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header.component';
import { SidebarComponent } from './components/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  template: `
    <app-header />
    
    <div class="pt-16 max-w-[1440px] mx-auto flex min-h-screen">
      <!-- Left Sidebar -->
      <app-sidebar class="hidden lg:block w-64 shrink-0" />
      
      <!-- Main Content -->
      <main class="flex-1 lg:pl-64 min-w-0">
        <div class="p-6 md:p-8 lg:p-12 max-w-5xl mx-auto">
          <router-outlet />
        </div>
      </main>

      <!-- Right Sidebar (TOC placeholder) -->
      <aside class="hidden xl:block w-64 shrink-0 border-l border-slate-800 p-6 fixed right-[max(0px,calc(50%-720px))] top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <h5 class="text-white font-bold text-sm mb-4">On this page</h5>
        <ul class="space-y-2 text-sm border-l border-slate-800 pl-4">
          <li><a href="#" class="text-nuxt-green border-l-2 border-nuxt-green -ml-[18px] pl-4 block">Overview</a></li>
          <li><a href="#" class="text-slate-400 hover:text-white block">Installation</a></li>
          <li><a href="#" class="text-slate-400 hover:text-white block">Usage</a></li>
          <li><a href="#" class="text-slate-400 hover:text-white block">Configuration</a></li>
        </ul>
        
        <div class="mt-8 pt-8 border-t border-slate-800">
           <div class="bg-slate-900 rounded-lg p-4 border border-slate-800">
             <span class="text-xs font-bold text-white block mb-1">Community</span>
             <p class="text-xs text-slate-400 mb-2">Join our Discord for help and discussion.</p>
             <a href="#" class="text-xs text-nuxt-green hover:underline">Join Discord →</a>
           </div>
        </div>
      </aside>
    </div>
  `
})
export class AppComponent {}