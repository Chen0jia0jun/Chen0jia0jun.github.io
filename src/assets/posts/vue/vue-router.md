# Vue-router的强大功能

$$
从能实现的功能与效果方向去学习vue-router，内核与底层暂且忽略
$$

## 入门

### 挂载插件

app实例上挂载route插件，挂载后完成了以下事情：

1. [全局注册](https://cn.vuejs.org/guide/components/registration.html#global-registration) `RouterView` 和 `RouterLink` 组件。
2. 添加全局 `$router` 和 `$route` 属性。
3. 启用 `useRouter()` 和 `useRoute()` 组合式函数。
4. 触发路由器解析初始路由。

### 访问路由

有route和router两个实例对象，这里只讲router的选项式API的路由导航的写法

```JavaScript
this.$router.push('/about')
```



## 路由匹配

```RouterLink ```和```RouterView ```是成对出现的，一个负责在不刷新页面的情况下改变URL，一个负责匹配对应的页面，具体的匹配规则在创建路由器实例的时候已经写好。

```JavaScript
import { createMemoryHistory, createRouter } from 'vue-router'

const routes = [
  { path: '/', component: HomeView },
  { path: '/about', component: AboutView },
  { path: '/users/:id', component: User },
  { path: ':pathMatch(.*)*', component: NotFound },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
```

### 动态参数

会映射到route.params字段，```$route.params.id```即可访问对应的id字段，若有其他字段同理也可访问。而动态参数的变化不会引起组件的刷新，即它的生命周期在路由变化时不会执行；若需要执行，可以通过watch监听参数的变化：

```JavaScript
// watch
watch(() => route.params.id, (newId, oldId) => {
  // 对路由变化做出响应...
})

// BeforeRouteUpdate
import { onBeforeRouteUpdate } from 'vue-router'

onBeforeRouteUpdate(async (to, from) => {
  // 对路由变化做出响应...
  userData.value = await fetchUser(to.params.id)
})
```

### 路由匹配语法

[路由的匹配语法 | Vue Router](https://router.vuejs.org/zh/guide/essentials/route-matching-syntax.html)

```JavaScript
const routes = [
  // /:orderId -> 仅匹配数字
  { path: '/:orderId(\\d+)' },
  // /:productName -> 匹配其他任何内容
  { path: '/:productName' },
]
```

### 嵌套路由

[嵌套路由 | Vue Router](https://router.vuejs.org/zh/guide/essentials/nested-routes.html)

页面中再进行路由匹配，只需要配置children即可

```JavaScript
const routes = [
  {
    path: '/user/:id',
    component: User,
    children: [
      {
        // 当 /user/:id/profile 匹配成功
        // UserProfile 将被渲染到 User 的 <router-view> 内部
        path: 'profile',
        component: UserProfile,
      },
      {
        // 当 /user/:id/posts 匹配成功
        // UserPosts 将被渲染到 User 的 <router-view> 内部
        path: 'posts',
        component: UserPosts,
      },
    ],
  },
]
```

## 重定向路由

[重定向和别名 | Vue Router](https://router.vuejs.org/zh/guide/essentials/redirect-and-alias.html)

别名可以自由地将不同的URL映射到相同的组件上，但我没使用过；这里要将的主要是重定向。

在静态托管网站中会遇到这样的问题：访问主页面之外的页面的URL，无法访问到，这是因为服务器内部没有配置返回的资源，这个时候可以在前端进行重定向处理，或者设置路由为hash路由。

## 设置页面标题





## 参考链接

[ Vue Router](https://router.vuejs.org/zh/guide/essentials/history-mode.html)
