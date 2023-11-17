import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    // 配置路径别名
    alias: {
      //三种写法都行，是一样的
      "@": path.resolve(__dirname, "src"),
      // '@/':`${path.resolve(__dirname,'src')}/`
      // '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    vue(),
    //按需自动导入组件
    Components({
      /* options */ 
      dts: './src/types/components.d.ts'  // 生成ts声明文件
    }),
    //按需自动导入 API
    AutoImport({ 
      /* options */ 
      // 目标文件，需要自动引的文件后缀，default [/\.[jt]sx?$/, /\.vue\??/]
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/, /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      // 全局引入插件
      imports: [
        // presets
        // '库名', 
        'vue',
        'vue-router',
        // custom
        {
          '@vueuse/core': [
            // named imports
            'useMouse', // import { useMouse } from '@vueuse/core',
            // alias
            ['useFetch', 'useMyFetch'], // import { useFetch as useMyFetch } from '@vueuse/core',
          ],
          'axios': [
            // default imports
            ['default', 'axios'], // import { default as axios } from 'axios',
          ],
          '[package-name]': [
            '[import-names]',
            // alias
            ['[from]', '[alias]'],
          ],
        },
      ],
      // eslint报错解决
      eslintrc: {
        enabled: false, // Default `false`
        filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      },
      // 函数解析器，例如element-plus的ElementPlusResolver
      // see https://github.com/antfu/unplugin-auto-import/pull/23/
      resolvers: [    
        /* ... */
      ],
      // ts声明文件生成位置和文件名称
      dts: './src/types/auto-imports.d.ts', // 放在项目根目录下的types文件夹
    }),
    //打包可视化
    visualizer({open: true})
  ],
})
