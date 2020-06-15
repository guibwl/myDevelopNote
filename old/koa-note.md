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

### 写入/创建文件

~~~ javascript
import fs from 'fs'
import path from 'path'

/**
 * [writeFileFuc 文件创建／写入]
 * @param  {[string]} writePath [创建／写入文件的绝对路径]
 * @param  {[string]} data      [写入的具体内容]
 */
const writeFileFuc = (writePath, data) => {
  writePath = path.normalize(`${writePath}`)
  fs.open(writePath, 'a', function (err, fd) {
    if (err) {
      throw err
    }
    fs.write(fd, data, 0, 'utf-8', function (err, written, string) {
      if (err) {
        throw err
      }
      console.log(written)
      console.log(`${writePath} ::::::${string}`)

      fs.close(fd, function (err) {
        if (err) {
          throw err
        }
        console.log('file closed')
      })
    })
  })
}

export default writeFileFuc
~~~

### 读取文件

~~~ javascript
	import fs from 'fs'
	import path from 'path'
	
    console.log('读取写入的数据！')
    fs.readFile(__dirname + '/theTest.txt', function (err, data) {
      if (err) {
        return console.error(err)
      }
      console.log(`异步读取文件 ${__dirname}/theTest.txt 数据: ${data.toString()}`)
    })
~~~

### 遍历文件列表

~~~ javascript
	import fs from 'fs'
	import path from 'path'
	
  // 调用文件遍历方法
    fileDisplay(__dirname)

  /**
  * 文件遍历方法
  * @param filePath 需要遍历的文件路径
  */
    function fileDisplay (filePath) {
    // 根据文件路径读取文件，返回文件列表
      fs.readdir(filePath, function (err, files) {
        if (err) {
          console.warn(err)
        } else {
        // 遍历读取到的文件列表
          files.forEach(function (filename) {
          // 获取当前文件的绝对路径
            var filedir = path.join(filePath, filename)
          // 根据文件路径获取文件信息，返回一个fs.Stats对象
            fs.stat(filedir, function (eror, stats) {
              if (eror) {
                console.warn('获取文件stats失败')
              } else {
                var isFile = stats.isFile() // 是文件
                var isDir = stats.isDirectory() // 是文件夹
                if (isFile) {
                  console.log(filedir)
                }
                if (isDir) {
                  fileDisplay(filedir) // 递归，如果是文件夹，就继续遍历该文件夹下面的文件
                }
              }
            })
          })
        }
      })
    }
~~~

## 删除文件

~~~ javascript
	import fs from 'fs'
	import path from 'path'

    console.log('准备删除文件！')
    fs.unlink(__dirname + '/theTest.txt', function (err) {
      if (err) {
        return console.error(err)
      }
      console.log(`文件 ${__dirname}/theTest.txt 删除成功！`)
    })
~~~

## 根据路径创建文件夹

node.js没有提供直接创建嵌套文件夹的方法，如果需要创建嵌套的文件夹 则要用到 回调函数或者递归来完成。如下为递归的实现。

~~~ javascrit 
var fs = require('fs');  
var path = require('path');  
//使用时第二个参数可以忽略  
function mkdir(dirpath,dirname){  
        //判断是否是第一次调用  
        if(typeof dirname === "undefined"){   
            if(fs.existsSync(dirpath)){  
                return;  
            }else{  
                mkdir(dirpath,path.dirname(dirpath));  
            }  
        }else{  
            //判断第二个参数是否正常，避免调用时传入错误参数  
            if(dirname !== path.dirname(dirpath)){   
                mkdir(dirpath);  
                return;  
            }  
            if(fs.existsSync(dirname)){  
                fs.mkdirSync(dirpath)  
            }else{  
                mkdir(dirname,path.dirname(dirname));  
                fs.mkdirSync(dirpath);  
            }  
        }  
}  
mkdir('/home/ec/a/b/c/d'); 
~~~