const cheerio = require('cheerio')

function CordovaHtmlOutputPlugin () {}

CordovaHtmlOutputPlugin.prototype.apply = function (compiler) {
  compiler.plugin('compilation', (compilation) => {
    compilation.plugin('html-webpack-plugin-before-html-processing', function (htmlPluginData) {
      const $ = cheerio.load(htmlPluginData.html)
      let cordovaJsFound = false

      $('script').each((index, element) => {
        if ($(element).attr('src') === 'cordova.js') { cordovaJsFound = true }
      })

      if (!cordovaJsFound) { $('body').prepend('<script src="cordova.js"></script>') }

      htmlPluginData.html = $.html()
    })
  })
}

module.exports = CordovaHtmlOutputPlugin
