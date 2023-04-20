FROM node:16-slim

COPY ./assets/sources.list /etc/apt/sources.list

RUN apt-get update --allow-insecure-repositories  
RUN apt-get install curl -y --allow-unauthenticated
RUN curl -LO https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN apt-get install --allow-unauthenticated -y ./google-chrome-stable_current_amd64.deb 
RUN rm google-chrome-stable_current_amd64.deb
# RUN apt-get install unzip -y --allow-unauthenticated
# RUN cd /tmp && wget http://ftp.cn.debian.org/debian/pool/main/f/fonts-noto-cjk/fonts-noto-cjk_20170601+repack1-3+deb10u1_all.deb && \
#     dpkg -i fonts-noto-cjk_20170601+repack1-3+deb10u1_all.deb    && \
#     wget https://github.com/adobe-fonts/source-sans-pro/releases/download/2.040R-ro%2F1.090R-it/source-sans-pro-2.040R-ro-1.090R-it.zip && \
#     unzip source-sans-pro-2.040R-ro-1.090R-it.zip && cd source-sans-pro-2.040R-ro-1.090R-it  && mv ./OTF /usr/share/fonts/  && \
#     fc-cache -f -v
COPY ./assets/songti.ttc /usr/share/fonts/songti.ttc

COPY ./pdf-server/index.js /app/
COPY ./pdf-server/pdf.js /app/
COPY ./pdf-server/package.json /app/
COPY ./ssr-server/.output /app/.output

WORKDIR /app
RUN npm config set registry http://registry.npm.taobao.org
RUN npm install
RUN npm install pm2 -g

EXPOSE 3001
ENTRYPOINT pm2 start index.js .output/server/index.mjs --no-daemon
