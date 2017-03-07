# FlyLine
基于canvas的飞线图

引用flyline.js文件

全局`flyline`对象，包含以下方法：

- setCanvas
- addFlyL

### 初始化

首先使用setCanvas方法指定飞线图所处的画布,此方法没有返回值,参数为一个css选择器字符串:

```js
flyline.setCanvas("#canvas");

```

### 添加直线型飞线

```js

flyline.addFlyL(o)

```

其中`o`为对象类型,一个完整的o应该如下:

```js
o = {
	start:{x:100,y:100},
	target:{x:300,y:500},
	color:"#eeff00",
	time:1000,
	len:0,
	size:5
}

```


##### 使用方法

在引入`flyline.js`后可以在自己的脚本中使用:


```js
flyline.setCanvas("#cavnas");
flyline.addFlyL(o);

//添加后立即开始，完成后自动销毁，可以多次调用addFlyL方法

```



参数说明

 | 描述 | 类型 | 必须
--- | --- | --- | ---
start | 起点坐标 | 对象类型，包含x/y属性 | 是
target | 终点坐标 | 对象类型，包含x/y属性 | 是
color | 飞线颜色 | CSS颜色字符串 | 否,默认黑
time | 持续时间 | 毫秒 | 否,默认1000
len | 飞线长度 | 范围0-1 | 否,默认1
size | 飞线宽度 | 像素 | 否,默认5

#### 飞线原理说明

首先看一下此飞线图设计原理5个过程

图1为初始状态，s为起点，e为终点，p1和p2为两个中间点，初始时候s、p1和p2重叠：

![image](https://github.com/xswei/FlyLine/blob/master/pics/1.png)

图2为p1匀速离开s点，那么p2点离开s点的时间由参数`len`决定，len其实是个百分比，用来表示p1到p2之间的距离与s到e之间距离的比例：

![image](https://github.com/xswei/FlyLine/blob/master/pics/2.png)

图3为p1和p2同时过渡到e点，由于速度不变，p1和p2的相对位置保持不变：

![image](https://github.com/xswei/FlyLine/blob/master/pics/3.png)

图4表示p1已经到达e点，p2还未到达：

![image](https://github.com/xswei/FlyLine/blob/master/pics/4.png)

图5表示p1和p2都到达e点，此时飞线完成，从飞线数组中移除此条飞线释放内存：

![image](https://github.com/xswei/FlyLine/blob/master/pics/5.png)


绘制时在p1和p2之间绘制一条渐变线条即可。在计算时候p1和p2分别有一个参数t,这个参数从0递增到1，增量由帧率+预定的时间算出。


### 二次贝塞尔飞线

添加一个二次贝塞尔飞线:

```js

var o = {
	start:{x:100,y:100},
	target:{x:300,y:500},
	color:"#eeff00",
	time:1000,
	len:0,
	size:5,
	i:0.3
}

flyline.addFlyQ(o);

```

参数说明:

 | 描述 | 类型 | 必须
--- | --- | --- | ---
start | 起点坐标 | 对象类型，包含x/y属性 | 是
target | 终点坐标 | 对象类型，包含x/y属性 | 是
color | 飞线颜色 | CSS颜色字符串 | 否,默认黑
time | 持续时间 | 毫秒 | 否,默认1000
len | 飞线长度 | 范围0-1 | 否,默认1
size | 飞线宽度 | 像素 | 否,默认5
i | 弯曲程度 | 系数 范围[-1,1] | 否,默认0.3

#### 控制点参数

控制点参数为`i`,如下图，从起点s到终点e，控制点总是位于中垂线上，边界为`i=-1`和`i=1`。

`i`为负值时控制点位于右侧，`i`为正值时位于左侧

`i=1`或`i=-1`时，控制点最远，此时控制点距离s和e的中点距离为s到e的距离。此时线条最弯曲。

![image](https://github.com/xswei/FlyLine/blob/master/pics/q1.png)