# 多选组件

多选组件

### 案例一
```
<multiple-choice v-model="true" title="选择性别" :range="[{name: '男'}, {name: '女'}]" rangeKey="name"></multiple-choice>
```
### 案例二
```
<multiple-choice title="选择性别" :range="[{name: '男'}, {name: '女'}]" rangeKey="name">
	<button>打开</button>
</multiple-choice>
```

### 属性
| 名称                        | 类型          | 默认值          | 描述                                               |
| ----------------------------|--------------- | ------------- | ---------------------------------------------------|
| value                     | Boolean       | false     	| 控制弹窗是否打开 |
| title                     | String         |           | 弹窗标题|
| range                      | Array        | []          | 可选内容                |
| rangeKey                  | String       | name          | 显示内容的key|