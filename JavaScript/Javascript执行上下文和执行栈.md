# 理解 Javascript 执行上下文和执行栈

> 本文暂不对 this 及 ES9 执行上下文进行讲解。

## 什么是执行上下文

简而言之，执行上下文就是当前 JavaScript 代码被解析和执行时所在环境的抽象概念， JavaScript 中运行任何的代码都是在执行上下文中运行。

## 执行上下文的版本

执行上下文在 ES3 中，包含三个部分。

- scope：作用域，也常常被叫做作用域链。
- variable object：变量对象，用于存储变量的对象。
- this value：this 值。

在 ES5 中，我们改进了命名方式，把执行上下文最初的三个部分改为下面这个样子。

- lexical environment：词法环境，当获取变量时使用。
- variable environment：变量环境，当声明变量时使用。
- this value：this 值。

在 ES2018 中，执行上下文又变成了这个样子，this 值被归入 lexical environment，但是增加了不少内容。

- lexical environment：词法环境，当获取变量或者 this 值时使用。
- variable environment：变量环境，当声明变量时使用。
- code evaluation state：用于恢复代码执行位置。
- Function：执行的任务是函数时使用，表示正在被执行的函数。
- ScriptOrModule：执行的任务是脚本或者模块时使用，表示正在被执行的代码。
- Realm：使用的基础库和内置对象实例。
- Generator：仅生成器上下文有这个属性，表示当前生成器。


## 执行上下文的类型

执行上下文总共有三种类型：

* 全局执行上下文： 这是默认的、最基础的执行上下文。不在任何函数中的代码都位于全局执行上下文中。它做了两件事：1. 创建一个全局对象，在浏览器中这个全局对象就是 window 对象。2. 将 this 指针指向这个全局对象。一个程序中只能存在一个全局执行上下文。

* 函数执行上下文： 每次调用函数时，都会为该函数创建一个新的执行上下文。每个函数都拥有自己的执行上下文，但是只有在函数被调用的时候才会被创建。一个程序中可以存在任意数量的函数执行上下文。每当一个新的执行上下文被创建，它都会按照特定的顺序执行一系列步骤，具体过程将在本文后面讨论。

* Eval 函数执行上下文： 运行在 eval 函数中的代码也获得了自己的执行上下文，但由于 Javascript 开发人员不常用 eval 函数，所以在这里不再讨论。


## 执行栈

执行栈，在其他编程语言中也被叫做调用栈，具有 LIFO（后进先出）结构，用于存储在代码执行期间创建的所有执行上下文。

在Chrome的devtool中，可以通过 source -> call stack 查看调用栈。


## ES3 中的执行上下文

#### 变量对象（variable object 简称 VO）

每个执行环境文都有一个表示变量的对象——变量对象，全局执行环境的变量对象始终存在，而函数这样局部环境的变量，只会在函数执行的过程中存在，在函数被调用时且在具体的函数代码运行之前，JS 引擎会用当前函数的参数列表（arguments）初始化一个 “变量对象” 并将当前执行上下文与之关联 ，函数代码块中声明的 变量 和 函数 将作为属性添加到这个变量对象上。

以下面这段代码为例：

```js
function foo(i){
    var a = 'hello'
    var b = function(){}
    function c(){}
}
foo(22)
```

当我们调用foo(22)时，整个创建阶段伪代码如下：

```js
ECObj = {
    scopChain： {...},
    variableObject: {
        arguments: {
            0: 22,
            length: 1
        },
        i: 22,
        c: pointer to function c(){},
        a: undefined,
        b: undefined
    },
    this: { ... }
}
```
上面示例，`variableObject` 属性就表示变量对象，里面属性的顺序与整个创建顺序一一对应。
> 函数的形参 -> 函数声明 -> 变量声明
> 存在相同的属性时，后创建函数声明类型的属性会遮蔽先创建的任何类型属性。

* **函数的形参**（当进入函数执行上下文时）：变量对象的一个属性，其属性名就是形参的名字，其值就是实参的值；对于没有传递的参数，其值为undefined

* **函数声明**（FunctionDeclaration, FD）：变量对象的一个属性，其属性名和值都是函数对象创建出来的；如果变量对象已经包含了相同名字的属性，则替换它的值

* **变量声明**（var，VariableDeclaration）：变量对象的一个属性，其属性名即为变量名，其值为undefined;如果变量名和已经声明的函数名或者函数的参数名相同，则不会影响已经存在的属性。

当函数内代码执行后，VO状态会进行变更，变更后我们称之为活动对象（activation object 简称 AO），上面的VO示例在转变为AO后的伪代码如下：

```js
ECObj = {
    scopeChain: { ... },
    variableObject: {
        arguments: {
            0: 22,
            length: 1
        },
        i: 22,
        c: pointer to function c(),
        a: 'hello',
        b: pointer to function privateB()
    },
    this: { ... }
}
```

到这里就可以解释一些变量提升的问题了，我们来看一些具体示例：

```js
function foo1(a){
    console.log(a) // function a(){}
    function a(){}
    var a
    console.log(a) // function a(){}
    var a = 10
    console.log(a) // 10
}
foo1(20)
```
这个例子中，第一个`console.log(a)`是函数内第一句代码，所以这里我们获取到的值是 VO，行参第一个初始化，函数声明紧接着创建了（这也就是变量提升的原理），所以我们这里获取到的 a 是 `function a(){}`;
第二个 `console.log(a)` 前面有个 `var a`，但是由于没有赋值所以被引擎忽略，第三个有赋值，则打印为 10；

```js
function foo2(a){
    var a
    console.log(a) // 20
    a = 10
    console.log(a) // 10
}
foo2(20)
```
这个例子第一个打印前有 `var a`，但是由于没有赋值，所以取VO中初始化的参数值。第二个赋值后，则打印为 10；

#### 作用域链（scope chain）

**作用域** 规定了如何查找变量，也就是确定当前执行代码对变量的访问权限。当查找变量的时候，会先从当前上下文的变量对象中查找，如果没有找到，就会从父级（词法层面上的父级）执行上下文的变量对象中查找，一直找到全局上下文的变量对象，也就是全局对象。这样由多个执行上下文的变量对象构成的链表就叫做 **作用域链**。

函数的作用域在函数创建时就已经确定了。当函数创建时，会有一个名为 `[[scope]]` 的内部属性保存所有父变量对象到其中。当函数执行时，会创建一个执行环境，然后通过复制函数的 `[[scope]]`  属性中的对象构建起执行环境的作用域链，然后，变量对象 VO 被激活生成 AO 并添加到作用域链的前端，完整作用域链创建完成：

```js
Scope = [AO].concat([[Scope]]);
```

## ES5 中的执行上下文

#### 执行上下文是如何被创建的

执行上下文分两个阶段创建：1）创建阶段； 2）执行阶段

#### 创建阶段

在任意的 JavaScript 代码被执行前，执行上下文处于创建阶段。在创建阶段中总共发生了三件事情：

- 确定 this 的值，也被称为 This Binding。
- LexicalEnvironment（词法环境） 组件被创建。
- VariableEnvironment（变量环境） 组件被创建。

伪代码：

```js
ExecutionContext = {  
  ThisBinding = <this value>,  
  LexicalEnvironment = { ... },  
  VariableEnvironment = { ... },  
}
```
##### 1. This Binding:

在全局执行上下文中，this 的值指向全局对象，在浏览器中，this 的值指向 window 对象。

在函数执行上下文中，this 的值取决于函数的调用方式。如果它被一个对象引用调用，那么 this 的值被设置为该对象，否则 this 的值被设置为全局对象或 undefined（严格模式下）。

##### 2. 词法环境（Lexical Environment）:

[官方 ES6](http://ecma-international.org/ecma-262/6.0/) 文档将词法环境定义为：

>词法环境是一种规范类型，基于 ECMAScript 代码的词法嵌套结构来定义标识符与特定变量和函数的关联关系。词法环境由环境记录（environment record）和可能为空引用（null）的外部词法环境组成。


词法环境有两种类型：
- **全局环境**（在全局执行上下文中）是一个没有外部环境的词法环境。全局环境的外部环境引用为 null。它拥有一个全局对象（window 对象）及其关联的方法和属性（例如数组方法）以及任何用户自定义的全局变量，this 的值指向这个全局对象。
- **函数环境**，用户在函数中定义的变量被存储在环境记录中。对外部环境的引用可以是全局环境，也可以是包含内部函数的外部函数环境。

注意： 对于函数环境而言，环境记录 还包含了一个 arguments 对象，该对象包含了索引和传递给函数的参数之间的映射以及传递给函数的参数的长度（数量）。
例如，下面函数的 arguments 对象如下所示：
```js
function foo(a, b) {  
  var c = a + b;  
}  
foo(2, 3);

// arguments 对象  
Arguments: {0: 2, 1: 3, length: 2},
```

在全局或函数类型的词法环境中，有两个组成部分：
- （1）环境记录(environment record): 是存储变量和函数声明的实际位置。
- （2）对外部环境的引用(outer): 意味着它可以访问其外部词法环境。

环境记录 同样有两种类型（如下所示）：
- （1）声明性环境记录 存储变量、函数和参数。一个函数环境包含声明性环境记录。
- （2）对象环境记录 用于定义在全局执行上下文中出现的变量和函数的关联。全局环境包含对象环境记录。

抽象地说，词法环境在伪代码中看起来像这样：

```js
GlobalExectionContext = {
  LexicalEnvironment: {
    EnvironmentRecord: {
      Type: "Object",  
      // 标识符绑定在这里 
    },
    outer: <null>
  }  
}

FunctionExectionContext = {  
  LexicalEnvironment: {  
    EnvironmentRecord: {  
      Type: "Declarative",  
      // 标识符绑定在这里 
    },
    outer: <Global or outer function environment reference>  
  }  
}
```

##### 变量环境:

它也是一个词法环境，其 EnvironmentRecord 包含了由 VariableStatements 在此执行上下文创建的绑定。

如上所述，变量环境也是一个词法环境，因此它具有上面定义的词法环境的所有属性。

LexicalEnvironment 组件和 VariableEnvironment 组件的区别在于前者用于存储函数声明和变量（ let 和 const ）绑定，而后者仅用于存储变量（ var ）绑定。

让我们结合一些代码示例来理解上述概念：

```js
let a = 20;  
const b = 30;  
var c;

function multiply(e, f) {  
 var g = 20;  
 return e * f * g;  
}

c = multiply(20, 30);
```

执行上下文伪代码如下所示：

```js
GlobalExectionContext = {

  ThisBinding: <Global Object>,

  LexicalEnvironment: {
    EnvironmentRecord: {
      Type: "Object",  
      // 标识符绑定在这里  
      a: < uninitialized >,  
      b: < uninitialized >,  
      multiply: < func >  
    }  
    outer: <null>  
  },

  VariableEnvironment: {  
    EnvironmentRecord: {  
      Type: "Object",  
      // 标识符绑定在这里  
      c: undefined,  
    }  
    outer: <null>  
  }  
}

FunctionExectionContext = {  
   
  ThisBinding: <Global Object>,

  LexicalEnvironment: {
    EnvironmentRecord: {
      Type: "Declarative",
      // 标识符绑定在这里  
      Arguments: {0: 20, 1: 30, length: 2},
    },  
    outer: <GlobalLexicalEnvironment>
  },

  VariableEnvironment: {  
    EnvironmentRecord: {  
      Type: "Declarative",  
      // 标识符绑定在这里  
      g: undefined  
    },  
    outer: <GlobalLexicalEnvironment>  
  }  
}
```
注意： 只有在遇到函数 multiply 的调用时才会创建函数执行上下文。

你可能已经注意到了 let 和 const 定义的变量没有任何与之关联的值，但 var 定义的变量设置为 undefined。

这是因为在创建阶段，代码会被扫描并解析变量和函数声明，其中函数声明存储在环境中，而变量会被设置为 undefined（在 var 的情况下）或保持未初始化（在 let 和 const 的情况下）。

这就是为什么你可以在声明之前访问 var 定义的变量（尽管是 undefined ），但如果在声明之前访问 let 和 const 定义的变量就会提示引用错误的原因。

这就是我们所谓的变量提升。


#### 执行阶段
在此阶段，完成对所有变量的分配，最后执行代码。

注： 在执行阶段，如果 Javascript 引擎在源代码中声明的实际位置找不到 let 变量的值，那么将为其分配 undefined 值。


## 总结

执行上下文总共有三种类型：
- 全局执行上下文
- 函数执行上下文
- Eval 函数执行上下文

ES3 中，执行上下文主要分为：
- scope：作用域，也常常被叫做作用域链。
- variable object：变量对象，用于存储变量的对象，执行代码后转为AO，这里也是导致变量提升的关键。
- this value：this 值。

ES5 开始，每种类型在其创建阶段，均发生了三件事情：
- 确定 this 的值，也被称为 This Binding。
- LexicalEnvironment（词法环境） 组件被创建(对应const、let、函数声明的标识符)。
- VariableEnvironment（变量环境） 组件被创建(对应var声明的标识符)。
> 注意：变量环境本质上也是词法环境，因此它具有上面定义的词法环境的所有属性。

LexicalEnvironment（词法环境）又分为两种类型：
- 全局环境类型；
- 函数环境类型；

LexicalEnvironment（词法环境）每种类型，都由两个部分组成：
- （1）环境记录(environment record): 是存储变量和函数声明的实际位置，它也有两种类型：
    - 声明性环境记录
    - 对象环境记录
- （2）对外部环境的引用(outer): 意味着它可以访问其外部词法环境。


**执行栈：**
执行栈，在其他编程语言中也被叫做调用栈，具有 LIFO（后进先出）结构，用于存储在代码执行期间创建的所有执行上下文。


