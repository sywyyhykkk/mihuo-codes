FROM nginx 

ARG CLIENT=""

COPY ./dist-$CLIENT /data 

RUN rm /etc/nginx/conf.d/default.conf

ADD /nginx/mihuo-cityoperator.conf /etc/nginx/conf.d/default.conf 

RUN /bin/bash -c 'echo init ok'