import { types as Types, PluginObj, template as Template } from 'babel__core'
import { ConvertPluginPass as PluginPass } from './types'

function __mergeObject(...args) {
  return args.reduce((obj, next) => {
    obj = Object.assign(Object.assign({}, obj), next)
    return obj
  }, {})
}

const plugin = function (
  babel: {
    types: typeof Types,
    template: typeof Template,
  },
): PluginObj {
  const t = babel.types
  let needMerge = false
  let attributes: string[] = []

  return {
    name: 'babel-plugin-jsx-attributes-array-to-object',
    visitor: {
      JSXOpeningElement(jsxPath) {
        const { attributes: jsxAttributes } = jsxPath.node
        for (const attribute of jsxAttributes) {
          // style attribute is a expression
          // ignore JSXSpreadAttribute
          if (t.isJSXAttribute(attribute) && t.isJSXExpressionContainer(attribute.value)) {
            if (attributes.includes(attribute.name.name as string)) {
              // style is a array expression
              if (t.isArrayExpression(attribute.value.expression)) {
                needMerge = true
                // @ts-ignore
                const mergeStyleExpression = t.callExpression(t.identifier('__mergeObject'), attribute.value.expression.elements)
                attribute.value = t.jSXExpressionContainer(mergeStyleExpression)
              }
            }
          }
        }
      },
      Program: {
        enter(astPath, state: PluginPass) {
          if (!state.opts) return
          attributes = state.opts.attributes || []
        },
        exit(astPath) {
          const template = babel.template
          const node = astPath.node
          if (needMerge) {
            const mergeStyleStmt = template.ast(__mergeObject.toString())
            // @ts-ignore
            node.body.push(mergeStyleStmt)
          }
          needMerge = false
          attributes = []
        }
      }
    },
  }
}
export default plugin


