
### 案例一
```
<z-address-popup v-model="true" :dataList="[]" @change="addressChange" :length="3" :force="force"></z-address-popup>
```

### 属性
| 名称                        | 类型          | 默认值          | 描述                                               |
| ----------------------------|--------------- | ------------- | ---------------------------------------------------|
| dataList                    | Array         | []          | 默认值|
| length                      | Number        | 3          | 地区选择长度（1-3）                |
| force                     | Boolean       | true          | 强制选择，选择长度必须达到指定长度|
| value                     | Boolean       | false     	| 控制弹窗是否打开 |

### 事件
| 名称             | 类型              | 描述                      |
| -----------------|------------------ | --------------------------|
| @change        | function | 选择时数据返回    |
