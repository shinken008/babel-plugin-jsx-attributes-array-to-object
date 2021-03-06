import { types as Types, PluginObj, template as Template } from 'babel__core'
import { ConvertPluginPass as PluginPass } from './types'

const plugin = function (
  babel: {
    types: typeof Types,
    template: typeof Template,
  },
): PluginObj {
  const t = babel.types
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
                // @ts-ignore
                const mergeStyleExpression = t.callExpression(t.identifier('Object.assign'), [t.objectExpression([])].concat(attribute.value.expression.elements))
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
      }
    },
  }
}
export default plugin


