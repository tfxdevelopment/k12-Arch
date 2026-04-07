import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavigationService } from '../services/navigation.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  template: `
    <aside class="h-full overflow-y-auto pb-10 custom-sidebar-scroll">
      <div class="p-6">
        @for (group of navService.menuItems(); track group.label) {
          <div class="mb-6">
            <button (click)="navService.toggleExpand(group)" class="flex items-center justify-between w-full text-left text-sm font-bold text-white mb-2 hover:text-nuxt-green transition-colors">
              {{ group.label }}
              <svg [class.rotate-180]="!group.expanded" class="w-4 h-4 transition-transform text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            @if (group.expanded) {
              <ul class="space-y-1 pl-2 border-l border-slate-800">
                @for (item of group.children; track item.label) {
                  <li>
                    <a [routerLink]="item.path" routerLinkActive="text-nuxt-green border-nuxt-green bg-nuxt-green/10" [routerLinkActiveOptions]="{exact: false}" class="block px-4 py-1.5 text-sm text-slate-400 hover:text-white border-l border-transparent -ml-px transition-all duration-200">
                      {{ item.label }}
                    </a>
                  </li>
                }
              </ul>
            }
          </div>
        }
      </div>
      
      <!-- Bottom promo/link -->
      <div class="px-6 mt-4">
        <a href="#" class="block p-4 rounded-xl bg-gradient-to-br from-nuxt-green/10 to-transparent border border-nuxt-green/20 hover:border-nuxt-green/40 transition-all group">
           <div class="text-xs font-bold text-nuxt-green mb-1">New Feature</div>
           <div class="text-xs text-slate-300 group-hover:text-white">Check out the new CLI v2.0</div>
        </a>
      </div>
    </aside>
  `,
  styles: [`
    .custom-sidebar-scroll::-webkit-scrollbar { width: 4px; }
    .custom-sidebar-scroll::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
    .custom-sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
  `]
})
export class SidebarComponent {
  navService = inject(NavigationService);
}