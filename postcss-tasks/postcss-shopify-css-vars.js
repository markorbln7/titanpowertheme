const fs = require('fs')
const path = require('path')
const postcss = require('postcss')
const CSS_VAR_FUNC_REGEX = /var\(--(.*?)\)/
const CSS_VAR_DECL_REGEX = /--(.*?):\s*(\{\{\s*.*?\s*\}\}.*?);/g

module.exports = postcss.plugin('postcss-shopify-css-vars', (opts = {}) => {
  const varsPath = path.resolve(__dirname, opts.vars)
  const varsData = fs.readFileSync(varsPath, 'utf8')
  const liquidVariables = varsData.split(':root')[0]
  const variables = {}

  let cssVariableDecl
  while ((cssVariableDecl = CSS_VAR_DECL_REGEX.exec(varsData)) != null) {
    const [, cssVariable, liquidVariable] = cssVariableDecl;
    variables[cssVariable] = escapeLiquidVariable(liquidVariable);
  }

  return function (root, result) {
    root.walkDecls(decl => {
      const result = isTransofmable(decl)

      if (!result) {
        return
      }

      const [, cssVariable] = result

      if (!variables[cssVariable]) {
        return
      }

      decl.value = decl.value.replace(CSS_VAR_FUNC_REGEX, variables[cssVariable])
    })

    root.prepend({
      text: liquidVariables.trim()
    })
  }
})

function isTransofmable (decl) {
  return CSS_VAR_FUNC_REGEX.exec(decl.value)
}

function escapeLiquidVariable(variable) {
  return variable.replace(/"/g, '\\"')
}
