import { createContentLoader , defineLoader } from 'vitepress'
import type { SiteConfig } from 'vitepress'

const config: SiteConfig = (globalThis as any).VITEPRESS_CONFIG
    
export default createContentLoader('**/*.md');