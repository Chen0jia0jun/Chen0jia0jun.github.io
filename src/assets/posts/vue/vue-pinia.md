# Pinia学习实践

[开始 | Pinia](https://pinia.vuejs.org/zh/getting-started.html)

主要分为三个部分：State、Getter、Action，将从这三个方面对store进行介绍

## 快速开始

在app上挂载插件

```
import {createPinia} from 'pinia';

...
app.use(createPinia());
```

store基本结构

```javascript
import { defineStore } from 'pinia'

export const useSomeStore = defineStore('some',{
	state: ()=>{
		data1:{},
		data2:[],
		...
	},
	
	getter: {
		function1: ()=>{};
        function2: ()=>{};
	},
	
	action: {
	
	}
})
```

## State

主要用来存储数据，数据都被reactive包裹，不能解构赋值来取用，action和getter可以解构取用

```
// 访问state
const store = useStore();
store.xxx; // 这样访问的是静态数据，即不会更新；
const { name, doubleCount } = storeToRefs(store)
// 重置state
const store = useStore()
store.$reset()
/* $reset需要自己写
function $reset() {
    count.value = 0
  }
*/

```



## Getter

用于计算state，一般无副作用。

可以像调用state一样调用getter



## Action

**与getter不同的是，`action` 可以是异步的**，你可以在它们里面 `await` 调用任何 API，以及其他 action；还可以访问其他store。

## 订阅

以上三类对象都可以进行订阅，当对象发生变化时就会触发相应的钩子函数。

特别地，文档中介绍了action的订阅方法，可以监听调用成功和调用失败的结果，可以利用这个功能记录日志和处理错误的网络请求。
