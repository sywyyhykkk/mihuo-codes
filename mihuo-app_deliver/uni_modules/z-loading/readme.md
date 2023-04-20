
### 案例一
```
<z-loading></z-loading>
```

### 用法第一步
```
// vuex里面注册loadingShow变量和setLoadingShow赋值方法
```

### 用法第二步
```
import store from '@/store';
//调用vuex方法打开加载动画
store.commit("setLoadingShow", true);
```
