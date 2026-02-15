import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import icon from 'astro-icon'
import { defineConfig } from 'astro/config'
import rehypeSlug from 'rehype-slug'

import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  site: 'https://bobaekang.com',
  integrations: [mdx(), sitemap(), icon()],
  markdown: {
    rehypePlugins: [rehypeSlug],
  },

  vite: {
    plugins: [tailwindcss()],
  },
})
