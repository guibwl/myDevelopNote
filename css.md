## Background 添加 svg

* svg标签示例：

~~~
<svg xmlns='http://www.w3.org/2000/svg' width='100' height='120' viewBox='0 -2 59.75 60.25'><path fill='%23ccc' d='M29.691-.527c-15.648 0-28.333 12.685-28.333 28.333s12.685 28.333 28.333 28.333c15.648 0 28.333-12.685 28.333-28.333S45.339-.527 29.691-.527zm.184 53.75c-14.037 0-25.417-11.379-25.417-25.417S15.838 2.39 29.875 2.39s25.417 11.379 25.417 25.417-11.38 25.416-25.417 25.416z'/><path fill='none' stroke='%23108ee9' stroke-width='3' stroke-linecap='round' stroke-miterlimit='10' d='M56.587 29.766c.369-7.438-1.658-14.699-6.393-19.552'/></svg>
~~~

* 注意，css中，svg标签需要 encodeURIComponent 转码后方可使用

```
background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='59.75' height='60.25' viewBox='0 -2 59.75 60.25'%3E%3Cpath fill='%23ccc' d='M29.691-.527c-15.648 0-28.333 12.685-28.333 28.333s12.685 28.333 28.333 28.333c15.648 0 28.333-12.685 28.333-28.333S45.339-.527 29.691-.527zm.184 53.75c-14.037 0-25.417-11.379-25.417-25.417S15.838 2.39 29.875 2.39s25.417 11.379 25.417 25.417-11.38 25.416-25.417 25.416z'/%3E%3Cpath fill='none' stroke='%23108ee9' stroke-width='3' stroke-linecap='round' stroke-miterlimit='10' d='M56.587 29.766c.369-7.438-1.658-14.699-6.393-19.552'/%3E%3C/svg%3E");

```

## css选择器
~~~
css中“~”是:

为所有相同的父元素中位于 p 元素之后的所有 ul 元素设置背景：

p~ul{

　　background:#ff0000;
}
 
 <p>快乐生活</p>
<ul>
　　<li>生活</li>
　　<li>生活</li>
　　<li>生活</li>
</ul>
 
p~ul 选择前面有 <p> 元素的每个 <ul> 元素。
 
定义和用法

　　p~ul选择器 p之后出现的所有ul。

　　两种元素必须拥有相同的父元素，但是 ul不必直接紧随 p。

 

css中“>”是:

　　css3特有的选择器，A>B 表示选择A元素的所有子B元素。

　　与A B的区别在于，A B选择所有后代元素，而A>B只选择一代。

 .a，.b｛逗号指相同的css样式｝；.a .b｛空格指后代元素｝；.a>.b｛大于号指子代元素｝；
 
~~~
 
 
## 部分动画方法

* transition
`平滑过渡属性`
* transform
`变形转换属性`
* animation: name 1s infinite steps(n);
* @keyframes name {
	to {
		transform:velue
	}
}
`动画属性，animation & @keyframes`