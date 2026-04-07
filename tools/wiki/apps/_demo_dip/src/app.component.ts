import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header.component';
import { SidebarComponent } from './components/sidebar.component';
import { FooterComponent } from './components/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, FooterComponent],
  template: `
    <app-header />
    
    <div class="flex min-h-screen pt-16 relative">
      <!-- Left Sidebar (Fixed) -->
      <app-sidebar class="hidden lg:block w-64 shrink-0 fixed top-16 bottom-0 left-0 z-40 border-r border-white/5 bg-[#020420]/80 backdrop-blur-xl" />
      
      <!-- Main Content Wrapper (Flex to push footer down) -->
      <main class="flex-1 flex flex-col min-w-0 lg:pl-64 xl:pr-64 transition-all duration-300">
         <div class="flex-1 p-6 md:p-8 lg:p-12 w-full max-w-[90rem] mx-auto">
           <router-outlet />
         </div>
         <app-footer />
      </main>

      <!-- Right Sidebar (Fixed, TOC) -->
      <aside class="hidden xl:block w-64 shrink-0 border-l border-white/5 p-6 fixed top-16 bottom-0 right-0 z-40 overflow-y-auto bg-[#020420]/80 backdrop-blur-xl">
        <h5 class="text-white font-bold text-sm mb-4">On this page</h5>
        <ul class="space-y-2 text-sm border-l border-slate-800 pl-4">
          <li><a href="#" class="text-nuxt-green border-l-2 border-nuxt-green -ml-[18px] pl-4 block">Overview</a></li>
          <li><a href="#" class="text-slate-400 hover:text-white block transition-colors">Installation</a></li>
          <li><a href="#" class="text-slate-400 hover:text-white block transition-colors">Usage</a></li>
          <li><a href="#" class="text-slate-400 hover:text-white block transition-colors">Configuration</a></li>
        </ul>
        
        <div class="mt-8 pt-8 border-t border-slate-800">
           <div class="bg-slate-900/50 rounded-lg p-4 border border-slate-800 hover:border-nuxt-green/30 transition-colors group">
             <span class="text-xs font-bold text-white block mb-1 group-hover:text-nuxt-green transition-colors">Community</span>
             <p class="text-xs text-slate-400 mb-2">Join our Discord for help and discussion.</p>
             <a href="#" class="text-xs text-nuxt-green hover:underline">Join Discord →</a>
           </div>
        </div>
      </aside>
    </div>
  `
})
export class AppComponent {}