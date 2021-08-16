FROM nginx

RUN mkdir -p /www/form-render/frontend
COPY ./client/dist /www/form-render/frontend
ADD ./docker/nginx/nginx.conf /etc/nginx/nginx.conf
