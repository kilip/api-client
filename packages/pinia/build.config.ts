import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  entries: [
    { input: 'src/index'}
  ],
  dependencies: [
    'vue',
    'pinia'
  ],
  externals: [
    '@kilip/api-client-core'
  ]
})
