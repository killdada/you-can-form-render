# form-render

## 初始化依赖

`./install.sh`

## 本地开发

本地开发调试的地址都是 http://localhost:8000

### 单独调试前端使用 mock 数据调试

```js
// 启动前端
cd client
yarn dev:mock
```

### 同时调试后端和前端项目

```js
// 启动后端
cd server
yarn dev

// 启动前端
cd client
yarn dev
```

## 发布部署

`./build.sh`

> 前置依赖 docker docker-compose

访问 http://localhost:81

## 远程 demo 和文档

[demo](http://ycid-form-render.yenmysoft.com.cn/)

[文档](http://ycid-form-render-doc.yenmysoft.com.cn/)

## todo 迁移到 vercel
