## 打包步骤

# ssr

```bash
cd ssr-server && yarn build
```

# docker

```bash

# 根目录下运行
docker build -f Dockerfile . -t swr.cn-east-3.myhuaweicloud.com/mihuo/pdf-server

docker push swr.cn-east-3.myhuaweicloud.com/mihuo/pdf-server

```
