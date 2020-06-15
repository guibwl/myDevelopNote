# docker

## dockerfile 创建容器

```bash
$ docker build -t name:tag .
```

## 启动容器

```
$ docker run -t -i ubuntu /bin/bash
```

>docker run：启动container

>ubuntu：你想要启动的image

>-t：进入终端

>-i：获得一个交互式的连接，通过获取container的输入

>/bin/bash：在container中启动一个bash shell
