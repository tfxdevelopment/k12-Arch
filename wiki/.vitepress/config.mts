import { defineConfig } from 'vitepress'
import type { SiteConfig } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar';
import { pagefindPlugin } from 'vitepress-plugin-pagefind'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "CFI K12",
  description: "A VitePress Site",
  ignoreDeadLinks: true,
  themeConfig: {
    sidebar: generateSidebar({
      /*
     * For detailed instructions, see the links below:
     * https://vitepress-sidebar.cdget.com/guide/options
     */
      //
      // ============ [ RESOLVING PATHS ] ============
      // documentRootPath: '/',
      // scanStartPath: null,
      // resolvePath: null,
      // basePath: null,
      followSymlinks: true,
      //
      // ============ [ GROUPING ] ============
      collapsed: true,
      collapseDepth: 2,
      // rootGroupText: 'Contents',
      // rootGroupLink: 'https://github.com/jooy2',
      // rootGroupCollapsed: false,
      //
      // ============ [ GETTING MENU TITLE ] ============
      // useTitleFromFileHeading: true,
      // useTitleFromFrontmatter: true,
      useFolderLinkFromIndexFile: true,
      // useFolderTitleFromIndexFile: false,
      // frontmatterTitleFieldName: 'title',
      //
      // ============ [ GETTING MENU LINK ] ============
      // useFolderLinkFromSameNameSubFile: false,
      // useFolderLinkFromIndexFile: false,
      // folderLinkNotIncludesFileName: false,
      //
      // ============ [ INCLUDE / EXCLUDE ] ============
      // excludeByGlobPattern: ['README.md', 'folder/'],
      // excludeFilesByFrontmatterFieldName: 'exclude',
      // excludeByFolderDepth: undefined,
      // includeDotFiles: false,
      // includeEmptyFolder: false,
      // includeRootIndexFile: false,
      // includeFolderIndexFile: false,
      //
      // ============ [ STYLING MENU TITLE ] ============
      hyphenToSpace: true,
      underscoreToSpace: true,
      // capitalizeFirst: false,
      capitalizeEachWords: true,
      // keepMarkdownSyntaxFromTitle: false,
      // removePrefixAfterOrdering: false,
      // prefixSeparator: '.',
      //
      // ============ [ SORTING ] ============
      // manualSortFileNameByPriority: ['first.md', 'second', 'third.md'],
      // sortFolderTo: null,
      sortMenusByName: true,
      // sortMenusByFileDatePrefix: false,
      // sortMenusByFrontmatterOrder: false,
      // frontmatterOrderDefaultValue: 0,
      // sortMenusByFrontmatterDate: false,
      // sortMenusOrderByDescending: false,
      // sortMenusOrderNumericallyFromTitle: false,
      // sortMenusOrderNumericallyFromLink: false,
      //
      // ============ [ MISC ] ============
      // debugPrint: false,
    })
    // https://vitepress.dev/reference/default-theme-config
    //   ,nav: [
    //     { text: 'Home', link: '/' },

    //   ],

    //   sidebar: [
    //     {
    //       text: 'Examples',
    //       items: [
    //         { text: 'Markdown Examples', link: '/markdown-examples' },
    //         { text: 'Runtime API Examples', link: '/api-examples' }
    //       ]
    //     }
    //   ],

    //   socialLinks: [
    //     { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    //   ]
  },
  vite: {
    plugins: [pagefindPlugin({
      filter(searchItem, idx, originArray) {
        console.log(searchItem)
        return !searchItem.route.includes('404')
      }
    })],
  }
})


