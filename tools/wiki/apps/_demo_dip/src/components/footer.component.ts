import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="border-t border-white/10 bg-[#020420]/30 mt-auto">
      <div class="mx-auto px-6 py-12 lg:px-8 max-w-[90rem]">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-sm font-semibold leading-6 text-white">Platform</h3>
            <ul role="list" class="mt-6 space-y-4">
              <li><a href="#" class="text-sm leading-6 text-slate-400 hover:text-nuxt-green transition-colors">Architecture</a></li>
              <li><a href="#" class="text-sm leading-6 text-slate-400 hover:text-nuxt-green transition-colors">Release Notes</a></li>
              <li><a href="#" class="text-sm leading-6 text-slate-400 hover:text-nuxt-green transition-colors">System Status</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-sm font-semibold leading-6 text-white">Resources</h3>
            <ul role="list" class="mt-6 space-y-4">
              <li><a href="#" class="text-sm leading-6 text-slate-400 hover:text-nuxt-green transition-colors">Documentation</a></li>
              <li><a href="#" class="text-sm leading-6 text-slate-400 hover:text-nuxt-green transition-colors">API Reference</a></li>
              <li><a href="#" class="text-sm leading-6 text-slate-400 hover:text-nuxt-green transition-colors">CLI Tools</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-sm font-semibold leading-6 text-white">Developer Tools</h3>
            <ul role="list" class="mt-6 space-y-4">
              <li><a href="https://github.com" target="_blank" class="flex items-center gap-2 text-sm leading-6 text-slate-400 hover:text-nuxt-green transition-colors">GitHub</a></li>
              <li><a href="https://azure.microsoft.com" target="_blank" class="flex items-center gap-2 text-sm leading-6 text-slate-400 hover:text-nuxt-green transition-colors">Azure Portal</a></li>
              <li><a href="https://dev.azure.com" target="_blank" class="flex items-center gap-2 text-sm leading-6 text-slate-400 hover:text-nuxt-green transition-colors">Azure DevOps</a></li>
              <li><a href="https://www.atlassian.com/software/jira" target="_blank" class="flex items-center gap-2 text-sm leading-6 text-slate-400 hover:text-nuxt-green transition-colors">Jira</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-sm font-semibold leading-6 text-white">Helpful Links</h3>
            <ul role="list" class="mt-6 space-y-4">
              <li><a href="#" class="text-sm leading-6 text-slate-400 hover:text-nuxt-green transition-colors">Onboarding Guide</a></li>
              <li><a href="#" class="text-sm leading-6 text-slate-400 hover:text-nuxt-green transition-colors">Security Policies</a></li>
              <li><a href="#" class="text-sm leading-6 text-slate-400 hover:text-nuxt-green transition-colors">Contact Support</a></li>
            </ul>
          </div>
        </div>
        <div class="mt-12 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-xs leading-5 text-slate-500">&copy; 2024 MyPortal K12 Platform. Internal Developer Platform.</p>
          <div class="flex gap-4">
             <div class="w-2 h-2 rounded-full bg-green-500"></div>
             <span class="text-xs text-slate-400">All Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}