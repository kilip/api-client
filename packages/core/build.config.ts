import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  entries: [
    'src/index'
  ],
  externals: [
    '@types/qs',
    'hookable',
    'ofetch',
    'qs'
  ]
})
