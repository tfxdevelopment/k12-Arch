import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { AiChatComponent } from '../components/ai-chat.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-docs-page',
  standalone: true,
  imports: [AiChatComponent],
  template: `
    <div class="prose prose-invert prose-slate max-w-none">
      <h1 class="text-4xl font-bold tracking-tight text-white mb-4 capitalize">
        {{ title() }}
      </h1>
      
      <!-- Dynamic Content Injection Simulation -->
      @if (docId() === 'introduction') {
        <p class="text-lg text-slate-300">
          Welcome to the <strong>MyPortal Internal Developer Platform (IDP)</strong>. This platform is designed to streamline the development workflow for the K12 ecosystem. It provides a unified interface for managing local microservices, viewing logs, and accessing documentation.
        </p>
        <div class="my-8 grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
          <div class="p-6 bg-slate-900 rounded-xl border border-slate-800 hover:border-nuxt-green/50 transition-colors">
            <h3 class="text-xl font-semibold text-white mb-2">🚀 Orchestration</h3>
            <p class="text-slate-400">Spin up the entire stack with a single click. Manage Docker containers directly from the browser.</p>
          </div>
          <div class="p-6 bg-slate-900 rounded-xl border border-slate-800 hover:border-nuxt-green/50 transition-colors">
            <h3 class="text-xl font-semibold text-white mb-2">🧩 Micro-Frontends</h3>
            <p class="text-slate-400">Develop isolated features with Module Federation. Hot reload supported out of the box.</p>
          </div>
        </div>
      } 
      
      @else if (docId() === 'installation') {
        <h3>Prerequisites</h3>
        <ul class="list-disc pl-6 text-slate-300 space-y-2">
          <li>Node.js v20+</li>
          <li>Docker Desktop & Compose</li>
          <li>pnpm v8+</li>
        </ul>
        <h3 class="mt-8">Quick Start</h3>
        <pre class="bg-[#0f172a] p-4 rounded-lg border border-slate-800 text-sm overflow-x-auto"><code class="text-nuxt-green"># Clone the repo
git clone https://github.com/k12-org/myportal.git

# Install dependencies
pnpm install

# Start the IDP
pnpm dev:idp</code></pre>
      }

      @else if (docId() === 'auth-service') {
        <div class="flex items-center gap-2 mb-6">
          <span class="px-2 py-1 rounded-md bg-green-900/30 text-green-400 text-xs font-mono border border-green-900">v2.4.0</span>
          <span class="px-2 py-1 rounded-md bg-blue-900/30 text-blue-400 text-xs font-mono border border-blue-900">Typescript</span>
        </div>
        <p class="text-slate-300">
          The Auth Service handles JWT issuance, rotation, and RBAC policies for schools. It connects to the shared Redis cluster for session management.
        </p>
        <h3 class="mt-8 text-xl font-bold text-white">Endpoints</h3>
        <div class="not-prose mt-4 space-y-4">
          <div class="flex items-center gap-4 p-3 bg-slate-900/50 rounded border border-slate-800">
             <span class="font-mono text-green-400 font-bold">POST</span>
             <code class="text-slate-300">/api/v1/auth/login</code>
             <span class="text-slate-500 text-sm ml-auto">Public</span>
          </div>
          <div class="flex items-center gap-4 p-3 bg-slate-900/50 rounded border border-slate-800">
             <span class="font-mono text-blue-400 font-bold">GET</span>
             <code class="text-slate-300">/api/v1/auth/me</code>
             <span class="text-slate-500 text-sm ml-auto">Protected</span>
          </div>
        </div>
      }

      @else {
        <p class="text-slate-400 italic">Documentation for this section is being updated.</p>
      }

      <!-- AI Chat Helper for Docs -->
      <app-ai-chat />
      
      <div class="mt-12 pt-8 border-t border-slate-800 flex justify-between text-sm">
        <a href="#" class="text-nuxt-green hover:underline">Edit this page on GitHub</a>
        <span class="text-slate-500">Last updated: Today</span>
      </div>
    </div>
  `
})
export class DocsPageComponent {
  private route = inject(ActivatedRoute);
  
  // Convert route param observable to signal
  params = toSignal(this.route.params.pipe(map(p => p['id'] || 'introduction')));
  
  docId = computed(() => this.params());
  title = computed(() => (this.params() as string).replace('-', ' '));
}