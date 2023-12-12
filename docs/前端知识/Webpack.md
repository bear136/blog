## **一、webpack 的作用**
- **模块打包 ：**将不同模块的文件打包在一起，使得他们之间引用正确，执行有序。
- **编译兼容：** 通过 webpack 的 loader 机制，可以编译转换 .less .vue .jsx 等浏览器无法识别的格式文件
- **能力扩展：** 通过 webpack 的 plugin 机制，可以进一步实现按需加载、代码压缩等功能
## **二、webpack 配置**

- entry ： 入口
- output：出口
- plugins : 定义需要用的插件 。 目的在于解决loader无法实现的其他事，从打包优化和压缩，到重新定义环境变量，功能强大到可以用来处理各种各样的任务
- mode ： 定义开发环境和生产环境
- module： 决定结果和处理项目中不同类型的模块
   - loader: 用于**对模块源码的转换，**loader描述了webpack如何处理非javascript模块，并且在build中引入这些依赖。loader可以将文件从不同的语言（如TypeScript）转换为JavaScript，或者将内联图像转换为data URL
## **三、webpack 的打包过程**

- **初始化参数**：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数
- **开始编译**：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译
- **确定入口**：根据配置中的 entry 找出所有的入口文件
- **编译模块**：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
- **完成模块编译**：在经过第 4 步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系
- **输出资源**：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会
- **输出完成**：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

在以上过程中，Webpack 会在特定的时间点广播出特定的事件，插件在监听到事件后会执行特定的逻辑，并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果。
简单说:

- 初始化：启动构建，读取与合并配置参数，加载 Plugin，实例化 Compiler
- 编译：从 Entry 出发，针对每个 Module 串行调用对应的 Loader 去翻译文件的内容，再找到该 Module 依赖的 Module，递归地进行编译处理
- 输出：将编译后的 Module 组合成 Chunk，将 Chunk 转换成文件，输出到文件系统中
## 四、Plugin和Loader
#### Loader 
##### Loader 的本质 
loader 的本质是导出为函数的 JavaScript 模块 。 他接受资源文件或者上一个 loader 产生的结果作为参数，也可以是多个 loader 函数组成 loader chain ，最终输出转换后的结果。
##### Loader 的四种类型 

1.   我们平时使用的大部分都是普通类型的 loader，可以通过配置 enforce 属性来控制 loader 类型   Loader 按类型分可以分为四种：**前置（pre）、普通（normal）、行内（inline）、后置（post）**。![](https://cdn.nlark.com/yuque/0/2023/png/27018002/1692356221744-d30de7f2-fc9b-4687-9e06-ff2cf97c9801.png#averageHue=%23fbfbfa&clientId=ua8d6eb53-462d-4&from=paste&id=u46906932&originHeight=610&originWidth=3322&originalType=url&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&taskId=u66a2bc7d-aba4-4931-b81a-8f84f09dd2b&title=)
- **Pitching Loader **： Loader 上的 pitch 方法，按照 后置(post)、行内(inline)、普通(normal)、前置(pre) 的顺序调用。 **module.exports.pitch = pitchLoader**
```jsx
function myLoader(){
  .....
}
function pitchLoader(）{
  console.log(123)
}
module.exports = myLoader
module.exports.pitch = pitchLoader
```
**熔断机制：**即当 pitch loader 中有返回值 即 return value 时，此时就会执行**上一个 Loader 对象**的normal loader
例如：当pitch loader2 中有返回值时，此时下次执行 loader1 的normal Loader7
![](https://cdn.nlark.com/yuque/0/2023/png/27018002/1692356221845-a383991e-c2d0-4d0f-897a-9efc08e85711.png#averageHue=%23faf8f4&clientId=ua8d6eb53-462d-4&from=paste&height=239&id=u90ef0e94&originHeight=308&originWidth=957&originalType=url&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&taskId=ufded226e-7864-4fcf-a933-db37e72798c&title=&width=743)

- **NormalLoader**： Loader 上的 常规方法，按照 前置(pre)、普通(normal)、行内(inline)、后置(post) 的顺序调用。模块源码的转换， 发生在这个阶段。（module.exports = function(){}）
##### 常用的 Loader

- babel-loader ： 基于 babel 用于解析 JavaScript 文件 
- ts-loader: 打包编译 Typescript
- url-loader: 用于处理图片，若图片大于指定大小，将图片打包资源否则转换为 base64 字符串合并进 js 
- less-loader 
- postcss-loader: 补充 css 样式在各个浏览器内核前缀 
- eslint-loader: 检查代码是否规范，是否存在语法错误 
#### Plugin 
##### 关于 Tapable 
[tapable](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Ftapable)是一个类似于 Node.js 中的 [EventEmitter](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fevents) 的库，但它**更专注于自定义事件的触发和处理**。通过 [tapable](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Ftapable) 我们可以注册自定义事件，然后在适当的时机去触发执行。
webpack 实际上是一种基于**事件流**的机制，他的工作流程就是将各个插件串联起来，实现这一切的核心就是 tapable，webpack 内部通过 tapbale 会提前定义好一系列不同阶段的 hook，然后定时的去执行（执行 call 函数），插件要做的就是通过 tap 进行事件的注册 
##### 如何自己写一个 plugin
plugin 实际上就是一个普通的函数，在挂载到 webpack 上时 ，会调用** apply **方法 （内部规定），我们可以在 apply 函数中监听各种生命周期钩子 ，到达指定的时间点就会执行 
```jsx
//demo-plugin.js 
class DemoPlugin{
  apply(conplier){
    complier.hooks.done.tap('DemoPlugin',()=>{
      console.log('demoPlugin')
    })
  }
}
//webpack.config.js 

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  devtool: false,
  plugins: [new DemoPlugin()],
};
```
##### 常用的 plugin

- Hot-Module-Replacement ： 模块热更新插件 
- purifycss-webpack ： 生产环境去除多余的 css 代码 
- clean-webpack-plugin: 目录清理
- terser-webpack-plugin: 支持压缩 ES6 
- speed-measure-webpack-plugin: 可以看到每个 Loader 和 Plugin 执行耗时 （整个打包耗时、每个 Plugin 和 Loader 耗时）
- size-plugin：监控资源体积变化，尽早发现问题
## 五、Plugin 和 Loader 的区别
**Loader** 本质上是一个函数，在该函数中对接收到的内容进行转换，返回转换后的结果，即对其他类型的资源进行预处理。
**Loader：** 在 module.rules 中进行配置，作为类型的解析规则，类型为数组。每一项都是 Object，包括了 test（类型文件） 、loader、options 等属性
**Plugin** 就是插件，基于事件流框架，可以拓展 webpack 功能。在 webpack 运行周期内会广播许多事件，Plugin 可以监听这些事件，再合适的时机通过 webpack 提供的 api 修改输出结果
**plugin** 在 plugins 中单独配置，类型为数组，每一项都是一个 plugin 的实例，参数通过构造函数传入
## 六、热更新 
###### 首次启动

1.   会将编译后的文件以及唯一的 hash 传给客户端，客户端拿到后进行渲染 ，并保存

`lastHash=currentHash=h1`

   1. 当我们启动热更新后，webpack-dev-server 会先往客户端代码中写入两个文件用于：
      1. websocket 相关代码，用于和服务端通信
      2. 客户端接收到最新代码后更新代码
   2. 启动两个服务：
      1. 本地 http 服务，这个服务会为我们提供编译后的结果，浏览器可以通过该服务获取到编译后的内容
      2. websocket 服务： 监听当本地代码发生变化时，通知客户端获取新的代码，用于热更新 

  如何监听到本地文件发生变化？  
 编译时 webpack 会开启 watch模式 ，每次编译后的文件会生成一个唯一 hash。
> watch 模式：使用监控模式开始启动 webpack 编译，在 webpack 的 watch 模式下，文件系统中某一个文件发生修改，webpack 监听到文件变化，根据配置文件对模块重新编译打包，每次编译都会产生一个唯一的 hash 值

###### 二次编译 

1.   当本地文件发生变化时，重新编译生成一个 hash 值即 hash = h2  ，并将 hash = h2 发送给客户端，客户端修改自身变量` lastHash = h1 currentHash = h2 `
   1. 使用 hash = h1 向服务端发送请求获取 json 数据 ，目的是获取变更的代码块： 

 服务端接收到请求后，使用 hash = h1 与 自身最新的 hash=h2 进行比较，找出变更的代码块后返回给客户端 

   2. 客户端获取到变更的代码块后，使用 hash=h1 向服务端获取**变更的模块：**

  	服务端接收到请求后，使用 hash = h1 与 自身最新的 hash=h2 进行比较，找出变更的模块后返回给		客户端 

   3. 客户端拿到变更的模块后，重新执行依赖该模块的模块，达到更新的目的 

**注意：**
lastHash 和 currentHash 的作用： 

- 服务端并不知道当前客户端的 hash 是多少，如果发生多窗口（即又连接一个客户端）就会发生错误 
##### 总结：
当我们使用` webpack-dev-server `启动开发服务器后，他会在后台启动一个 websocket 服务，并在浏览器中注入两个文件用于保持 websocket 的通信 。 
**构建阶段：**webpack 会监听文件变化，当一个文件发生变化时，webpack 会重新构建出一个完整的模块依赖图，并根据依赖图来进行转换，并生成一个新的模块以及唯一的一个 hash，同时会与旧的模块进行对比找出哪些部分发生变化。 
**更新阶段：**当生成一个新的 hash 后，websocket 会将新的 hash 值发送给客户端，客户端将 lastHash 发送给服务端，并请求变更的补丁文件 ，服务端会检查新旧模块之间的差异，并生成一个补丁文件（新旧模块的差异），并将补丁文件发送给客户端。客户端接收到补丁文件后，会使用 webpack 提供的模块热替换 API 将补丁文件应用到页面中，实现了热更新。（热更新时只有更改的模块及其依赖项会被重新编译和热更新，而不是整个应用程序。
## 七、TreeShaking 原理
### 什么是TreeShaking
TreeShaking是一种基于ESModule规范的技术，他会在运行过程中静态分析模块之间的导入导出，确定ESModule模块中哪些导出值未曾被其他模块使用，并将其进行删除，以此来实现打包产物的优化 。
#### 如何启动TreeShaking 

- 使用ESModule规范编写模块代码 
- 配置optimization.usedExports 为 true，启动标记功能
- 启动代码优化功能，可以通过如下方式实现：
   - 配置 mode = production
   - 配置 optimization.minimize = true
   - 提供 optimization.minimizer 数组
#### sideEffects作用 
一般用于开发模块时标记模块代码是否有副作用。
在TreeShaking过程中会先检查这个模块所属的 package.json 中的 sideEffects 标识，以此来判断这个模块是否有副作用，如果没有副作用的话，这些没用到的模块就不会被打包
### TreeShaking为什么使用ESModule规范 ？ 
TreeShaking中最主要的一个步骤是对模块进行静态分析，找出导出但未被使用的变量或者模块并打上标记后清除。静态分析这一步骤则是基于**ESModule规范**进行实现的。 
### Commonjs模块化方案：

- 导入导出模块高度动态，难以预测 
- 模块是在运行时进行加载的，在编译时无法进行解析
```
if(process.env.NODE_ENV === 'development'){
    require('./bar')
    exports.foo = 'foo'
}
```
上述代码即只有运行环境是开发环境下时才进行导入导出操作。
### ESModule模块化方案 

- ESM要求所有的导入导出语句只能出现在模块顶层，且导入导出的模块名必须是字符串常量
- ESM模块在编译时进行加载 

由于ESM模块之间的依赖关系高度确定，和运行状态无关，编译工具则只需要对ESM模块进行模块分析，就可以从代码字面量中推断出那些模块被使用，哪些未被使用。
#### 实现原理
tree-shaking的过程类似于js的垃圾回收机制，即 分析-> 标记 -> 清除 
大致可以分为三个步骤：

1. 构建阶段，收集模块导出的变量并记录到模块依赖关系图 ModuleGraph变量中 
2. 解析过程，遍历ModuleGraph变量，标记模块导出但未被使用的变量 
3. 生成阶段，如果变量未被使用则删除对应的导出语句
#### 收集模块导出 

1. 将模块的所有ESM导出语句转换为Dependency对象，并记录到module的dependencies集合中 
   1. 具名导出转换为 HarmonyExportSpecifierDependency 对象
   2. 默认导出转换为HarmonyExportExpressionDependency 对象
2. 当所有模块编译完成后，触发 compilation.hooks.finishModules 钩子 ，执行回调：
   1. 从入口文件开始读取 ModuleGraph存储的模块信息，遍历所有module对象中的dependcies数组,将所有的依赖对象转化为exportInfo对象后存入ModuleGraph体系中
#### 标记模块导出 

   1. 从entry文件开始遍历ModuleGraph存储的 module对象 ， 遍历每一个module对象所对应的exportInfo数组
   2. 遍历每一个exportInfo对象，判断该对象所对应的dependency是否被其他模块调用
   3. 任意被调用的模块都标记为已使用 ， 并记录被如何使用 
#### 打包生成代码 

   1. 打包阶段调用插件生成代码
   2. 读取ModuleGraph存储的 exportsInfo 信息，判断哪些导出值被使用，哪些未被使用
   3. 将已经被使用的和未被使用的导出值进行存储后，遍历存储结果生成最终代码 
#### 删除Dead Code 
经过上述操作后，模块导出列表中未被使用的导出值都不会定义在 _webpack_exports_ 对象中，并生成一段不可执行的 Dead Code， 之后由 Terser等工具删除掉这些无用代码，形成完整的 **TreeShaking **操作
##  八、代码分割  CodeSpliting
### 什么是代码分割
我们在使用webpack时，通常会将所有的js文件打包到一个bundle.js文件中。 但是在一些大型项目中，可能bundle.js文件过大，会导致页面的加载时间过长，从而导致白屏时间过长，影响用户体验。这时候就需要进行代码分割，即将定义一些分割点，之后根据这些分割点将文件分割成块，并实现按需加载 
### 如何进行代码分割
Webpack在mode是production时，会自动开启**code spliting **
#### 内置的分割策略是：

- 新的chunk 是否被共享或者是来自 node_modules的模块 
- 新的chunk 体积在压缩之前是否大于30kb 
- 按需加载的chunk的并发请求数量小于等于5个
- 页面初始加载时的并发请求数量小于等于3个 

但是由于项目工程的不断增大，这些往往不能满足我们的需求，则需要一些定制化的优化
#### 优化策略
##### 分析依赖大小 
借助 webpack提供的插件系统，使用 webpack-bundle-analyzer 分析打包后的模块依赖以及文件的大小，确定优化的方向 
![](https://cdn.nlark.com/yuque/0/2023/png/27018002/1692357632639-13fe14c1-5c62-40f8-899d-7945e308bd92.png#averageHue=%23e8e6df&clientId=u186248dc-5bad-4&from=paste&id=ucd5429a2&originHeight=113&originWidth=768&originalType=url&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&taskId=u4c7e0563-8303-4237-91fb-a128660f721&title=)
打包后发现有三个文件过大，我们需要进行重新进行分割 
##### 配置分割规则
借助webpack自带的插件**optimization.splitChunks **配置分割规则，将上述三个代码单独抽离成打包文件 
![](https://cdn.nlark.com/yuque/0/2023/png/27018002/1692357632653-49de79e1-e5ea-45c8-861f-056ea1cf0f56.png#averageHue=%23f7f7f6&clientId=u186248dc-5bad-4&from=paste&id=uc7412a7f&originHeight=666&originWidth=758&originalType=url&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&taskId=uf88399a3-0d3d-46b9-8526-ac66bed72ad&title=)



## 九、打包优化
###  打包速度分析 
使用**speed-measure-webpack-plugin **插件，分析webapack的总打包耗时，以及每个plugin和loader打包耗时，从而进行性能优化 

```
const smp = new SpeedMeasurePlugin({
    disable: false,
    outputFormat: "human",
    outputTarget: console.log,
})

module.exports = smp.wrap({
    ...webpackConfig
})
```
![](https://cdn.nlark.com/yuque/0/2023/png/27018002/1692357783820-c4b906f0-83c7-47c6-bdde-6d47b21e312d.png#averageHue=%23282a37&clientId=u186248dc-5bad-4&from=paste&id=ub8839b1b&originHeight=533&originWidth=737&originalType=url&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&taskId=u4ffdbf7b-7a30-4d62-a8bc-bd258dbe9f5&title=)
### 多进程构建 
对于比较耗时的模块，同时开启多个nodejs进程进行构建，这样可以有效的提高打包的速度 

- thread-loader 
- parallel-webpack 

下面是使用thread-loader进行构建，发现打包速度减少了5s左右 
![](https://cdn.nlark.com/yuque/0/2023/png/27018002/1692357783702-4b62f197-96d0-4d5c-94ab-a37b1e8a2603.png#averageHue=%23282a37&clientId=u186248dc-5bad-4&from=paste&id=uadce7d5a&originHeight=513&originWidth=743&originalType=url&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&taskId=u0279e8c1-bc3c-4d87-8e88-d9edda9ca1d&title=)
### 缩小构建范围
通过 test 、 include 、 exclude三个配置项控制Loader处理文件的范围 
### 使用缓存
webpack5内置了cache模块，缓存生成的webpack模块和chunk，用来提高构建速度 
或者使用 cache-loader 进行缓存
**原理： **开启cache模块后，在第一次打包时，就会在node_modules文件夹下生成一个.cache文件，从而优化下次打包速度
## 十、Babel和Polyfill 
Babel是一个 Javascript编译器，主要将ES6+编写的代码转换为向后兼容的JavaScript语法，使其能够运行再当前和旧版本的浏览器或者其他环境中。

- 语法转化 （es6转es5 、jsx转化）
- 通过polyfill 方式在目标环境中添加缺失的特征（通过 @ babel / polyfill 模块）
- 原始码转换（codemods）
### Babel原理
babel的转移过程分为三个阶段，这三个步骤分别是：

1. 解析（parse）：将代码解析生成抽象语法树（AST），先**词法分析**再**语法分析**的过程，最终转为AST。 使用 @babel/parser 解析代码，对不同词法添加不同type。
2. 转换（Transform）：对于AST进行变换的一系列的操作，babel接收得到的AST并通过babel(遍历)的相关插件babel-traverse对其进行遍历，在此过程中进行添加，更新以及移除等操作。
3. 生成（Generate）：将变换后的AST再转换为JS代码，转换成字符串形式的代码，同时还会创建源码映射（source maps），使用到的模块是babel-generator。

**Babel中的预设：**
**预设： **babel中的插件只能对单功能进行转换，当需要配置的插件过多时，就可以封装成预设，来简化插件的使用。**简单来说，预设就是一组原先设定好的babel插件，是一组插件的集合 **
**常见的预设：**

- @babel/preset-env : 根据配置的目标浏览器或者运行环境来自动将ESnext转换ES5
- @babel/preset-react: 解析react框架时所需要的
- @babel-preset-typescript： typescript需要的 
#### 核心
##### @babel/core 
主要作用为根据配置文件转化为代码，配置文件一般是.babelrc或babel.config.js ，主要作用为：

- 加载和处理配置（config）
- 加载插件 
- 调用 Parse 进行语法分析，生成AST 
- 调用 Traverse 遍历AST，以访问者模式应用插件对AST进行转换 
- 生成代码，包括SourceMap转化和源代码生成 
### 什么是Polyfill
babel 对一些新的 API 是无法转换，比如 Generator、Set、Proxy、Promise 等全局对象，以及新增的一些方法：includes、Array.form 等。所以这个时候就需要一些工具来为浏览器做这个兼容。
官网的定义：babel-polyfill 是为了模拟一个完整的 ES6+ 环境，旨在用于应用程序而不是库/工具。
比如，现代浏览器应该支持 fetch 函数，对于不支持的浏览器，网页中引入对应 fetch 的 polyfill 后，这个 polyfill 就给全局的window对象上增加一个fetch函数，让这个网页中的 JavaScript 可以直接使用 fetch 函数了，就好像浏览器本来就支持 fetch 一样。
![](https://cdn.nlark.com/yuque/0/2023/png/27018002/1692358108697-1cfeb22b-d3e7-4cb0-8f26-ba7c49521389.png#averageHue=%23fefdfd&clientId=u186248dc-5bad-4&from=paste&id=u90b0928b&originHeight=92&originWidth=447&originalType=url&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&taskId=u12a5e7cb-b112-400d-a308-a5bbcc456ad&title=)

1. 使用 babel-polyfill 会导致打出来的包非常大，很多其实没有用到，对资源来说是一种浪费。
2. babel-polyfill 可能会污染全局变量，给很多类的原型链上都作了修改，这就有不可控的因素存在。

因为上面两个问题，所以在 Babel7 中增加了 babel-preset-env，我们设置 <span>"useBuiltIns"</span> 这个参数值就可以实现按需加载 babel-polyfill 啦。

