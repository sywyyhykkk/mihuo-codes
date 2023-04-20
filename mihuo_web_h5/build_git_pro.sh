#/bin/bash
echo "输入需要打包并且上传的端 o代表运营端 e代表企业端 a代表总后台 all代表所有端"
read name
git checkout origin/master
git pull origin master
npm install
if [ $name = 'e' ]
then
    npm run build:enterprise-pro
else 
    if [ $name = 'o' ]
    then
        npm run build:cityoperator-pro
    else 
        if [ $name = 'a' ]
        then            
          npm run build:admin-pro
        else
          npm run build:all-pro
        fi
    fi
fi
#执行完成 分之切换回来
git checkout dev