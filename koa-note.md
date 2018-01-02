<link rel="stylesheet" href="highlight/styles/atom-one-light.css">
<script src="highlight/highlight.min.js"></script>
<script>hljs.initHighlightingOnLoad();</script>


#KOA笔记


## 获取请求参数

* [koa-body](https://www.npmjs.com/package/koa-body) 中间件使用  (可搭配 [koa-router](https://www.npmjs.com/package/koa-router) 使用)：
  
  > 支持三种类型的数据
  
  >```
    multipart/form-data
	application/x-www-urlencoded
	application/json
   ```
  > 安装 
  
  > ```
    $ npm install koa-body
    ```
  > 使用 
  
  > ```
  	import koaBody from'koa-body'
  	app.use(convert(koaBody({
  			multipart: true,  // 允许上传多个文件
		    formidable: { 
			    uploadDir: 'public/images/headImage',// 上传的文件存储的路径 
			    keepExtensions: true  //  保存图片的扩展名
	 	       }
  	})));
  ```
  >若使用了 koa-convert
  
  >```
  app.use(convert(koaBody({multipart: true})));
  ```

* 获取 post 请求的请求 json 数据 `ctx.request.body`
* 获取 post 请求的请求 form-data 数据 `ctx.request.body.fields`
* 获取请求 url 的 params 入参 `ctx.query`
* 支持form-data请求需安装 [Form-Data](http://npm.taobao.org/package/form-data) 依赖包
 > ```
    $ npm install --save form-data
   ```
 
  >  ```
  	var FormData = require('form-data');
     ```
  >  ```
  var formData = new FormData();
  for(var name in theData) {
       formData.append(name, theData[name]);
     }
   fetch(URL, {
      method:'POST',
    	body: formData
  }).then(...
 	 ```

