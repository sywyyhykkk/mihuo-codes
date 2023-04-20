#/bin/bash
echo "输入需要打包并且上传的端 o代表运营端 e代表企业端 a代表总后台 all代表所有端"
read name
git checkout origin/beta
git pull origin beta
npm install
echo $name
if [ $name = 'e' ]
then
    npm run build:enterprise-test
else 
    if [ $name = 'o' ]
    then
        npm run build:cityoperator-test  
    fi
fi
if [ $name = 'a' ]
  then     
    npm run build:admin-test
  else
    npm run build:all-test
fi
#执行完成 分支切换回来
git checkout dev