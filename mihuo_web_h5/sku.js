//生成笛卡尔积
function descartes(array) {
  if (array.length < 2) return array[0] || [];
  return [].reduce.call(array, function (col, set) {
    var res = [];
    col.forEach(function (c) {
      set.forEach(function (s) {
        var t = [].concat(Array.isArray(c) ? c : [c]);
        t.push(s);
        res.push(t);
      })
    });
    return res;
  });
}

function test(n) {
  // 判断一个数是否能被自身小的正整数(除开1和自身)整除.如果能整除则不是质数,否则反之.
  for (var k = 2; k < n; k++) {
    if (n % k === 0) {
      return false;
    }
  }
  return true;
}

function primeNumber(num) {
  var arr = [];
  // 遍历任意数, 利用test方法判断遍历数是否为质数;如果是, 就加入数组;
  for (var i = 2; i < num + 1; i++) {
    if (test(i)) {
      arr.push(i);
    }
  }
  return arr;
}
const zhishu = primeNumber(500)
//所有的sku名字
const initSkuName = [
  [{
    sex: 'man'
  }, {
    sex: 'woman'
  }],
  [{
    size: 'S'
  }, {
    size: 'M'
  }, {
    size: 'L'
  }],
  [{
    color: 'Red'
  }, {
    color: 'Green'
  }, {
    color: 'Blue'
  }]
]
// 需要的质数个数
//const nums = sku.length*sku[0].length;
//把指数数组放入数组中
console.log(zhishu)
for (let i = 0; i < initSkuName.length; i++) {
  for (let j = 0; j < initSkuName[i].length; j++) {
    initSkuName[i][j].index = zhishu[0];
    zhishu.splice(0, 1);
  }
}
const sku = descartes(initSkuName);
//console.log(sku,initSkuName)
//后端返回的是已有的sku 不满秩的sku
const re = [
  [{
      sex: 'man',
      index: 2
    },
    {
      size: 'S',
      index: 5
    },
    {
      color: 'Blue',
      index: 19
    }
  ],
  [{
      sex: 'man',
      index: 2
    },
    {
      size: 'M',
      index: 7
    },
    {
      color: 'Green',
      index: 17
    }
  ],
  [{
      sex: 'man',
      index: 2
    },
    {
      size: 'L',
      index: 11
    },
    {
      color: 'Green',
      index: 17
    }
  ],
  [{
      sex: 'man',
      index: 2
    },
    {
      size: 'L',
      index: 11
    },
    {
      color: 'Blue',
      index: 19
    }
  ]
]
//计算后台返回的可组合的sku有哪些值
const values = [];
for (let item of re) {
  let neiji = 1;
  for (let mini of item) {
    neiji = neiji * mini.index
  }
  values.push({value:neiji,item:item})
}
//console.log(values)



//现在假设选中的是L  传入质数
//传入选中的质数
function getselectedAlldata(list = [2,5,1]) {
  //遍历循环所有的 已知的sku
  for(let name of list){
    for(let item of initSkuName){
      for(let mini of item){
        if(mini.index==name){
          mini.selected = true;
        }
      }
    }
  }
} 
//进来第一次初始化的时候
function initData(){
    for(let item of initSkuName){
        for(let mini of item){
            for(let data of values){
                if(data%mini.index==0){
                    mini.selected = true;
                }
            }
        }
    }
}
initData();
getselectedAlldata()

//得到文件的名字

