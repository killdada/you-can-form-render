FROM node:14.17.4-alpine

# 创建app目录
RUN mkdir -p /www/form-render/backend

# 设置工作目录
WORKDIR /www/form-render/backend

# 拷贝所有源代码到工作目录
COPY ./server  /www/form-render/backend

EXPOSE 7002

