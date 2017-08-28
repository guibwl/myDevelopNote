<link rel="stylesheet" href="highlight/styles/atom-one-light.css">
<script src="highlight/highlight.min.js"></script>
<script>hljs.initHighlightingOnLoad();</script>

### CSS实现－文本超出部分显示"…" 

	overflow:hidden;  					
    text-overflow:ellipsis; 			
    display:-webkit-box;  				 
    -webkit-box-orient:vertical;  	
    -webkit-line-clamp:2; 	
	
### JS实现－超出长度部分显示"…"

	var str="这里是字符串aaaa"; //原始字符串  
	var s = str;//要展示的字符串
	if(str.length>10){
	s=str.substring(0,10)+"...";
	}
	
### 数组排序：

	function compare(value1, value2) { 
	if (value1 > value2) {   			
	return -1;								
	    } else if (value1 < value2) {  
	return 1;							
	    } else {							
	        return 0;					
	    } 
	}										
	var values = [0, 1, 5, 10, 15];   
	values.sort(compare);				
	console.log(values);	
	
### localStorage通过JSON存储：

	localStorage.setItem('FIRST_JOBINFO',JSON.stringify(item));
	JSON.parse(localStorage.getItem('FIRST_JOBINFO'));

### 跨越问题解决
打开终端输入下方代码，并重启浏览器

~~~
open -a "Google Chrome" --args -disable-web-security --user-data-dir=
~~~
	
### Angular.js里的ng-class：

> **ng-class用法1:**
> 
~~~
ng-class="{'className1':object,'className2':!object}"
~~~
> **ng-class用法2:**
> 
```
ng-class="myFunc()"
$scope.myFunc = function() {
		var color = 'className';
		return className;
}	
```

### 删除对象属性方法：
* `delete object.property ;` 
* `delete object["property"] ;`

### 数组去重方法：
> **方法**
> 
~~~
Array.prototype.unique3 = function(){
var res = [];
var json = {};
for(var i = 0; i < this.length; i++){
  if(!json[this[i]]){
    res.push(this[i]);
    json[this[i]] = 1;
  }
}
return res;
}
~~~
> **如何调用**
> 
~~~
Array.unique3();
~~~

### js模块化书写规范

*  AMD,CMD,CommonJS

### html5调用 NATIVE 相册／摄像头／录音

~~~
	<input type="file" accept="image/*" capture="camera">
    <input type="file" accept="video/*" capture="camcorder">
    <input type="file" accept="audio/*" capture="microphone">
~~~

* capture表示，可以捕获到系统默认的设备，比如：
  camera--照相机；camcorder--摄像机；microphone--录音。
* accept表示，直接打开系统文件目录。

**多选** ：其实html5的input:file标签还支持一个multiple属性，表示可以支持多选，如：

~~~
	<input type="file" accept="image/*" multiple>
~~~