module.exports = {
  presets: [
    ['@babel/preset-env', {
      modules: false,
      useBuiltIns: 'usage',
      targets: {
        browsers: ['> 1%', 'not dead', 'last 2 versions', 'not ie <= 8']
      }
    }]
  ],
  plugins: [
    'transform-vue-jsx',
    '@babel/plugin-syntax-dynamic-import'
  ]
}
