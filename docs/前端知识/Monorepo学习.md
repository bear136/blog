### 一、🧐什么是Monorepo策略
monorepo是**一种将多个项目代码存储到一个仓库**的软件开发策略 ，与之相对应的为multirepos（多代码库）
这些代码可能是相关的，但在逻辑上是独立的，甚至由不同的团队进行维护 
例如babel就使用了monorepo来进行代码管理
![](https://cdn.nlark.com/yuque/0/2023/png/27018002/1692361105804-d6de1404-6398-4359-b00b-423f3567e4ee.png#averageHue=%23fefefd&clientId=u83df1e01-ee40-4&from=paste&id=u2aca8d09&originHeight=833&originWidth=1246&originalType=url&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&taskId=u249c9660-d8b3-475b-a18b-5afd63f4ede&title=)
### 二、Monorepo的优劣
使用monorepo构建的仓库目录可能是下面这样：
```
|—— package.json 
|__ packages/
    |—— project1/
    |    |—— index.js
    |    |—— package.json
    |    |__ node_modules
    |—— project2/
    |    |—— index.js
    |    |—— package.json
    |    |__ node_modules
```
#### 优点

- **更简单的依赖关系管理 ：** 共享依赖关系很简单，所有的模块都托管在一个存储库中
- **统一的构建流程：**代码库中的每个应用程序可以共享一致的构建流程
- **统一的CI/CD：**可以为代码库中的每一个项目都配置CI/CD流程
- **代码复用变得非常简单：**所有的项目代码集中在一个代码仓库中，我们很容易抽离出业务组件或者通用工具
#### 缺点

- **新员工的学习成本高**： 不同于一个项目一个仓库，monorepo策略下新人需要花费更多的精力来学习各个代码库中的相互逻辑，如果内部项目紧密耦合，学习曲线会更加陡峭 
- **项目粒度的权限管理变复杂：**在支持 monorepo 策略中项目粒度的权限管理上很难有满意的方案，同时git中没有内置的目录权限 
### 三、monorepo项目实践
https://mp.weixin.qq.com/s/mV6gvPy-N3NZPEYONV4A0A
### 简单的monorepo构建
#### 创建文件结构
根目录即 monorepo目录下创建出三个文件夹

- Packages ： 存放所有子仓库
- apps： 主仓库的项目
- Common: 通用的文件等 

并使用 pnpm init 进行初始化 
![](https://cdn.nlark.com/yuque/0/2023/png/27018002/1692361105943-7bc3e2e4-55e5-44b0-b95f-59a8b58647d3.png#averageHue=%23262833&clientId=u83df1e01-ee40-4&from=paste&id=ua10fa321&originHeight=649&originWidth=1484&originalType=url&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&taskId=u5321783a-9438-4af1-a8f5-f3f773932af&title=)
#### 创建workspace 
根目录下创建 pnpm-workspace.yaml 文件，并根据目录结构创建workspace 
![](https://cdn.nlark.com/yuque/0/2023/png/27018002/1692361105897-225f2bc5-e699-4bec-ba3a-14b9a952c9f5.png#averageHue=%23262935&clientId=u83df1e01-ee40-4&from=paste&id=u2c7d0532&originHeight=722&originWidth=1712&originalType=url&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&taskId=u6ab1da87-6482-4495-899a-131bb92b48f&title=)
根目录下使用 pnpm install 进行安装所有的依赖 
#### 如何在主应用中实现工具包引用 
例如，在common中写了很多工具方法，我们需要在主程序中使用该方法，则可以：
![](https://cdn.nlark.com/yuque/0/2023/png/27018002/1692361105872-bbb2a135-90db-45c2-839e-7c5b9cc60625.png#averageHue=%23282a37&clientId=u83df1e01-ee40-4&from=paste&id=u6c5d1c09&originHeight=205&originWidth=792&originalType=url&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&taskId=u806c1c88-d7b8-48e7-a64d-efe913c6dd3&title=)
使用 pnpm -F 或者 pnpm --filter 进行添加模块即可 
![](https://cdn.nlark.com/yuque/0/2023/png/27018002/1692361105860-4db144c5-b850-47fa-a1a1-9b895c775b46.png#averageHue=%23272936&clientId=u83df1e01-ee40-4&from=paste&id=uead2ccac&originHeight=947&originWidth=1719&originalType=url&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&taskId=ue45fb321-b676-4a88-8ef9-7a3c57c8a59&title=)
同时package.json中也会存在该引用的依赖记录 
![](https://cdn.nlark.com/yuque/0/2023/png/27018002/1692361106729-022d9f48-c3d6-45fb-acc2-e2324acc7488.png#averageHue=%23272a36&clientId=u83df1e01-ee40-4&from=paste&id=u27f5045e&originHeight=733&originWidth=1195&originalType=url&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&taskId=u8f4e7a7e-f82c-4760-a3b1-6005edfd9dd&title=)
