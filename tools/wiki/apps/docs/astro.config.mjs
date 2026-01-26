// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'K12 Architecture Docs',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/CFI/k12-Arch' }],
			sidebar: [
				{
					label: 'Guides (WIP)',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Example Guide', slug: 'guides/example' },
					],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],
});
