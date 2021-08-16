## babel-plugin-jsx-attributes-array-to-object
A tool for transforming jsx attributes array to object.
## example
```js
var a = { color: 'red' };
  
<div style={[a, { color: 'gray' }]}></div>
```
and the configure like this:
```
// .babelrc
[
  syntaxJSX,
  [require('babel-plugin-jsx-attributes-array-to-object
'), { attributes: ['style'] }],
]
```
the code will be transformed:
```js
var a = {
  color: 'red'
};
<div style={__mergeObject(a, {
  color: 'gray'
})}></div>;

function __mergeObject(...args) {
  return args.reduce((obj, next) => {
    obj = Object.assign(Object.assign({}, obj), next);
    return obj;
  }, {});
}
```

## Usage
### Step 1: Install
```sh
yarn add --dev babel-plugin-jsx-attributes-array-to-object
```
or
```sh
npm install --save-dev babel-plugin-jsx-attributes-array-to-object
```
### Step 1: Configure .babelrc
```js
{
  plugins: [
    [require('babel-plugin-jsx-attributes-array-to-object')]
  ]
}
```

