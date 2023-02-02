import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  entries: [
    'src/index'
  ],
  externals: [
    '@doyolabs/api-client-core',
    '@vue/reactivity',
    'pinia',
    'vue'
  ]
})
