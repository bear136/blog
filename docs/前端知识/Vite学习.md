:::info
Vite 是新一代的前端构建工具，其主要利用了浏览器**ESM**特性进行导入组织代码，在服务器端按需编译返回，完全跳过了打包的过程。且生产中使用**Rollup**作为打包工具进行打包。 
:::
### 特点：

- 快速的冷启动： no Bundle + esBuild 预加载
- 即使的模块热更新： 基于ESM的HMR，同时利用浏览器的缓存策略提升速度（强缓存）
- 真正的按需加载： 利用ESM实现按需加载
### Dev Server 原理：
简单来说，vite构建的核心原理即利用了现有浏览器大部分都支持ESM这一特性，遇到一个import 就会发送一个http请求去加载文件，Vite再启动一个koa服务器对所有的请求进行拦截，在后端进行相应的处理将项目中使用的文件通过简单的分解与整合，然后以ESM的格式返还给浏览器，实现真正的按需加载。 
#### 基于ESModule的构建
![](https://cdn.nlark.com/yuque/0/2023/png/27018002/1692358274119-2a13ed87-26b7-4b66-9d17-8eb238606bfc.png#averageHue=%23e3e2e1&clientId=ubef7d779-426a-4&from=paste&id=ue0195002&originHeight=389&originWidth=679&originalType=url&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&taskId=u4997265b-c9aa-4af4-934f-3ccd0886cad&title=)
对于Vite来说将应用分为了两类 ：**源码** 和 **依赖 **
##### 源码的构建
**源码：** 即我们时常进行更改的文件，例如jsx、css、vue等组件，同时并不是所有的代码都需要被加载（基于路由的代码拆分）
**如何构建：**
使用原生的ESModule，当浏览器请求源码时，Vite开启一个Koa服务，对请求进行拦截，将请求到的源码进行解析编译，最后使用ESModule的格式返回给浏览器。 （即浏览器承担了打包程序的部分工作）
##### 依赖预构建（开发模式）
当首次启用Vite时，Vite会在本地加载当前站点前预构建项目依赖
###### 为什么需要依赖预构建

1. **支持commonJS**

由于Vite在开发服务器时将所有的代码都视为原生ES模块，因此Vite必须将CommonJS或者UMD转换为ESM格式。

1. **减少模块和请求数量**  为提高性能Vite将那些内部有很多模块的ESM依赖项转换为单个模块。  例如 import {debounce} from 'loadsh-es' loadsh-es中有着600多个模块，如果都进行导入则浏览器会发送600多个请求，大量的请求可能会导致网络堵塞导致页面加载缓慢。  此时Vite根据依赖关系，将loadsh-es转换成一个模块，用于提高页面的性能
###### 实现原理
**文件系统缓存**
Vite将预构建的依赖项缓存到 node_modules/.vite 中只有当以下几个来源发生变化后才会重新进行预构建：

- 包管理的锁文件内容: yarn.lock 、package-lock.js  、pnpm-lock.yaml
- 补丁文件夹的修改时间 
- vite.config.js 中的配置文件 
- NODE_ENV 的字段 

**浏览器缓存 **
已构建的依赖请求使用 HTTP头 max-age=31536000, immutable 进行强缓存以提高开发过程中页面重新加载的性能。 
#### 热更新
传统的构建工具webpack是先解析依赖、打包构建在启动开发服务器，Dev Server必须要等到等到所有模块构建完成之后才能进行，当我们修改bundle.js 中的某一个子模块时，整个bundle.js都会重新打包，项目越大，启动的时间就越长。 
##### Vite热更新的核心流程

1. 创建一个 websocket 服务器 和一个 client 文件并启动服务 
2. Vite通过 chokidar 监听文件变更 
3. 当代码发生变化时，服务端处理和判断并推送至客户端 
   1. 使用moduleGraph.onFileChange修改文件缓存 
   2. handleHMRUpadte执行热更新 
4. 客户端根据服务端推送的信息执行不同的操作进行更新 

![](https://cdn.nlark.com/yuque/0/2023/jpeg/27018002/1692358273906-56c2017b-21a6-43ac-8ab8-03a9b9d6c4bd.jpeg#averageHue=%23f2f2f2&clientId=ubef7d779-426a-4&from=paste&id=u9d29bf2c&originHeight=554&originWidth=1054&originalType=url&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&taskId=uaadc16e0-aef0-4f7f-9326-a68cb11b456&title=)
其中使用浏览器缓存进行性能的优化 
#### 打包过程
在生产环境下使用**Rollup**进行打包 
虽然原生的ESM现在得到广泛支持，但是在生产环境下发布未打包的ESM仍然因为网络原因效率低下。为了在生产环境中得到更好的性能，需要将代码进行tree-shaking、懒加载等操作，所以我们依旧需要进行打包。
