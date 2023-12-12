## interface 和 type 区别 
- type为类型别名，可以适用于任意类型，interface为接口只能定义对象结构的类型 
- interface可以使用extends进行类型继承，但是type只能使用 & 实现交叉类型 
- interface存在声明合并，即一个为文件中多个同名interface，它们的属性会进行合并
## unknow、any、void、never的区别

- any用于描述任意类型的变量
- unknow标识位置类型，但使用前必须使用类型断言
- void表示无任何类型，没有类型，例如没有返回值的函数
- never表示用不存在的值，例如函数抛出异常或者死循环函数的返回值
## const和readonly的区别

- const用于变量，readonly用于属性 
- const在运行时检查，readonly在编译时进行检查
- const声明的变量不得改变值且必须初始化，不能留到最后赋值。readonly只能保证自身不能修改属性但如果将属性交出去则不能保证
## 枚举和常量枚举的区别
```
enum Color{
    red,
    green,
    blue
}
//常量枚举 

const enum Color{
    red,
    green,
    blue
}
```

- 枚举会被编译成一个对象，被当作对象使用 
- const 枚举会在编译期间被删除 ，只有在枚举成员被使用的地方会被内联起来，避免额外的性能开销 
## 类型断言
类型断言告诉编辑器，我们确切的知道变量的类型，不需要进行类型检查

- as 语法 temp as string
- 尖括号语法 <string>temp 

**双重断言 **
S as T  只有S是T的子集或者是T是S的子集，断言才能成功 
**类型断言的优缺点 **
类型断言屏蔽了对代码的检查，告诉编译器类型可信，如果发生错误则导致ts不会进行报错
## 类型体操
### Partial实现原理解析 
`Partial<T> `用于将 类型T中的属性变成可选的
```
export type Partial<T> = {    [P in keyof T] ?: T[P] }
```
### Readonly实现原理 
`Readonly<T>`用于将类型T中的属性变为只读的
```jsx
export type Readonly<T> = {
    readonly [P in keyof T] : T[P]
}
```
### Pick实现原理 
Pic`k<T,K extends keyof T> `从类型T中挑选出K组属性组成一个新类型
```jsx
export Pick<T,K extends keyof T> = {
   [P in K] : T[P]
}
```
### Record实现原理
`Record <T,K> `用于将类型T中的属性的类型都变为K
```jsx
export Record<T extends keyof any,K>  = {
   [P in T] : K
}
```
### Exclude原理解析
`Exclude<T,K>`表示提取存在于T但不存在于K的类型组成的联合类型
```jsx
export Exclude<T,K> = T extends K ? never: T
```
### Extract原理解析
`Extract<T,K>`返回类型T和类型K的交集
```jsx
export Extract<T,K> = T extends K ? T :never 
```
### Omit原理
`Omit<T,K> `从类型T中剔除掉K中的属性
```jsx
export Omit<T,K> = Pick<T,Exclude<keyof T,k>>
```
