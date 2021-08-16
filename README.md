# form-render

## 初始化依赖

`./install.sh`

## 本地开发

```bash
cd client
yarn dev
http://localhost:7001
```

> 本地开发的数据是直接访问的 mock 接口数据，如果需要后端开发 （后端开发目前也是简单的 mock 假数据）

```bash
cd server
yarn start

修改client配置umi接口转发到7002端口即可
```

## 发布部署

`./build.sh`

> 前置依赖 docker docker-compose

访问 http://localhost:81
