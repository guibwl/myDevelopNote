# 配置演示环境(uat)

首先确保你要发布的模块已经加载并配置流水线，如果不清楚的这一步的，可查看[首次创建流水线流程；
](http://docs.**.com.cn/#/space/6260545/post/6307361)
配置成功后，可以在流水线页面看到对应的流水线，如下图：

![屏幕快照 2020-07-15 上午10.55.24.png](http://wb.**.com.cn/file/uid/10d945c24da44712923cbe391442cd90)

鼠标悬浮于‘...’，点击‘配置流水线’；（如果未执行过流水线，那么这里显示的是'快速配置'按钮）
![屏幕快照 2020-07-15 上午11.00.41.png](http://wb.**.com.cn/file/uid/73b423e875be43a9b56ee5e76700d4c5)

</br>

## 配置流水线

上一步进入配置页面后，选择‘STG部署’，点击‘添加作业’，如下图：

![1.png](http://wb.**.com.cn/file/uid/4f0c3fa148ee4f5b91404cf01308b348)

</br>

在弹出的弹窗中，选择‘普通部署’，如下图：

![屏幕快照 2020-07-15 上午11.19.55.png](http://wb.**.com.cn/file/uid/9178d17f312c4d07808f593ee5028d34)

</br>

然后选择‘作业’ 中的 '普通部署'，修改如下选项，如下图：
![1.png](http://wb.**.com.cn/file/uid/9836260277f941e8aba4b3f7212e3927)

上图红框中的选项分别为：
- 成功完成指定作业：STG部署
- 作业名称：⚠️ 这里改为'UAT部署'
- 执行方式：手动
- 环境类型：STG
- 部署环境：siapp_staticpool_uat

最后点击右上角‘保存并启用’按钮，生效设置；

## 验证

上一步完成后，会回到流水线列表页面；
找到刚才配置的流水线，如下图：
![1.png](http://wb.**.com.cn/file/uid/76599a5a3fca4b20a99b86b3581cd9cc)
如果‘STG部署’环节，作业为两个，即表示，配置作业成功。

点击‘重新部署’或‘执行’按钮，进行发布验证；
发布后流水线状态如下图：
![1.1.png](http://wb.**.com.cn/file/uid/af471a6eff9b48a4be1822b77233bb55)
鼠标悬浮于上图红框位置，出现悬浮框，点击‘发起部署’按钮，等待部署完成即可；

#### 演示环境页面访问地址：

演示环境的地址只需要在测试环境地址上稍做改变即可，下方标黄部分即是不同的地方；

- 测试：https://test1-city.**.com.cn/static/public-src/health-manage/health-main/index.html#/
- 演示：https://test1-city.**.com.cn/<mark>staticdemo/</mark>static/public-src/health-manage/health-main/index.html#/
