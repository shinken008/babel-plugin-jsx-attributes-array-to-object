import * as babel from '@babel/core'
import syntaxJSX from '@babel/plugin-syntax-jsx'
import plugin from '../src'

const plugins = [
  syntaxJSX,
  [plugin, { attributes: ['style'] }],
]

it('should work!', function () {
  const code = `
  var a = { color: 'red' };
  
  <div style={[a, { color: 'gray' }]}></div>
  `
  const result = babel.transform(code, { plugins })
  expect(result?.code).toMatchSnapshot()
})
