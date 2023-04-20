#/bin/bash
echo "输入需要打包并且上传的端 o代表运营端 e代表企业端 a代表总后台 all代表所有端"
read name
git checkout origin/dev
git pull origin dev
npm install
if [ $name = 'e' ]
then
    npm run build:enterprise-dev
else 
    if [ $name = 'o' ]
    then
        npm run build:cityoperator-dev
    else 
        if [ $name = 'a' ]
        then            
          npm run build:admin-dev
        else
          npm run build:all-dev
        fi
    fi
fi
git checkout dev