const {gitDescribeSync} = require('git-describe');
process.env.VUE_APP_GIT_HASH = gitDescribeSync().hash;

module.exports = {
  lintOnSave: false,
  css: {
    loaderOptions: {
      sass: {
        prependData: `
        @import "@/styles/color.scss";
        `
      }
    }
  },
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');
 
    svgRule.uses.clear();
 
    svgRule
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader');
  },
}