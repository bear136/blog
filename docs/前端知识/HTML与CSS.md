#### !DOCTYPE的作用 混杂模式和严格模式的区别
**!DOCTYPE：**一种通用标记语言的文档类型声明，用于告诉浏览器使用哪种模式解析文档 。
**(1) 严格模式： **浏览器以其支持的最高标准展示页面 
**(2) 混杂模式：**页面以比较宽松的向后兼容的方式显示
**区别：**

- **盒模型不同 ；**  严格模式为标准盒模型，混杂模式为IE盒模型
- **行元素的宽高 ； **严格模式不可以设置行元素宽高，混杂模式可以设置 
- **图片的padding ；** 混杂模式不可以设置图片padding
- **Table字体属性 ； **混杂模式下table的字体属性不能继承上层设置
- **white-space:pre ；** 混杂模式会失效
#### Meta标签的作用以及使用
meta标签是head内部的一个辅助性标签，提供HTML文档的元数据。meta中的数据是提供机器解读的，主要作用有：搜索引擎优化、自动刷新、页面转换时的动态效果、控制窗口大小 等等 
**属性：**
meta标签有两大属性：**http-equiv **和 **name **属性

1. **name: **用于描述网页，与对应的**content**中的内容主要是便于搜索引擎查找信息和分类信息
   1. **description **： 用于告诉搜索引擎当前网页的主要内容。  
   2. **keywords：**网页关键字  
   3. **viewport:**  网页缩放，一般用于响应式布局
   4. ** author** 用来标注网页的作者	
   5. **revised **指定页面的最新版本
```html
<meta name="description" content="这是我的HTML">   // 简介
<meta name="keywords" content="Hello world">   // 关键字
<meta name="author" content="aaa@mail.abc.com">   // 网页作者
<meta name="revised" content="V2，2023/7/1">   // 最新版本
// viewport 
< meta name="viewport"
  content="initial-scale=1,  // 首次加载时的缩放倍数
  maximum-scale=3, 					// 页面允许放大的倍数
  minimum-scale=1, 					// 允许缩小的倍数 
  user-scalable=no"					// 是否允许控制页面的方法和缩小 
>
```

2. **http-equiv : **用于设置于http请求头相关的信息
   1. **Content-type** 用于声明文档类型和字符集 
   2. **Expires** 用于设置浏览器过期时间，也就是响应头的expires属性
   3. **Refresh** 设定自动刷新以及跳转
   4. **Window-target** 强制页面在当前窗口独立显示
   5. **Pragma **禁止浏览器从本地计算机缓存中访问页面内容
```html
content-type: text/html charset=utf8 
<meta http-equiv="expires" content="31 Dec 2021">
<meta http-equiv="refresh" content="5 url=http://www.zhiqianduan.com">
<meta http-equiv="window-target" content="_top'>
<meta http-equiv="pragma" content="no-cache">    
```
#### SVG 和 Canvas 用法以及区别 

- 从图形类别来说，canvas基于像素的位图，放大缩小会失真。svg基于矢量图，放大缩小不会失真。
- 从渲染模式上来说，canvas是**即时模式**，svg是**保留模式**
   - **即时模式：**是过程性的，每次绘制图形都会发出绘图命令
   - **保留模式：**是声明性的，图形库会将该场景存入内存中，如果要进行改变时，则会发出命令用于更新
- canvas没有图层，所有的修改整个图布都要重新渲染，svg可以让单个标签进行渲染
- 动画方面，canvas适用于基于位图动画，svg适用于图表的展示
- canvas不能对绘制对象绑定事件，svg可以为绘制对象绑定事件
- svg由多个标签构成，利于SEO优化
#### 行级元素、块级元素

- 行级： span strong em a 
- 块级： div p ul li h form table  
- 行内块： input img 

**区别：**

- 行级元素允许多个排列，块级元素独占一行
- 块级元素可以设置宽高，行级元素不可以
- 行级元素水平的 margin 和 padding 有效 


#### 选择器以及权重
| **选择器** | **权重** |
| --- | --- |
| ！important | Inifity |
| 行间样式 | 1000 |
| id选择器 | 100 |
| 类选择器、伪类选择器、属性选择器 | 10 |
| 标签选择器、伪元素选择器 | 1 |
| 通配符 * | 0 |

#### 引入资源区别
##### src和href的区别：

- src： 引用资源并替换当前元素，当浏览器解析到src后，会暂停解析直到该资源加载完毕
- href： 当前元素和引用资源之间建立连接，浏览器解析到href后会并行加载，不会堵塞解析
##### link和@import的区别：

- link：加载的css会并行加载，且link不仅可以加载css文件，也可以加载其他资源文件
- @import：仅能加载css且引入的css会在页面加载完毕后进行加载

#### 浮动 float 
浮动即使元素脱离正常的文档流并使其移动到元素的最左边或者最右边
**高度塌陷：**当父元素没有设置高度时，子元素设置元素浮动脱离文档流，会导致无法撑开父元素，造成高度塌陷。
**清除浮动：**

- 父元素给定高度：由于父元素未给定高度则会造成高度塌陷
- 双伪元素法：父盒子设置双伪元素( `::after`、`::before`) 并给after添加 `clear:botn `
- 父元素开启BFC 
#### BFC 
BFC即块级格式化上下文，它是一个独立的渲染区域，容器内部的元素不会在不去上影响到外部元素，并且在一个BFC中，块级元素和行级元素会垂直沿着父元素的边框排列 
**布局规则：**

- 内部元素会垂直方向上一个接一个放置 
- 盒子垂直方向的距离由margin决定 
- 计算高度时需要加上浮动元素 

**如何触发：**

- 浮动元素 即 float除了none 
- position 为 absolute或者fixed 
- overflow除了visible （hidden，scroll，auto）
#### CSS盒模型 
css盒模型分为 **标准盒模型** 和** 怪异盒模型 **，通过box-sizing属性进行控制 

- 标准盒模型content-box： `width = 内容宽度 `
- 怪异盒模型 border-box ：`width = padding + border + 内容宽度  `
##### 获取盒模型高度 ：

1. `dom.style.width / height`
只能获取到内联样式设置的宽高属性，如果使用 class 或者 id 则不能获取到
2. `dom.currentStyle.width / height`
取到的是最终渲染后的宽和高 ，但是只有 IE 兼容
3. `document.getComputedStyle (dom , null ) . width / height`
取到最终渲染后的宽度和高度，兼容性更好
- 第一个参数：取得计算样式的元素；
- 第二个参数：一个伪元素字符串（例如“:after”），如果不需要伪元素信息，默认为 null；
4. `dom.getBoundingClientRect().width / height`
得到渲染后的宽度和高度
5. `dom.offsetWidth / offsetHeight`
包括高度（宽度）、内边距和边框，不包括外边距。最常用，兼容性最好。
#### position的属性值以及区别 

- absolute ： 绝对定位，相对于非static定位的第一个父元素进行定位
- relative ： 相对定位，相对于原本位置进行定位
- static：默认值
- fixed：相对于视口定位
- sticky：relative和fixed的结合体。在滚动到指定位置时会固定在屏幕上，但在达到另一个指定位置时会恢复到相对定位的状态。这种效果通常用于创建吸顶导航栏、侧边栏等用户界面组件。
#### 层叠上下文
层叠上下文是HTML中的一个三维的概念。每一个盒模型的位置是三维的，分别是平面画布上的x轴，y轴以及表示层叠的z轴，当元素发生堆叠后，就会发生元素覆盖的情况，而层叠上下文则是在z轴上的层叠级别。
**层叠顺序：**

- 形成层叠上下文的背景和边框
- －z-index 
- 块级盒子
- 浮动盒子
- 行内盒子
- z-index 正值
#### flex布局 
Flex布局意为弹性布局，flex容器中存在两根轴：水平的主轴和垂直的交叉轴，其中的子元素称为项目
##### 常见属性

- flex-direction 主轴方向
   - row ：水平方向，起点在左端
   - row-reverse : 水平方向，起点在右端 
   - column：主轴为垂直方向，起点在上沿。
   - column-reverse：主轴为垂直方向，起点在下沿。
- flex-wrap  如何换行
   - nowrap（默认）：不换行。
   - wrap：换行，第一行在上方。
   - wrap-reverse：换行，第一行在下方
- flex-flow 是flex-direction属性和flex-wrap属性的简写形式，默认值为row nowrap
-  justify-content 定义了项目在主轴上的对齐方式。
   - flex-start（默认值）：左对齐
   - flex-end：右对齐
   - center： 居中
   - space-between：两端对齐，项目之间的间隔都相等。
   - space-around：每个项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍。
- align-items属性定义项目在交叉轴上如何对齐。
   - flex-start：交叉轴的起点对齐。
   - flex-end：交叉轴的终点对齐。
   - center：交叉轴的中点对齐。
   - baseline: 项目的第一行文字的基线对齐。
   - stretch（默认值）：如果项目未设置高度或设为auto，将占满整个容器的高度。
- align-content属性定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用
##### 项目的属性

- order属性定义项目的排列顺序。数值越小，排列越靠前，默认为0。
- flex-grow属性定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。
- flex-shrink属性定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小
- flex-basis属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为auto，即项目的本来大小。

**重点： flex属性**
flex属性是flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto。后两个属性可选。
**flex:1 等价于 **
```
flex-grow: 1
flex-shrink: 1
flex-basix: 0%
```
align-self属性允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性。默认值为auto，表示继承父元素的align-items属性，如果没有父元素，则等同于stretch。

#### 水平垂直布局的方法 
##### Absoulte + 负margin
```css
.center{
  position:absolute;
  top:50%;
  left:50%;
  margin-left:-50px;
  margin-top:-50px;
}
```
##### absolute + margin auto
```css
.center{
  position: absolute;;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
```
##### absolute + calc
```css
.center{
  position: absolute;;
  top: calc(50% - 150px);
  left: calc(50% - 150px);
}
```
##### absolute + transform
```css
.center{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```
##### Css-tabel
```css
.wp {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
}
.box {
  display: inline-block;
}
```
##### Flex布局
```css
.center{
  display:flex;
  justify-content:center;
  align-items:center;
}
```
##### grid布局
```css
.center{
  display:grid;
  place-content:center;
}
```
#### 让元素隐藏的几种方法
##### 隐藏的方法：

- `display : none ; `
- `visibility：hidden  ； `
- `opacity：0 ； `
- `margin、position、translate  z-index` 移除屏幕外
##### 区别：

- 是否占据空间：
   - display:none；隐藏后不占位置，可能会导致布局改变 
   - visibility：hidden；opacity：0；隐藏后仍然占据位置 
- 子类是否继承：
   - display : none；不会被子元素继承 
   - visibility：hidden；会被子元素继承，但是可以设置visibility : visible; 来显示子元素 
   - opacity : 0 ; 会被子元素继承，但是子类不可以设置opacity来显示 
- 适用场景：
   - opacity：0 ; 常用于实现淡入淡出效果或者动画
   - display: none ; 用于彻底从渲染中移除元素  







#### Transtation和 animation的区别 
**区别：**

1. transtation是**过渡属性**，它的实现需要触发事件，过渡只有**开始**和**结束**两个关键帧，transtation只能触发一次 
2. animation是**动画属性** ，它的实现不需要触发事件，动画可以通过@keyframe设置多个关键帧，且可以设置循环次数 
##### 如何使用 Web Animation API 实现动画
使用方法：` element.animation ()`
```javascript
element.animate([
  { opacity: 0 },
  { opacity: 1, offset: 0.4 },
  { opacity: 0 }
], {
  duration: 3000,
  delay: 0,
  fill: 'forwards',
  easing: 'steps(8, end)',
  iterations: Infinity
});
```
那么如何实现本次动画播放完成后，播放下个动画呢？ Web animation API提供了以下的事件接口：

- 动画取消的回调：` Animation.oncancel`
- 动画结束的回调：`Animation.onfinish`
- 获取当前的时间：`Animation.currentTime`
- 获取或者设置动画效果，通常是关键帧效果对象：`Animation.effect`

#### 重排和重绘 
**重排：**当渲染树的节点信息大小，边距等发生改变，或者删除新增某节点，此时浏览器就需要重新计算各节点的大小和位置，然后将计算的结果绘制出来的过程叫做回流。
**重绘：** 当对dom元素进行简单的修改样式却未影响页面的布局时，浏览器不需要重新计算元素信息，直接为该元素绘制的样式，这个过程叫做重绘。
**导致重排的操作：**

- 浏览器窗口大小改变 
- 元素尺寸或者位置改变 
- 元素内容改变 
- 元素字体大小发生改变 
- 增删dom元素 
- offsetTop、scrollTop、getBoundingClientRect 

现代浏览器大多采用队列机制来批量更新布局，浏览器会将修改操作存入到一个队列中，至少一个浏览器刷新才会清空队列，当你使用获取元素布局信息的API后会强制刷新队列，触发重排列
**如何减少重排和重绘： **

1. **css方面**
   1. 使用transform替代top
   2. 使用visibility替换display:none；（前者只会触发重绘，后者则是回流）
   3. 避免设置多层嵌套内联样式，css选择符是从右向左匹配查找的，避免层级过多
   4. GPU加速，使用transform、opacity、filters实现加速
2. **JavaScript方面**
   1. 避免频繁操作样式
   2. 避免重复操作dom，可以使用display将其卸载后更改完毕后挂载 。创建一个代码片段 documenFragment在它上面进行所有的dom操作后，再将他添加到文档中。

#### attribute 和 property 区别 
attribute是我们在html上的特性 ，他的值只能是string类型
```
<input id="the-input" type="text" value="Name:" />
```
以上代码就有三个attribute：

- id the-input 
- type text 
- value Name: 

**property** 是 attribute 对应的 DOM 节点的 对象属性 (Object field), 例如:
**区别：**
DOM节点在初始化的时候，会将html规范中定义的attribute赋值到peopety上，但是自定义的attribute不会被赋值

- attribute的只能是string，property则可以是多种类型
- attribute可以创建自定义的值，而property则不行
- property可以通过dom对象进行获取

#### 圣杯布局和双飞翼布局 
##### 圣杯布局 
```html
 <div class="main clear-fix">
    <div class="center">center</div>
    <div class="left">left</div>
    <div class="right">right</div>
 </div>

 <style> 
    .main {
        background-color: red;
        padding: 0 100px;
        overflow: hidden;
    }
    
    .center,
    .left,
    .right {
        float: left;
    }
    
    .left {
        width: 100px;
        background-color: yellow;
        position: relative;
        margin-left: -100%;
        left: -100px;
    }
    
    .right {
        width: 100px;
        background-color: green;
        position: relative;
        margin-left: -100px;
        right: -100px;
    }
    
    .center {
        width: 100%;
        background-color: #ccc;
    }
 </style>
```
##### 双飞翼布局
```html
<div class="main_center">
    <div class="center">center</div>
</div>
<div class="left">left</div>
<div class="right">right</div>

<style>
      .main_center {
        width: 100%;
        background-color: red;
        overflow: hidden;
      }
      
      .center {
     		margin: 0 100px;
      }
      
      .main_center,
      .left,
      .right {
      	float: left;
      }
      
      .left {
        width: 100px;
        background-color: yellow;
        margin-left: -100%;
      }
      
      .right {
        width: 100px;
        background-color: green;
        margin-left: -100px;
      }
      
      .center {
        width: 100%;
        background-color: #ccc;
      }
</style>
```
