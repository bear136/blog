### 什么是pnpm
Pnpm 的由来是因为pnpm作者对现有的npm和yarn的性能感到很失望，于是另起炉灶创建了performance npm 即高性能npm 也就是现在的pnpm 
### pnpm性能优势
![](https://cdn.nlark.com/yuque/0/2023/png/27018002/1692361161331-44320683-a223-49f8-8773-1d3d95fc9060.png#averageHue=%23fcf5f0&clientId=u87f23c4e-5573-4&from=paste&id=uedf7aba8&originHeight=840&originWidth=807&originalType=url&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&taskId=uf7e2fd8a-2239-4e7b-bd78-79dc2536769&title=)
我们由上图可以发现，某些方面pnpm的性能有着出众的表现，那么pnpm是如何来提高自己的性能的呢？
### node_modules安装方式 
#### 嵌套安装
在npm@3之前，node_modules的每个依赖都有一个package.json文件和node_modules文件夹，文件中指定了自己的依赖项，即会创建出一棵依赖树来 
```
node_modules
└─ foo
   ├─ index.js
   ├─ package.json
   └─ node_modules
      └─ bar
         ├─ index.js
         └─ package.json
```
**缺点： **

- 依赖过多的话可能会造成依赖树过深，导致查询时间变长
- 当一个package被多个依赖所需要，则会复制多个文件
#### 扁平安装
为了解决上述问题，npm@3+ 和 yarn 提出了扁平化结构 
**缺点：**

- 当同一个包的多个版本在项目中被依赖时会出现package hoist（依赖提升），但是提升的顺序是不确定的，并且只能提升一个版本，另一个版本和嵌套安装一样保存在该依赖的node_modules中 

![UML 图.jpg](https://cdn.nlark.com/yuque/0/2023/jpeg/27018002/1692361204979-66526459-2d92-40e0-b7fe-cf3c18a1e4a2.jpeg#averageHue=%23f9f8f8&clientId=u87f23c4e-5573-4&from=ui&id=u1c81bb47&originHeight=574&originWidth=1214&originalType=binary&ratio=1.25&rotation=0&showTitle=false&size=54381&status=done&style=none&taskId=u801c810d-5a7f-427b-bae7-cbdf3765821&title=)
##### 扁平结构存在的问题
###### 一、幽灵依赖
某个包在package.json中没有被依赖，但是用户可以引用到该包
如上图：当我们APP 依赖 package A ，同时package A又依赖package C@1.0 时，经过扁平化处理，C@1.0会被提升到和A同一级，则我们可以引用到C@1.0 同时也可以引用到A
###### 二、依赖分身
当扁平化处理后，由于每一个依赖只能提升一个，那么就会存在同一版本被重复安装的问题 
扁平化处理后，依旧存在packageX@2.0和packageY@2.0被重复安装 
### pnpm如何设计
pnpm会在磁盘中创建一个中心化的 **pnpm store** 来保存所有依赖，并且在 .pnpm/node_modules下存储项目的**hard links **, 通过hard links 来链接真实的文件资源 。 在引用依赖的使用 使用 symlink 去寻找对应目录的依赖地址。
node_modules 中的 bar 和 foo 两个目录会软连接到 .pnpm 这个目录下的真实依赖中，而这些真实依赖则是通过 hard link 存储到全局的 store 目录中。
#### Store
pnpm资源在磁盘上的存储位置 
用户可以在 .npmrc文件下设置store的目录位置，如果不设置则使用默认目录 即 ${os.homedir}/.pnpm-store这一文件夹下 
##### 解决的问题：

- 每次安装依赖时，如果是相同的依赖，好多项目都在使用这一依赖且版本相同，则只需要安装一次 
- 如果存在该依赖，则会直接使用 hard-link 进行链接，避免二次安装带来的时间消耗 

同时可以使用 pnpm store prune 来清除未引用的包 [pnpm store | pnpm](https://pnpm.io/zh/cli/store)
#### Hard-link 和 Symbolic links 
##### 一、前置知识：
**索引节点（inode）： **用来存储文件和目录信息的结构体。它包含了时间、文件名、用户和组等信息，是文件系统中不可缺少的一部分。使用inode，操作系统可以检索相关文件信息。同时文件的移动也会导致对应的inode进行改变。 
##### 二、硬链接 hard-link
硬链接是通过inode直接引用文件，使用硬链接，操作者可以更改原始文件的位置和内容，且硬链接仍然指向该文件
##### 三、软链接 symbolic link
软链接本质上是保存被链接文件的路径 。这种方式可以应用于目录，并且可以跨不同的硬盘/卷进行引用 。 但是文件位置发生变化后将破坏软链接，或者变成空链接 
![](https://cdn.nlark.com/yuque/0/2023/png/27018002/1692361161182-72aaac0a-ed79-4eea-b2c8-8b74a3149d06.png#averageHue=%23eaeff2&clientId=u87f23c4e-5573-4&from=paste&id=uad2fc6a1&originHeight=1392&originWidth=2920&originalType=url&ratio=1.25&rotation=0&showTitle=false&status=done&style=none&taskId=u662bc0dc-3dfc-4525-a07d-a995337acc9&title=)
### Monorepo 支持 
##### 一、什么是monorepo? 
[Monorepo学习](https://feuux5hgzd.feishu.cn/docx/F991d3Ipho44AYx1FxGc6KBDnkh)
##### 二、使用pnpm搭建的优势

1. 独特的依赖关系处理机制很好的解决了一直让人诟病的幽灵依赖的问题
2. 利用硬链接的机制加快依赖安装速度
3. 强大的 filter 机制可以筛选出指代的 package 或者基于 git 变更进行特定的操作
##### 三、实战演练
[基于 pnpm + changesets 的 monorepo 最佳实践 - 掘金](https://juejin.cn/post/7181409989670961207#heading-5)
