import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { basename, resolve } from 'path'
import { builtinModules } from 'module'
import { existsSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'fs'
import { mkdirsSync } from 'fs-extra'

const packageJSON = require('./package.json')

const bundles = {
  main:  'main.ts',
  defaultPanel: 'panels/default/index.ts',
  heapPanel: 'panels/heap/index.ts',
  testInspector: 'inspector/test-comp.ts',
}

function getInputs() {
  const result = {}
  for (const key in bundles) {
    result[key] = resolve(__dirname, `./src/${bundles[key]}`)
  }
  return result
}

// vite 插件，将输出的文件路径设置为相对于根目录的路径
function RelativeRoot() {
  return {
    name: 'relative-config',
    generateBundle(options, bundle) {
      for (const fileName in bundle) {
        const file = bundle[fileName]
        if (file.type === 'asset') {
        } else {
          if(bundles[file.name] && bundles[file.name].endsWith('.ts')) {
            file.fileName = bundles[file.name].replace('.ts', '.js')
          }else{
            if("_plugin-vue_export-helper" === file.name) {
              file.fileName = basename(file.fileName)
            }else{
              console.log('no match', file.name)
            }
          }
        }
      }
    }
  }
}

// 修改_plugin-vue_export-helper.js的引用路径
const helperPattern = /(\.{0,2}\/?common\/@-.*?.js)/gi
function ModifyPluginVueExportHelper() {
  return {
    name: 'modify-plugin-vue-export-helper',
    generateBundle(options, bundle) {
      for (const fileName in bundle) {
        const file = bundle[fileName]
        if (bundles[file.name] && bundles[file.name].endsWith('.ts')) {
          let upLevel = bundles[file.name].split('/').length - 2
          let matches = file.code.matchAll(helperPattern)
          if(matches) {
            let match: RegExpMatchArray | null = null
            while(match = matches.next().value) {
              let realName = match[1]
              if(realName) {
                // console.log('realName', upLevel, realName)
                realName = realName.replace(/^\.{0,2}\/?/gi, '')
                if(upLevel > 0) {
                  file.code = file.code.replace(realName, `${'../'.repeat(upLevel)}${realName}`)
                }else{
                  file.code = file.code.replace(realName, `./${realName}`)
                }
              }
            }
          }
        }
      }
    },
    // closeBundle() {
    //   let dir = resolve(__dirname, './dist/common')
    //   if(!existsSync(dir)) {
    //     return
    //   }
    //   let files = readdirSync(dir)
    //   // 重命名文件
    //   files.forEach(file => {
    //     if(file.startsWith('@-')) {
    //       let newName = file.replace('@-', '')
    //       let oldPath = resolve(dir, file)
    //       let newPath = resolve(dir, newName)
    //       writeFileSync(newPath, readFileSync(oldPath))
    //       // 删除旧文件
    //       unlinkSync(oldPath)
    //     }
    //   })      
    // }
  }
}

// 合成css
function CombineCss() {
  let css = ''
  return {
    name: 'combine-css',
    generateBundle(options, bundle) {
      css = ''
      for (const fileName in bundle) {
        const file = bundle[fileName]
        if (file.type === 'asset' && file.name.endsWith('.css')) {
          css += file.source + "\n"
          delete bundle[fileName]
        }
      }
    },
    closeBundle() {
      if(css) {
        let dir = resolve(__dirname, './dist/assets')
        if(!existsSync(dir)) {
          mkdirsSync(dir)
        }
        writeFileSync(resolve(__dirname, './dist/assets/index.css'), css)
      }
    }
  }
}  

// 改变@-_plugin-vue_export-helper-xxxx.js的位置
function MoveVueExportHelper() {
  return {
    name: 'move-vue-export-helper',
    closeBundle() {
      let dir = resolve(__dirname, './dist/')
      if(!existsSync(dir)) {
        return
      }
      let files = readdirSync(dir)
      // 重命名文件
      files.forEach(file => {
        if(file.startsWith('@-_plugin-vue_export-helper')) {
          let newName = `common/${file}`
          let oldPath = resolve(dir, file)
          let newPath = resolve(dir, newName)
          writeFileSync(newPath, readFileSync(oldPath))
          // 删除旧文件
          unlinkSync(oldPath)
        }
      })
    }
  }
}  

// 替换加载资源路径, @__ASSET__path => extpath + path, @__ROOT__path => extpath + path
function ReplaceAssetPath() {
  return {
    name: 'replace-asset-path',
    generateBundle(options, bundle) {
      for (const fileName in bundle) {
        const file = bundle[fileName]
        if (file.type != 'asset' && file.code) {
          file.code = file.code.replace(/['"]@__ASSET__(.*?)['"]/gi, `Editor.Project.path + \"/extensions/${packageJSON.name}/assets$1\"`)
          file.code = file.code.replace(/['"]@__ROOT__(.*?)['"]/gi, `Editor.Project.path + \"/extensions/${packageJSON.name}$1\"`)
        }
      }
    }
  }
} 

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag.startsWith('ui-')
        }
      }
    }),
  ],
  optimizeDeps: {
    exclude: [
      'electron',
    ],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    }
  },
  build: {
    minify: false,
    outDir: 'dist',
    rollupOptions: {
      preserveEntrySignatures: 'allow-extension',
      input: getInputs(),
      output: {
        format: 'cjs',
        chunkFileNames: 'common/@-[name]-[hash].js',
        assetFileNames: 'assets/[name][extname]',
      },
      plugins: [
        RelativeRoot(),
        ReplaceAssetPath(),
        ModifyPluginVueExportHelper(),
        CombineCss(),
        MoveVueExportHelper(),
      ],
      external: [
        "electron",
        "vue",
        "heapsnapshot-parser",
        ... builtinModules,
      ]
    },
  },
})
