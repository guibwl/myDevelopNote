<link rel="stylesheet" href="highlight/styles/atom-one-light.css">
<script src="highlight/highlight.min.js"></script>
<script>hljs.initHighlightingOnLoad();</script>

## immutable 如何搭配 redux

这里不深入讲解 immutable 的原理，因为我也没有很深入理解，想要了解可以查看孟文老大推荐的 [React+Redux+ImmutableJS进行SPA开发](http://yunlaiwu.github.io/blog/2016/12/01/react+redux+immutablejs/#13) 这篇文章，此刻我们只讲如何在我们项目中接入；[参考 DOME](https://github.com/shangboyang/chronic-disease-apply)


### 引入依赖包

immutable 像 redux 一样，使用前需要 `$ npm install xxx` 引入，目前我们的项目中，必引入的有 2 个：

* redux-immutable
* immutable

### 配置到项目里

在项目根 reducer 和 store 中进行配置，这两个文件都存放在我们项目 `app/config/..` 中，相应修改如下；

1、 首先，在 store 中进行配置：

>	~~~
>	 import Immutable from 'immutable' //引入 
>	~~~
>
>如果使用 redux 提供的 logger ，则需要如下处理:
>
>	~~~
>	const logger = createLogger({ 
>      stateTransformer: (state) => {
>			return state.toJS()
>		}
>	}) 
>	~~~
>
>将 logger 放进 thunkMiddleware 中:
>
>  ~~~
>	const createStoreWithMiddleware = applyMiddleware(
>  		thunkMiddleware,
>    	logger
>	)(createStore)
>  ~~~
> 
> 用 immutable 数据格式替换 store , 并接入 REDUX_DEVTOOLS (可选)：
> 
>  ~~~
>  export default function configureStore(initialState) {
>   const state = Immutable.Map() //使用 Immutable 数据格式
>   const store = createStoreWithMiddleware(
>     rootReducer,
>     state,
>     window.__REDUX_DEVTOOLS_EXTENSION__ && > window.__REDUX_DEVTOOLS_EXTENSION__()
>  )
> ...
>  ~~~
>

2、 在根 redux 中进行配置：

>	将 combineReducers 更改为从 'redux-immutable' 引入即可: 
>
>  ~~~
>	 import combineReducers from 'redux-immutable'
>  ~~~
>

### 页面接入使用

使用 immutable 后的变化，主要就是改变我们 store 中的数据格式，所以我们要做的无非是，在 reducer 存数据时将其转为 immutable 数据格式，然后在外部使用时将其转为js格式，比如在 <mark> 请求数据接口时、connect 将数据注入到组件时；</mark>
下面看具体列子：

1、 在页面对应的 reducer.js 中 :

> 首先引入 immutable
> 
> ~~~
> import Immutable from 'immutable'
> ~~~
> 
> 将 initialState 数据格式替换成 immutable 数据格式 :
> 
> ~~~
>  const initialState = Immutable.fromJS({
>    key: velue
>  })
> ~~~
> 
> 在 reducer 中使用 ` state.merge` 将数据合并到 state :
> 
> ~~~
> 	export const AppReducer = (state = initialState, action) => {
>   switch (action.type) {
>     case APP_ACTION_TYPE: 
>       return state.merge({ key:velue })
>     default:
>       return state
>   }
>  };
> ~~~
> 

2、 在 connect 中将 immutable 数据格式转为 js 可读格式 :

>在 connect 中，只需在 mapStateToProps 获取 state 时做处理即可：
>
> ~~~
> function mapStateToProps(state) {
>	const { AppReducer } = state.toObject(); // 将 state 浅转换数据格式
>
>	return {
>		'key': AppReducer.get('key') //获取 AppReducer 的属性
>	};
> }
> ~~~
>

### 常用API

*  `Map`类型：对应 Object ,可以通过打印转为 immutable 数据格式的对象查看
*  `get('keyName')` 方法，获取 Map 对象的具体属性
*  `toObject()`方法，将 immutable 对象的所有子级转为 js 数据格式
*  `List`类型：对应 Array ,可以通过打印转为 immutable 数据格式的数组查看
*  `get(number)` 方法，获取 List 数组的对应值
*  [更多 API](https://facebook.github.io/immutable-js/docs/#/)