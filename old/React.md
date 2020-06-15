<link rel="stylesheet" href="highlight/styles/atom-one-light.css">
<script src="highlight/highlight.min.js"></script>
<script>hljs.initHighlightingOnLoad();</script>




#react

##API

* **ReactDOM.render();**
* 作用：用于将模板转为 HTML 语言，并插入指定的 DOM 节点。

~~~
	ReactDOM.render(
	  <h1>Hello, world!</h1>,
	  document.getElementById('example')
	);
~~~


* **React.createClass** 
* 作用：React 允许将代码封装成组件（component），然后像插入普通 HTML 标签一样，在网页中插入这个组件。
* 组件类都必须有自己的 render 方法，用于输出组件。
* 组件的属性可以在组件类的 this.props 对象上获取，比如 name 属性就可以通过 this.props.name 读取

~~~
	var HelloMessage = React.createClass({
	  render: function() {
	    return <h1>Hello {this.props.name}</h1>;
	  }
	});
	
	ReactDOM.render(
	  <HelloMessage name="John" />,
	  document.getElementById('example')
	);
~~~

* **this.props.children** 
* 作用：this.props 对象的属性与组件的属性一一对应，但是有一个例外，就是 this.props.children 属性。它表示组件的所有子节，即下方代码中的 span 标签
* React.Children 来处理 this.props.children 。我们可以用 <mark>React.Children.map 来遍历</mark>子节点，而不用担心 this.props.children 的数据类型是 undefined 还是 object

~~~
	var NotesList = React.createClass({
	  render: function() {
	    return (
	      <ol>
	      {
	        React.Children.map(this.props.children, function (child) {
	          return <li>{child}</li>;
	        })
	      }
	      </ol>
	    );
	  }
	});
	
	ReactDOM.render(
	  <NotesList>
	    <span>hello</span>
	    <span>world</span>
	  </NotesList>,
	  document.body
	);
~~~

* **PropTypes** 
* 作用：组件类的PropTypes属性，就是用来验证组件实例的属性是否符合要求
* 下面的Mytitle组件有一个title属性。PropTypes 告诉 React，这个 title 属性是必须的，而且它的值必须是字符串。现在，我们设置 title 属性的值是一个数值。

~~~
	var MyTitle = React.createClass({
	  propTypes: {
	    title: React.PropTypes.string.isRequired,
	  },
	
	  render: function() {
	     return <h1> {this.props.title} </h1>;
	   }
	});
~~~

* **getDefaultProps** 
* 作用：方法可以用来设置组件属性的默认值

~~~
	var MyTitle = React.createClass({
	  getDefaultProps : function () {
	    return {
	      title : 'Hello World'
	    };
	  },
	
	  render: function() {
	     return <h1> {this.props.title} </h1>;
	   }
	});
~~~

* **ref** 
* 作用：从组件获取真实 DOM 的节点
* 下面代码中，文本输入框必须有一个 ref 属性，虚拟 DOM 是拿不到用户输入的。
* 由于 this.refs.[refName] 属性获取的是真实 DOM ，所以必须等到虚拟 DOM 插入文档以后，才能使用这个属性。
* 通过为组件指定 Click 事件的回调函数，确保了只有等到真实 DOM 发生 Click 事件之后，才会读取 this.refs.[refName] 属性。

~~~
	var MyComponent = React.createClass({
	  handleClick: function() {
	    this.refs.myTextInput.focus();
	  },
	  render: function() {
	    return (
	      <div>
	        <input type="text" ref="myTextInput" />
	        <input type="button" value="Focus the text input" onClick={this.handleClick} />
	      </div>
	    );
	  }
	});
	
	ReactDOM.render(
	  <MyComponent />,
	  document.getElementById('example')
	);
~~~

~~~
var CommentForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.refs.author.getDOMNode().value.trim();
    var text = this.refs.text.getDOMNode().value.trim();
    if (!text || !author) {
      return;
    }
    // TODO: send request to the server
    this.refs.author.getDOMNode().value = ‘‘;
    this.refs.text.getDOMNode().value = ‘‘;
    return;
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something..." ref="text" />
        <input type="submit" value="Post" />
      </form>
    );
  }
});
~~~

* **this.state** 
* 作用：组件的状态，通过改变状态从而触发重新渲染 UI;
* <mark>getInitialState</mark>通过此方法，设置组件初始化状态;
* <mark>this.setState()</mark>通过此方法，设置组件状态;

~~~
	var LikeButton = React.createClass({
	  getInitialState: function() {
	    return {liked: false};
	  },
	  handleClick: function(event) {
	    this.setState({liked: !this.state.liked});
	  },
	  render: function() {
	    var text = this.state.liked ? 'like' : 'haven\'t liked';
	    return (
	      <p onClick={this.handleClick}>
	        You {text} this. Click to toggle.
	      </p>
	    );
	  }
	});
	
	ReactDOM.render(
	  <LikeButton />,
	  document.getElementById('example')
	);
~~~

##组件的生命周期

* 生命周期的3个状态：

> Mounting：已插入真实 DOM
 
> Updating：正在被重新渲染

> Unmounting：已移出真实 DOM

* 处理函数 (will 函数在进入状态之前调用，did 函数在进入状态之后调用):

> componentWillMount()

> componentDidMount()

> componentWillUpdate(object nextProps, object nextState)
 
> componentDidUpdate(object prevProps, object prevState)
 
> componentWillUnmount()

> componentWillReceiveProps(object nextProps)：已加载组件收到新的参数时调用

> shouldComponentUpdate(object nextProps, object nextState)：组件判断是否重新渲染时调用

## 使用literalify库

literalify是一个依赖browserify变换的库，能够将require的写法替换成其他任意写法。比如，你使用CommonJS模板写的代码，可以给转换成调用的模式

* 用法
 
~~~
var browserify = require('browserify'),
    literalify = require('literalify'),
    b = browserify();

b.transform(literalify.configure({
    'some-dependency': 'window.$'
}));
b.add('./app.js');
b.bundle().pipe(require('fs').createWriteStream('bundle.js'));
~~~

会发现，在上面的html文件中引入了一个bundle.js文件，但是我们下载的demo中其实是没有这个bundle.js文件的，这里可以将usage中的代码保存到一个js中，运行这个js即可。也可以直接在node环境中执行上述代码。

### React.createElement

* React.createElement('tagName', {key:value}, 'HtmlShow');

###  React.createFactory

* var factory = React.createFactory("tagName");
* var child1 = factory(null,'First Text Content');
* var child2 = factory({key:value},'Second Text Content');

### React.createElement & React.createFactory 几个例子

~~~
var child1 = React.createElement('li', null, 'First Text Content');
var child2 = React.createElement('li', null, 'Second Text Content');
var root = React.createElement('ul', { className: 'my-list' }, child1, child2);
ReactDOM.render(root, document.getElementById(content));
~~~

~~~
var factory = React.createFactory("li");
var child1 = factory(null,'First Text Content');
var child2 = factory(null,'Second Text Content');
var root  = React.createElement('ul',{className:'my-list'},child1,child2);
ReactDOM.render(
        root,
        document.getElementById('content')
);
~~~

~~~
var factory = React.createFactory("li");
var child1 = factory(null,'First Text Content');
var child2 = factory(null,'Second Text Content');
var ulfactory = React.createFactory('ul');
var root  = ulfactory({className:'my-list'},child1,child2);
ReactDOM.render(
        root,
        document.getElementById('content')
);
~~~

~~~
var factory = React.createFactory("li");
var child1 = factory(null,'First Text Content');
var child2 = factory(null,'Second Text Content');
var root = React.DOM.ul({className:'my-list'},child1,child2);
ReactDOM.render(
        root,
        document.getElementById('content')
);
~~~

~~~
var root = React.DOM.ul(
        {className:'my-list'},
        React.DOM.li(null,'First Text Content2'),
        React.DOM.li(null,'Second Text Content2')
);
ReactDOM.render(
        root,
        document.getElementById('content')
);
~~~

~~~
var cli = React.createClass({
    render: function(){
        return (
            <li>
                {this.props.text}
            </li>
        );
    }
});
var factory = React.createFactory(cli);
var child1 = factory({text:'First Text Content'});
var child2 = factory({text:'Second Text Content'});
var root = React.DOM.ul({className:'my-list'},child1,child2);
ReactDOM.render(
        root,
        document.getElementById('content')
);
~~~

# 引入蚂蚁金服组件

## 搭配 redux 注意事项


就目前使用部分蚂蚁组件得知，组件并非在引入的地方，触发render进行渲染，而是跳过路由在顶层入口渲染；

* 如果你使用redux，并且组件通过 connect 方法，连接 store ，那么在使用蚂蚁渲染组件时候，控制台会报错，告诉你找不到 store ,<mark>因为它在顶层渲染，跳过了我们注入 store 的地方，所以需要我们单独注入一次 store；</mark>
* 以组件 [Popup](https://mobile.ant.design/components/popup-cn/#components-popup-demo-basic) 为例 ：

下面代码会报  <q> <u> Could not find "store" in either the context or props of "Connect(ComponentWithConnect)" </u> </q>  错误:

~~~
Popup.show(< ComponentWithConnect />, { maskClosable: false });
~~~

下面单独注入store，则代码不会报错：

~~~
import { Provider } from 'react-redux';
import store from './youPath/store';

Popup.show(
	<Provider store={store}>
		< ComponentWithConnect />
	</Provider> , 
{ maskClosable: false });
~~~


## 高清插件

* 引入后以 宽度750px 的iPhone尺寸为基准设置css，然后除以100后使用rem单位；
* 如使用px，则无法适配 plus 的3倍尺寸；
* 以 宽度375px 屏幕尺寸为例设置字体或导航尺寸：

```
50px * 2 / 100 = 1rem

```