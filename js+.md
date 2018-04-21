<link rel="stylesheet" href="highlight/styles/atom-one-light.css">
<script src="highlight/highlight.min.js"></script>
<script>hljs.initHighlightingOnLoad();</script>

## js 进阶

### reduce()
`ESMAScript 5`

`reduce()`方法接收一个函数callbackfn作为累加器（accumulator），数组中的每个值（从左到右）开始合并，最终为一个值。

``` javaScript
array.reduce(callbackfn,[initialValue])

```

`reduce()`方法接收callbackfn函数，而这个函数包含四个参数：

``` javaScript
function callbackfn(preValue,curValue,index,array){}
```
* `preValue`: 上一次调用回调返回的值，或者是提供的初始值（initialValue）
* `curValue`: 数组中当前被处理的数组项
* `index`: 当前数组项在数组中的索引值
* `array`: 调用 reduce()方法的数组

而`initialValue`作为第一次调用 `callbackfn`函数的第一个参数.

`reduce()`方法为数组中的每一个元素依次执行回调函数`callbackfn`，不包括数组中被删除或从未被赋值的元素，接受四个参数：初始值（或者上一次回调函数的返回值），当前元素值，当前索引，调用 `reduce()` 的数组。

回调函数第一次执行时，`preValue` 和 `curValue` 可以是一个值，如果 `initialValue` 在调用 `reduce()` 时被提供，那么第一个 `preValue` 等于 `initialValue` ，并且`curValue` 等于数组中的第一个值；如果`initialValue` 未被提供，那么`preValue` 等于数组中的第一个值，`curValue`等于数组中的第二个值。

来看一个示例:

``` javaScript
var arr = [0,1,2,3,4]; arr.reduce(function (preValue,curValue,index,array) {
 return preValue + curValue; 
}); // 10
```