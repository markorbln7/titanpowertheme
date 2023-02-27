const target = process.env.npm_lifecycle_event
const isProductionMode = target === 'build'

const config = {
  plugins: [
    require('precss')({
      // Disable warning "used without a fallback"
      'properties': { warnings: false }
    }),
    require('postcss-easy-import'),
    require('@solislab/postcss-type')({rootSize: '16px'}),
    require('postcss-mixins'),
    require('postcss-percentage'),
    require('postcss-inline-svg'),
    require('postcss-color-function'),
    require('autoprefixer'),
    require('postcss-automath'),
    require('postcss-hexrgba'),
    require('postcss-extend'),
    require('postcss-each'),
    require('postcss-critical-split')({
      'output': isProductionMode ? 'rest' : 'input'
    }),
    ...(isProductionMode
        ? [
          require('cssnano')({
            autoprefixer: false,
            zindex: false
          })
        ]
        : [
        ]
    )
  ]
}

module.exports = config
