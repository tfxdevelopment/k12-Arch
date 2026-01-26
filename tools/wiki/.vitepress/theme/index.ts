// https://vitepress.dev/guide/custom-theme
import DefaultTheme from 'vitepress/theme'
import './style.css'
import { h, nextTick, watch } from "vue";
import type { Theme, EnhanceAppContext } from "vitepress";
import { useData } from "vitepress";
import type { MermaidConfig, } from "mermaid";
import { createMermaidRenderer } from 'vitepress-mermaid-renderer'
//   Layout: () => {
//     return h(DefaultTheme.Layout, null, {
//       // https://vitepress.dev/guide/extending-default-theme#layout-slots
//     })
//   },
//   enhanceApp({ app, router, siteData }) {
//     // ...
//   }
// } satisfies Theme
const mermaidConfig: MermaidConfig = {
  startOnLoad: true,
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
  },
} as const;

const mermaidToolbarConfig = {
  desktop: {
    zoomOut: true,
    resetZoom: true,
    download: true,
  }
};
export default {
  extends: DefaultTheme,

  Layout: () => {
    const { isDark, } = useData();

    const initMermaid = () => {
      const mermaidRenderer = createMermaidRenderer(
        {
          ...mermaidConfig,
          ...{ theme: isDark.value ? "dark" : "forest" }
        }
      );

      mermaidRenderer.setToolbar({
        desktop: {
          zoomOut: "enabled",
          download: "enabled",
          resetView: "enabled",
          zoomIn: "enabled"
        }
      });
    };

    // initial mermaid setup
    nextTick(() => initMermaid());

    // on theme change, re-render mermaid charts
    watch(
      () => isDark.value,
      () => {
        initMermaid();
      },
    );

    return h(DefaultTheme.Layout, null, {});
  },
  enhanceApp: ( { app, router, siteData }) =>{
  },
} satisfies Theme;