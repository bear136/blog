### 数据类型 
#### 基本内容
**基本数据类型 ：** string boolean  undefined null number symbol bigInt

**引用数据类型 ：** object

**区别：**

- 基本数据类型存在栈中，占据空间大小固定
- 引用数据类型存在堆中，占据大小空间不固定 ，在栈中存储指针，该指针指向堆中该实体的起始位置，堆中存储实体
- 基本数据类型是值传递 ，拷贝时会创建一个完全相等的变量，在栈中开辟一块内存存储原变量的副本
- 引用数据类型是引用传递，拷贝时会在栈中创建一个指针指向原有变量（浅拷贝）

**为什么引用数据类型存在堆中：**

- 引用数据类型他占据空间大，大小空间不固定，如果存在栈中则会影响程序的运行性能
- 堆是一个完全二叉树，他不是最大堆就是最小堆，存储在堆中查找会比较方便
#### 超长字符串存储
在V8引擎中，默认栈的大小是984kb，但如果说有一个超长字符串>984kb后，则该字符串的存储即为： 

字符串的内容存在堆内存中，指针存在栈内存中，相同的字符串指向同一个堆内存

**原理:**

1. V8内部使用一个叫做stringTable的hashMap缓存了所有的字符串，在转为AST树时，每次遇到一个字符串就会根据他的特征转换为一个hash值存入hashMap中，如果遇到hash一致的字符串，则会优先去除字符串进行比对，如果不同则重新生成新的字符串。
2. 不同的字符串使用的hash方式来缓存

#### 类型判断 
##### Typeof 
用于区分基本数据类型，**无法区分null** 和引用数据类型 但是可以区分 **function** 

**原理：** 

js的第一个版本中，单个值会在栈中占用32位的存储单元，每个存储单元包含一个**1~3bit的类型标签**，类型标签存储在每个单元的低位 

typeof通过类型标签进行判断数据类型

```css
000: object   - 当前存储的数据指向一个对象。
1: int        - 当前存储的数据是一个 31 位的有符号整数。
010: double   - 当前存储的数据指向一个双精度的浮点数。
100: string   - 当前存储的数据指向一个字符串。
110: boolean  - 当前存储的数据是布尔值。
```
##### Instanceof
 用于区分引用数据类型，不能检测基本数据类型 。 

**原理：**用来比较一个对象的是否为某一个构造函数的实例 

```javascript
 function myInstanceof (obj, constructor) {
    let proto = constructor.prototype
    let object = Object.getPrototypeOf(obj)
    while (1) {
        if (object === null) return false
        if (proto === obj) return true
        object = Object.getPrototypeOf(object)
    }
}
```
**注意： ** 

Instanceof 是通过原型链进行实现的，但是同一个页面可能会出现两条不一样的原型链  

**原因：** 

**`Iframe`** **`webworker`** **`serviceworker`**  这些有自己的上下文，所以可能出现不一样的原型链 

##### constructor
```css
/**
* x是否为type类型
**/
const isXType = (x,type) => x.constructor.toString().indexOf(type) > -1
```
##### Object.prototype.toString.call()
对象会使用ToPrimitive ，首先（通过内部操作 DefaultValue）检查该值是否有valueOf()方法。如果有并且返回基本类型值，就使用该值进行强制类型转换。如果没有就使用 toString() 的返回值（如果存在）来进行强制类型转换。 

**调用时会执行以下步骤：**

1. 获取this指向的对象的 [[class]] 属性的值
2. 计算出三个字符串 " [ object 、第一步计算的值 、以及] " 连接后的新字符串
3. 返回第二部计算的结果 

[[Class]]是一个字符串值，表明了该对象的类型。他是一个内部属性，所有的对象(原生对象和宿主对象)都拥有该属性，且不能被任何人修改。在规范中，[[Class]]是这么定义的：**内部属性 描述**。

#### 小数精度缺失 
在 JavaScript 中只有一种数字类型：Number，它的实现遵循IEEE 754标准，使用64位固定长度来表示，也就是标准的double双精度浮点数。在二进制科学表示法中，双精度浮点数的小数部分最多只能保留52位，再加上前面的1，其实就是保留53位有效数字，剩余的需要舍去，遵从“0舍1入”的原则。 

根据这个原则，0.1和0.2的二进制数相加，再转化为十进制数就是：0.30000000000000004。 

**怎样解决： ** 

将小数转成整数后进行相加

```javascript
function foo (num1, num2) {
  const len1 = (num1 + '').split('.')[1].length
  const len2 = (num2 + '').split('.')[1].length
  const max = Math.max(len1, len2)
  const multiple = Math.pow(10, max)
  return (num1 * multiple + num2 * multiple) / multiple
}
```

#### 类型转换 
##### 隐式类型转换 

1. 首先会判断两者类型是否**相同，**相同的话就比较两者的大小；
2. 类型不相同的话，就会进行类型转换；
3. 会先判断是否在对比 `null` 和 `undefined`，是的话就会返回 `true`
4. 判断两者类型是否为 `string` 和 `number`，是的话就会将字符串转换为 `number`
5. 判断其中一方是否为 `boolean`，是的话就会把 `boolean` 转为 `number` 再进行判断
6. 判断其中一方是否为 `object` 且另一方为 `string`、`number` 或者 `symbol`，是的话就会把 `object` 转为原始类型再进行判断
##### Object.is() 与比较操作符 “===”、“==” 的区别？

1. 使用双等号（==）进行相等判断时，如果两边的类型不一致，则会进行强制类型转化后再进行比较。
2. 使用三等号（===）进行相等判断时，如果两边的类型不一致时，不会做强制类型转换，直接返回 false。
3. 使用 Object.is 来进行相等判断时，一般情况下和三等号的判断相同，它处理了一些特殊的情况，比如 -0 和 +0 不再相等，两个 NaN 是相等的。
### let const var的区别 

1. var声明变量时存在变量提升。let和const则不存在且声明的变量仅在该作用域内有效 
2. let  const 不可以重复声明 。 
3. 存在暂时性死区，即在声明变量前使用会报错 
4. const一般用于声明不可变的变量（地址），声明变量时需要初始化 
#### let和const为什么不能重复声明
js存在全局环境变量记录其中包含两个部分：

- 对象式环境记录：主要用于with和global的词法环境
- 声明式环境记录： 用来记录直接有标识符定义的元素，比如变量、let 、const 、class 和函数声明

函数声明后的变量都会被添加到全局环境变量记录中，如果使用let和const声明时，会同时检查声明式环境记录和对象式环境记录中是否有该变量，如果有则直接报错，没有则添加环境记录中。 
### 原型原型链
一个函数可以使用new关键字获得实例对象，那么我们称该函数为构造函数。同时实例对象都有一个__proto__属性指向构造函数的prototype属性，该属性也被称为原型对象，原型对象的constructor属性指向该构造函数。当我们获取实例对象上的属性时，会先从实例对象上进行获取，如果没有则通过__proto__向原型对象上进行查找，直到查找到null 。 其中由__proto__构建成的链式结构我们称之为原型链。

![output.png](https://cdn.nlark.com/yuque/0/2023/png/27018002/1692166505094-a8822086-eb83-4145-9418-e6f6e0c53c8d.png#averageHue=%23e3e2f2&clientId=udaaaab03-f951-4&from=ui&height=600&id=u85c8da8b&originHeight=1519&originWidth=1221&originalType=binary&ratio=1&rotation=0&showTitle=false&size=458717&status=done&style=none&taskId=ubbce9e32-a611-4fbc-936a-d268f9880b8&title=&width=482)

#### new关键字

1. 初始化一个对象
2. 将对象的__proto__属性指向构造函数的原型
3. 执行构造函数，并将this绑定到该对象上
4. 返回结果，如果结果是引用数据类型则直接返回，否则但会初始化的对象 

**为什么箭头函数不能使用new ** 

箭头函数没有自己的this绑定，箭头函数的this取决于外层作用域，无法像普通函数一样动态的确定this指向。 

同时箭头函数内部不存在`[[Construct]]` ，new关键字主要执行的是`[[Construct]]`方法来获得实例对象。

#### 继承
##### 原型式继承
**缺点：**原型中包含引用类型，会在所有实例之间共享即子类修改后也会引起父类的修改，以及无法像父类构造函数传参 
```javascript
Children.prototype = new Father()
```
##### 接用构造函数式继承
**缺点：**只能继承父类的属性和方法，不能继承父类原型上的属性和方法 
```javascript
function Father() {} 
function Child(){
  Father.call(this,...arguments)
}
```
##### 组合式继承
  **缺点：**调用两次父类构造函数，生成两份实例
```javascript
function Father() { }
function Children(){
    Father.call(this,...arguments)
}
Children.prototype = new Father()

Father.prototype.constructor = Children
```
##### 寄生组合式继承
```javascript
function Father() { }
function Children(){
    Father.call(this,...arguments)
}
const another = Objcet.create(Father.prototype)
another.constructor = Children 
```
##### extends关键字
**本质：** 原型链式继承 + 构造函数式继承  即 `组合式继承 `

### 执行上下文和作用域
> **作用域** 指程序中定义变量的区域，它决定了当前执行代码对变量的访问权限。

- **全局作用域：**全局作用域为程序的最外层作用域，并一直存在
- **函数作用域：**函数作用域只有函数被定义时才会创建，包含在父级作用域/全局作用域中
- **作用域链：**当可执行代码内部访问变量时，会先查找本地作用域，如果找到目标变量即返回，否则会去父级作用域查找，一直查找到全局作用域 。 我们把这种**作用域的嵌套机制**，称为**作用域链**

**词法作用域：** 作用域是由书写代码时函数声明的位置决定的  （意味着函数被定义时，他的作用域已经确定了，和拿到哪里没有关系，所以也称为静态作用域）  js使用的就是词法作用域 

**动态作用域：** 基于调用栈，不是代码中的作用域嵌套

### 闭包 
#### 什么是闭包：
闭包是指那些引用了另一个函数作用域变量的函数，通常是在嵌套函数中实现 

**使用场景：**

- **模块私有化属性**
- **单例模式**
- **函数柯里化**
- **节流防抖 **
#### **闭包存在的问题：**
**闭包可能会导致内存泄露** 

由于闭包的机制，外层函数调用完毕之后，会自动销毁，但是由于在闭包函数内访问了外部函数的变量并且根据垃圾回收机制，被另一个作用域引用的变量不会被回收，导致被访问的变量没有被回收。除非闭包函数解除调用才能销毁。 如果该函数使用的次数很少，不进行销毁的话就会变为闭包产生的内存泄漏。 

**解决方法： 将函数赋值 null**

#### **内存泄漏：**
该释放的内存垃圾没有被释放，依然霸占着原有的内存不松手，造成系统内存的浪费，导致性能恶化，系统崩溃等严重后果，这就是所谓的内存泄漏

### 事件流 
事件流是描述的从页面接受事件的顺序，当多个有事件绑定的元素层叠在一起时，会按照特定的顺序执行绑定在dom元素上的事件即事件流。事件流分为三个阶段：`事件捕获->目标阶段->冒泡阶段` 

**事件委托：** 

不给单个节点设置事件监听器，而是设置在其父节点上，利用事件冒泡和e.target来控制每个子节点上的事件。 

**优点：**

- 可以大量节省内存占用，减少事件注册
- 当新增子节点，无需再对其进行事件绑定，对于动态内容部分很合适 

**阻止事件默认行为：**`e.preventDefault（）` 

**阻止事件冒泡：** ` e.stopPropagation（）`

### this绑定
#### 默认绑定 
函数调用在无任何前缀时，this会默认绑定到window上，严格模式下，this指向undefined
#### 隐式绑定
函数在调用时，前面存在调用它的对象，则this会隐式绑定到该对象上 
```javascript
function fn() {
    console.log(this.name);
};
let obj = {
    name: '听风是风',
    func: fn
};
obj.func() //听风是风
```
##### 隐式绑定丢失 
当我们将函数当作参数或者变量赋值时，会出现隐式绑定丢失的问题
```javascript
var name = '行星飞行';
let obj = {
    name: '听风是风',
    fn: function () {
        console.log(this.name);
    }
};
let fn1 = obj.fn;
fn1(); //行星飞行

function fn(params){
  params()
}
fn(obj.fn)  // 行星飞行 
```
#### 显示绑定
通过 `call` `apply`  `bind` 等方法进行显示绑定this   

**区别： **

- `call`第二个参数为散列形式，`apply` 第二个参数为数组
- `call`、`apply`在改变this指向时会执行该函数，`bind`则会返回一个函数且是硬绑定，即无法通过`call`、`apply`二次更改 
#### new 绑定
当我们使用new关键字时，new关键字内部会改变this指向 。
### Object
#### 如何遍历一个对象

- `Object.keys ` 
- `Object.entries`
- `for in `
#### Object.defineProperty
> `Object.defineProperty()` 静态方法会直接在一个对象上定义一个新属性，或修改其现有属性，并返回此对象。

```javascript
const obj  = {
  data:[1,2,3]
}
Object.defineProperty(obj,'data',{
  	configurable：false , // 是否可以删除目标属性或是否可以再次修改属性的特性
    enumerable：true ,  //是否可以被枚举 
    value: '' ,  //值
    writable：true,  //是否可以被更改
    get(){
      return obj.data 
    },
    set(val){
      obj.data = data 
    }
})
```
##### 和Proxy的区别

1. 监听数据的角度
   1. `defineProperty` 只能监听某个属性而不能监听整个对象
   2. `proxy`可以直接监听整个对象
   3. `defineProperty` 监听需要知道对象的哪个属性，而proxy只需要知道哪个对象就可以
2. 对数组的监听
   1. `defineProperty` 无法监听数组长度的变化
   2. `proxy`则可以监听到对象的所有变换
3. 监听的范围
   1. `defineProperty` 只能监听到`value`和`get set`变化
   2. `proxy`可以监听除` [[getOwnPropertyNames]] `以外所有JS的对象操作
### Set、Map
#### 关于Set
set是一种集合的数据结构，其中的成员都是唯一的，没有重复的值，我们一般称为集合
##### set的属性和方法

- size属性
- add()
- has()
- delete()
- clear()

set提供了以下方法 keys()、values() 、entries()、forEach方法，且**遍历顺序也就是插入顺序**
##### 关于weakSet
WeackSet只能成员只能是引用类型，而不能是其他类型的值，并且没有size属性和遍历API 

WeakSet里面的引用只要在外部消失，它在 WeakSet里面的引用就会自动消失

#### 二、Map以及WeakMap
##### 关于Map
map是一种叫做字典的数据结构，其中的数据是以 【 键：值】的形式进行存储，他的键可以为**任意数据类型**
##### Map的属性和方法

- size属性
- set()
- get()
- has()
- delete()
- clear()

map内部实现了迭代器，即可以通过for ... of进行遍历 ，并且提供了以下方法 keys()、values() 、entries()、forEach方法，且**遍历顺序也就是插入顺序**
##### 关于WeakMap
weakMap的成员只能是引用数据类型，不能是其他数据类型，并且weakMap是弱引用，即weakMap的引用只要在外部消失，在内部的引用也会自动消失，利于垃圾回收
#### map和Object的区别

1. 在object中key值必须为简单数据类型，而map则可以为任何类型
2. Map元素的顺序按照插入的顺序，而Object没有此特性
3. Map可以直接获取到大小，而object则需要Object.keys进行计算
4. Map可以使用for...of进行遍历，object不行
5. 在存储大量数据的时候map的性能更好
### 事件循环 
#### 定义：
首先，JavaScript在浏览器中运行时单线程的，当我们做一些比较复杂的操作时，就会堵塞后续任务的执行，为了协调事件 、交互、渲染等浏览器引入了事件循环。  

即当我们执行同步任务时，会将同步任务压入js的调用栈中，当遇到异步任务时则会将异步任务放入到一个队列中，当js调用栈为空时，事件循环会将任务队列中的一个任务放入调用栈中执行，这样的循环机制叫做事件循环

#### 异步任务
异步任务分为 **宏任务** 和** 微任务** 。 在执行宏任务前需要将微任务队列进行清空  

**宏任务：**`setTimeout` 、`setInterval` 、`setImmediate`、` I/O`、`UI rendering`、`requestAnimationFrame ` 

**微任务：**`promise.then` 、`mutationobserver` 、`queueMicrotask` `pross.nextTick`

#### 为什么将任务分为宏任务和微任务

1. 由于队列的机制，新入队的任务永远会被放在队尾
2. 微任务实际上就是在插队，这样微任务做的所有状态的修改，在下次事件循环中也能得到同步
####  Node中的事件循环机制
Node的一次Tick分为以下阶段： 

![](https://cdn.nlark.com/yuque/0/2023/png/27018002/1692179378638-eed7b289-c1ae-4807-837c-3a6c8ca56baa.png#averageHue=%23323232&clientId=udaaaab03-f951-4&from=paste&id=u774cde21&originHeight=693&originWidth=1197&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u96e7a874-61ba-48e7-9bfb-3d365f4d473&title=)

- **定时器(timer)**: 在这个阶段执行 setTimeout、setInterval的回调函数
- **待定回调(pending callbacks)**：某些系统操作（如 TCP 错误类型）执行回调
- **idle,prepare闲置阶段** 仅在内部使用
- **轮询：poll** 检索新的 I/O 事件；执行 I/O 相关的回调（几乎所有相关的回调，关闭回调）
- **检测：check** setImmediate() 会在此阶段调用
- **关闭的回调函数** 关闭回调，例如： socket.on('close', ...)

**宏任务：**`setTimeout`、`setInterval`、`IO事件` 、` setImmediate `、 `close 事件` 

**微任务：**`Promise.then` 、`process.nextTick`、`queueMicrotask`

##### **node中的任务队列：（有顺序)**

- 微任务队列
   - next tick queue : process.nextTick 
   - other queue ：Promise.then() 、 queueMicrotask 
- 宏任务队列
   - timer queue ：setTimeout 、 setTnterval 
   - poll queue :IO事件
   - check queue : setImmediate
   - close queue ；close事件

### AJAX和Fetch
#### ajax
```javascript
function myajax (method, url, data) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 400) {
                    resolve(xhr.response)
                } else {
                    reject(xhr.status)
                }
            } else {
                retrun
            }

        }
        xhr.open(method, url)
        xhr.setRequestHeader('Content-Type', 'application/json') //设置请求头
        xhr.send(data)
    })
}
```
readyState的状态从0到4变化

- 0：请求未初始化，xmlhttprequest对象还没有完成初始化
- 1：服务器连接已建立，xmlhttprequest对象开始发送请求
- 2：请求已接收，xmlhttprequest对象的请求发送完成
- 3：请求处理中，xmlhttprequest对象开始读取服务器的响应
- 4：请求已完成且响应就绪，xmlhttprequest对象读取服务器响应结束
#### fetch
```javascript
fetch("http://example.com/movies.json", {
	method:'GET',
  cache:"no-cache",
  headers:{
    'Content-Type':'application/json'
  }
})
  .then((response) => response.json())
  .then((data) => console.log(data));

```
`fetch`会返回一个`promise`，且该`promise`不会被标记为`rejected`，即时相应为404或者500。只有在网络故障或者请求被阻止时才会被标记为`rejected` 。 `fetch` 不会发送跨域`cookie` 。
### Promise
promiase主要解决多个异步操作导致多个回调函数嵌套所产生的回调地狱，主要作用是使回调变的可控且标准，将异步操作以同步操作的流程表达出来

1.  三种状态： 
   1. pending：进行中
   2. fulfilled：已成功
   3. rejected：已失败
2.  缺点： 
   1. 无法取消promise，一旦新建立即执行，无法中途取消
   2. 如果不设置回调函数，promise内部抛出的错误，不会反映到外部
   3. 当处于pending状态时，无法知道当前进展到哪一阶段。是刚刚开始还是即将完成

**Promise.all([]) :**

- 所有的Promise实例都进入Fulfilled状态，promise.all实例才会变成Fulfilled，并将所有实例的返回值组成一个数组传给回调函数中
- 当promise实例有一个进入Rejected状态，promise.all实例会变成rejected状态，并将第一个变成rejected的实例的返回值传给回调函数

**Promise.allSettled()**

- 当所有的promise实例都进入成功或者失败状态时，将所有实例的返回值组成一个数组进行返回

**Promise.race([])**

- 方法返回一个 promise，一旦迭代器中的某个 promise 解决或拒绝，返回的 promise 就会解决或拒绝。

**Promise.any([])**

- 一旦其中有一个promise实例fulfilled，那么将会将所有的实例都更改成fulfilled状态，并返回首先兑现的实例的返回值
- 只有所有promise实例rejected时，该方法返回的promisecai会是rejected状态

**Promise.finally(callback)**

- 在 promise 结束时，无论结果是 fulfilled 或者是 rejected，都会执行指定的回调函数
