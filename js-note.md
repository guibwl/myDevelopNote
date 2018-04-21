<link rel="stylesheet" href="highlight/styles/atom-one-light.css">
<script src="highlight/highlight.min.js"></script>
<script>hljs.initHighlightingOnLoad();</script>

## js 学习笔记

### CSS实现－文本超出部分显示"…"

	{
	 overflow:hidden;  					
     text-overflow:ellipsis; 			
     display:-webkit-box;  				 
     -webkit-box-orient:vertical;
     -webkit-line-clamp:2; 	
    }

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

	localStorage.setItem('DATA_NAME',JSON.stringify(item));
	JSON.parse(localStorage.getItem('DATA_NAME'));

### 跨越问题解决
完全退出浏览器后,打开终端输入下方代码 ( [查看](https://github.com/zhongxia245/blog/issues/28) )

~~~
open -a "Google Chrome" --args -disable-web-security -user-data-dir=
~~~

### MAC显示隐藏文件
打开终端输入下方代码 

~~~
defaults write com.apple.finder AppleShowAllFiles -boolean true ; killall Finder
~~~

### Angular.js里的ng-class：

> **ng-class用法1:**
>
~~~
ng-class="{'className1':object,'className2':!object}"
~~~
> **ng-class用法2:**
>
``` jsx
ng-class="myFunc()"
$scope.myFunc = function() {
		var color = 'className';
		return className;
}
```

### 删除对象属性方法：
* `delete object.property ;`
* `delete object["property"] ;`

## 数组去重方法：
[数组去重十种方法](arrayDeduplication/JS数组去重的十种方法.html)
>
> **方法示例**
>
~~~
	var arry = [1,1,1,2,2,3]
	function unique(arr){
	var res = [];
	for(var i=0; i<arr.length; i++){
	if(res.indexOf(arr[i]) == -1){
	res.push(arr[i]);
	}
	}
	return res;
	}
~~~

> **如何调用**
>
~~~
console.log(unique(arry))  // [1,2,3]
~~~

## html 入口判断引入 src 线上脚本

```html

    <script>
      if (true) {
      		document.writeln('<script src="https://www.abc.com/script.js"'+'>'+'<'+'/'+'script>');
      } else {
			document.writeln('<script src="https://www.abc.com/script.js"'+'>'+'<'+'/'+'script>');
      }
    </script>

```
## js模块化书写规范

*  AMD,CMD,CommonJS

## 拨打电话

~~~
<a href="tel:13900000000">移动WEB页面JS一键拨打号码咨询功能</a>
~~~

## html5调用 NATIVE 相册／摄像头／录音

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

## js实现获取两个日期之间所有日期的方法
```
function getDate(datestr){
  let temp = datestr.split("-"),
      date = new Date(temp[0],temp[1],temp[2]);
  return date;
}
let arry      = [],
    start     = "2012-03-25",
    end       = "2012-04-03",
    startTime = getDate(start),
    endTime   = getDate(end);
while((endTime.getTime()-startTime.getTime())>=0){
  let year  = startTime.getFullYear(),
      month = startTime.getMonth().toString().length==1?"0"+startTime.getMonth().toString():startTime.getMonth(),
      day   = startTime.getDate().toString().length==1?"0"+startTime.getDate():startTime.getDate();
  arry.push(year+"-"+month+"-"+day)
  startTime.setDate(startTime.getDate()+1);
}
console.log(arry)

```

## js 获取身份证中的生日性别
~~~
//----------------------------------------------------------
//    功能：根据身份证号获得出生日期
//  参数：身份证号 psidno
//    返回值：
//    出生日期
//----------------------------------------------------------
 function GetBirthday(psidno){
    var birthdayno,birthdaytemp
    if(psidno.length==18){
        birthdayno=psidno.substring(6,14)
    }else if(psidno.length==15){
        birthdaytemp=psidno.substring(6,12)
        birthdayno="19"+birthdaytemp
    }else{
        alert("错误的身份证号码，请核对！")
        return false
    }
    var birthday=birthdayno.substring(0,4)+"-"+birthdayno.substring(4,6)+"-"+birthdayno.substring(6,8)
    return birthday    
}

//----------------------------------------------------------
//    功能：根据身份证号获得性别
//  参数：身份证号 psidno
//    返回值：
//    性别
//----------------------------------------------------------
function Getsex(psidno){
    var sexno,sex
    if(psidno.length==18){
        sexno=psidno.substring(16,17)
    }else if(psidno.length==15){
        sexno=psidno.substring(14,15)
    }else{
        alert("错误的身份证号码，请核对！")
        return false
    }
    var tempid=sexno%2;
    if(tempid==0){
        sex='F'
    }else{
        sex='M'
    }
    return sex
}
~~~

## js 判断身份证是否正确

~~~
//----------------------------------------------------------
//    功能：检查身份证号码
//  参数：
//    id 类型 string
//    返回值：bool
//----------------------------------------------------------
    window.VALIDATE = function () {
        var Errors = new Array("yes", "身份证号码位数不对!", "身份证号码出生日期超出范围或含有非法字符!", "身份证号码校验错误!", "身份证地区非法!");

        var area = {
            11: "北京",
            12: "天津",
            13: "河北",
            14: "山西",
            15: "内蒙古",
            21: "辽宁",
            22: "吉林",
            23: "黑龙江",
            31: "上海",
            32: "江苏",
            33: "浙江",
            34: "安徽",
            35: "福建",
            36: "江西",
            37: "山东",
            41: "河南",
            42: "湖北",
            43: "湖南",
            44: "广东",
            45: "广西",
            46: "海南",
            50: "重庆",
            51: "四川",
            52: "贵州",
            53: "云南",
            54: "西藏",
            61: "陕西",
            62: "甘肃",
            63: "青海",
            64: "宁夏",
            65: "新疆",
            71: "台湾",
            81: "香港",
            82: "澳门",
            91: "国外"
        };
        var errMessage = '';

        function errorMessage() {
            return errMessage;
        };
        function checkIdcard(text) {
            var v = text;
            var v;
            var S, M;
            if (text == "111111111111111") {
                errMessage = Errors[3];
                return false;
            }
            //身份号码位数及格式检验
            var bRun = false;
            var ereg = "";
            switch (v.length) {
                case 15:
                    if ((parseInt(v.substr(6, 2)) + 1900) % 4 == 0) {
                        if ((parseInt(v.substr(6, 2)) + 1900) % 100 != 0) {
                            bRun = true;
                        }
                    }

                    if (bRun) {
                        ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;//测试出生日期的合法性
                    } else {
                        ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;//测试出生日期的合法性
                    }
                    if (ereg.test(v)) {
                        // return true;  重疾险需要15位验证不通过。所以全部为false
                        return false;
                    }
                    else {
                        errMessage = Errors[2];
                        return false;
                    }//[false,Errors[2]];

                    break;
                case 18:
                    //18位身份号码检测
                    //出生日期的合法性检查
                    //闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
                    //平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
                    bRun = false;
                    if (parseInt(v.substr(6, 4)) % 4 == 0) {
                        if (parseInt(v.substr(6, 4)) % 100 == 0) {
                            if (parseInt(v.substr(6, 2)) % 4 == 0) {
                                bRun = true;
                            }
                        } else {
                            bRun = true;
                        }
                    }
                    if (bRun) {
                        ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;//闰年出生日期的合法性正则表达式
                    } else {
                        ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;//平年出生日期的合法性正则表达式
                    }
                    if (ereg.test(v)) {
                        //测试出生日期的合法性
                        M = "F";
                        M = createPid(v);//判断校验位
                        if (M == v.substr(17, 1).toUpperCase()) {
                            return true;
                        }//检测ID的校验位
                        else {
                            errMessage = Errors[3];
                            return false;
                        }//[false,Errors[3]];
                    } else {
                        errMessage = Errors[2];
                        return false;//[false,Errors[2]];
                    }

                    break;
                default:
                    errMessage = Errors[1];
                    return false;//[false,Errors[1]];
                    break;

            }

        };
        var createPid = function (idcard) {
            var Y, JYM,S;
            var idcard_array = new Array();
            if (idcard.length < 17) {
                return "";
            }
            idcard_array = idcard.split("");
            //计算校验位
            S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7
                + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9
                + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10
                + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5
                + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8
                + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4
                + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2
                + parseInt(idcard_array[7]) * 1
                + parseInt(idcard_array[8]) * 6
                + parseInt(idcard_array[9]) * 3;
            Y = S % 11;
            JYM = "10X98765432";
            return JYM.substr(Y, 1);//校验位
        };

        return {
            checkIdcard: checkIdcard,
            errorMessage: errorMessage
        }
    }()

~~~
