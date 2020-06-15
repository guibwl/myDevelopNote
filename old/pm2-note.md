<link rel="stylesheet" href="highlight/styles/atom-one-light.css">
<script src="highlight/highlight.min.js"></script>
<script>hljs.initHighlightingOnLoad();</script>


#PM2 笔记

pm2 是基于 nodejs 开发的进程管理器，适用于后台常驻脚本管理，同时对node网络应用有自建负载均衡功能。官方的说法，pm2 是一个带有负载均衡功能的Node应用的进程管理器，但pm2支持多种语言，只是对于除node之外的其他进程无负载均衡的能力。

[查看官方文档](http://pm2.keymetrics.io/docs/usage/cluster-mode/)

## 全局安装

~~~ jsx
$ npm install pm2 -g
~~~

## 相关命令

启动：

~~~ jsx
$ pm2 start app.js
$ pm2 start app.js --name my-api   # my-api为PM2进程名称
$ pm2 start app.js -i 0            # 根据CPU核数启动进程个数
$ pm2 start app.js --watch         # 实时监控app.js的方式启动，当app.js文件有变动时，pm2会自动reload
~~~

查看进程：

~~~ jsx
$ pm2 list
$ pm2 show 0 #查看进程详细信息，0为PM2进程id
$ pm2 info 0         
~~~

监控:

~~~ jsx
$ pm2 monit
~~~

停止:

~~~ jsx
$ pm2 stop all                        #停止PM2列表中所有的进程
$ pm2 stop 0                          #停止PM2列表中进程为0的进程
~~~

重载：

~~~ jsx
$ pm2 reload all                      #重载PM2列表中所有的进程
$ pm2 reload 0                        #重载PM2列表中进程为0的进程
~~~

重启：

~~~ jsx
$ pm2 restart all                     #重启PM2列表中所有的进程
$ pm2 restart 0                       #重启PM2列表中进程为0的进程
~~~

删除PM2进程：

~~~ jsx
$ pm2 delete 0                        #删除PM2列表中进程为0的进程
$ pm2 delete all                      #删除PM2列表中所有的进程
$ pm2 kill                    		  #删除PM2列表中所有的进程
~~~

日志操作：

~~~ jsx
$ pm2 logs [--raw]                    #查看所有进程的日志
$ pm2 flush                           #清空所有日志文件
$ pm2 reloadLogs                      #重新加载所有日志
~~~

升级PM2:

~~~ jsx
$ pm2 save # 记得保存进程状态
$ npm install pm2 -g
$ pm2 update
~~~

更多命令参数可查看帮助:

~~~ jsx
$ pm2 --help
~~~

## 高级用法



安装 ecosystem 配置文件

~~~ jsx
$ pm2 ecosystem
~~~

* 配置文件里的设置项，跟命令行参数基本是一一对应的。
* 可以选择yaml、json、js文件。

参考配置:

~~~ jsx
 /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/

   */
{
  apps: [                             // 每一个数组成员就是对应一个 pm2 中运行的应用
    {                                 // First application
      name: 'koa-nasa-star',          // 应用程序的名称
      script: './bin/environment.js', // 应用目录获取入口文件的相对地址
      cwd: './',                      // ecosystem 获取应用目录的相对地址
      max_memory_restart: '1G',       // 内存达到设置的阙值时, pm2 将自动重启该应用
      instances: 4,                   // 应用启动实例个数，仅cluster有效
      exec_mode: 'cluster',			 // 应用程序启动模式，这里设置的是cluster_mode（集群），默认是fork
      out_file: './logs/nasaStar_out.log', //自定义应用程序日志文件, 使用相对路径时, 相对上面设置 cwd 路径
      error_file: './logs/nasaStar_error.log', //自定义应用程序的错误日志文件, 使用相对路径时, 相对上面设置 cwd 路径
      merge_logs: true, // 合并代码
      log_date_format: 'YYYY-MM-DD HH:mm Z', //指定日志日期格式，如YYYY-MM-DD HH:mm:ss
      min_uptime:'240s', //应用运行少于时间被认为是异常启动
      max_restarts:10, // 最大异常重启次数，即小于min_uptime运行时间重启次数
      cron_restart:'59 4 * * *', // crontab 时间格式重启应用，目前只支持 cluster 模式
      watch: [ // 监控变化的目录，一旦变化，自动重启
        'bin',
        'src',
        'node_modules'
      ],
      ignore_watch: [ // 从监控目录中排除
        'public',
        'test',
        'views',
        'logs'
      ],
      watch_options: {
        'followSymlinks': false
      },
      env: { //开发环境
         NODE_ENV: 'development',
         REMOTE_ADDR: 'https://test1-city.pingan.com.cn'
      },
      env_test: { //测试环境
        NODE_ENV: 'test',
        REMOTE_ADDR: 'http://215.128.22.151'
      },
      env_prd: { //生产环境
        NODE_ENV: 'production',
        REMOTE_ADDR: 'http://172.25.41.233'
      }
    }
  ]
};
~~~

### 使用配置文件启动不同环境：

* start development : `pm2 start ecosystem.config.js`
* start test : `pm2 start ecosystem.config.js --env test`
* start production : `pm2 start ecosystem.config.js --env prd`

### 不同环境读取配置中的生命变量：

在应用中，可以通过 `process.env.NODE_ENV` 等来读取配置中生命的变量。

### 其他配置属性：

* exec_interpreter：应用程序的脚本类型，这里使用的 shell，默认是 nodejs
* interpreter：  指定的脚本解释器
* interpreter_arg： 传递给解释器的参数
* min\_uptime：最小运行时间，这里设置的是 60s 即如果应用程序在 60s 内退出，pm2 会认为程序异常退出，此时触发重启 max_restarts 设置数量
* max_restarts：设置应用程序异常退出重启的次数，默认 15 次（从0开始计数）
* pid_file：自定义应用程序的 pid 文件
* args：  传递给脚本的参数
* autorestart: 默认为true, 发生异常的情况下自动重启
* force: 默认false，如果true，可以重复启动一个脚本。pm2不建议这么做
* restart_delay: 异常重启情况下，延时重启时间

[更多属性及具体解释参考官方文档](http://pm2.keymetrics.io/docs/usage/application-declaration/)

### crontab 时间格式

` 30 8 * * * `

* 第一段应该定义的是：分钟，表示每个小时的第几分钟来执行。范围是从0-59
* 第二段应该定义的是：小时，表示从第几个小时来执行，范围是从0-23
* 第三段应该定义的是：日期，表示从每个月的第几天执行，范围从1-31
* 第四段应该定义的是：月，表示每年的第几个月来执行，范围从1-12
* 第五段应该定义的是：周，表示每周的第几天执行，范围从0-6，其中 0表示星期日

## 开机自动启动

可以通过 `pm2 startup` 来实现开机自启动。细节可[参考官网](http://pm2.keymetrics.io/docs/usage/startup/).大致流程如下

* 通过 `pm2 save `保存当前进程状态。
* 通过`pm2 startup [platform]`生成开机自启动的命令。（记得查看控制台输出）
* 将步骤2生成的命令，粘贴到控制台进行，搞定。