const {override,addDecoratorsLegacy,disableEsLint,useBabelRc,fixBabelImports} = require('customize-cra');
module.exports = override(
     addDecoratorsLegacy(), // 装饰器支持
     fixBabelImports('import',{ libraryName: "antd", style: "css" })
)

    // ui框架按需加载
  fixBabelImports('import', {
    "libraryName": "antd",
    "libraryDirectory": "es",
    "style": "css" // style: true  会加载 less 文件
  }),
  // 如果有多个UI框架 注意在后面加一个唯一值标识, 比如下面的写法
  // fixBabelImports('import', {
  //   "libraryName": "antd",
  //   "libraryDirectory": "es",
  //   "style": "css" // style: true  会加载 less 文件
  // }, 'autd'),
  // 禁用eslint
  disableEsLint()
  // 使用.bablelrc 配置
 useBabelRc()
 