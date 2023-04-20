import type { EChartOption } from 'echarts'

let percent = 0.8 //percent
let current = 270 * percent // 当前用量 = all * percent
let all = 270 //彩色部分总大小，自定义，和最下方bottom的值一起决定环形图的角度

interface IEchartProps {
  percent: number;
  current: number;
  all: number;
}

let myData: IEchartProps = {
  percent: 0,
  current: 0,
  all: 0
}

//工地好评率

// console.log('favorableRate.value', favorableRate.value)

export const circleOptions: EChartOption = {
  series: [
    {
      type: 'pie',
      label: {
        show: false
      },
      center: ['50%', '50%'],
      radius: ['60%', '70%'],
      startAngle: 0, //起始角度，根据实际需要调节
      data: [
        {
          name: '用量',
          value: current,
          label: {
            show: true,
            position: 'center',
            // formatter: (percent ? (percent * 100).toFixed(2) : 0) + '%',
            formatter: `${percent * 100}%`,
            textStyle: {
              baseline: 'bottom',
              fontSize: 18,
              color: '#ffffff'
            }
          },
          labelLine: {
            show: false
          },
          itemStyle: {

            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(82, 197, 255)' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(103, 194, 58)' // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          }
        },
        {
          name: 'rest', // 实际显示部分是总量-用量
          value: all - current,
          itemStyle: { color: 'rgba(64,158,255,0.1)' }
        },
        {
          name: 'bottom',
          value: 0,//底部透明部分的颜色，看实际情况，如果需要的是半圆图，这个透明部分的value值就变成和all相同的值，以此类推，可以自己调节value的大小
          itemStyle: { color: 'transparent' }
        }
      ] as any
    }
  ]
}
export const circleOptions2: EChartOption = {
  series: [
    {
      type: 'pie',
      label: {
        show: false
      },
      center: ['50%', '50%'],
      radius: ['85%', '95%'],
      startAngle: 0, //起始角度，根据实际需要调节
      data: [
        {
          name: '用量',
          value: current,
          label: {
            show: true,
            position: 'center',
            // formatter: (percent ? (percent * 100).toFixed(2) : 0) + '%',
            formatter: `85%`,
            textStyle: {
              baseline: 'bottom',
              fontSize: 18,
              color: '#ffffff'
            }
          },
          labelLine: {
            show: false
          },
          itemStyle: {

            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(64, 158, 255, 0)' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(64, 158, 255,0.99)' // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          }
        },
        {
          name: 'rest', // 实际显示部分是总量-用量
          value: all - current,
          itemStyle: { color: 'rgba(64,158,255,0.1)' }
        },
        {
          name: 'bottom',
          value: 0,//底部透明部分的颜色，看实际情况，如果需要的是半圆图，这个透明部分的value值就变成和all相同的值，以此类推，可以自己调节value的大小
          itemStyle: { color: 'transparent' }
        }
      ] as any
    }
  ]
}

export const circleOptions3: EChartOption = {
  series: [
    {
      type: 'pie',
      label: {
        show: false
      },
      center: ['50%', '50%'],
      radius: ['85%', '95%'],
      startAngle: 0, //起始角度，根据实际需要调节
      data: [
        {
          name: '用量',
          value: current,
          label: {
            show: true,
            position: 'center',
            // formatter: (percent ? (percent * 100).toFixed(2) : 0) + '%',
            formatter: `85%`,
            textStyle: {
              baseline: 'bottom',
              fontSize: 18,
              color: '#ffffff'
            }
          },
          labelLine: {
            show: false
          },
          itemStyle: {

            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: ' rgba(103, 194, 58, 0)' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(103, 194, 58, 0.99)' // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          }
        },
        {
          name: 'rest', // 实际显示部分是总量-用量
          value: all - current,
          itemStyle: { color: 'rgba(64,158,255,0.1)' }
        },
        {
          name: 'bottom',
          value: 0,//底部透明部分的颜色，看实际情况，如果需要的是半圆图，这个透明部分的value值就变成和all相同的值，以此类推，可以自己调节value的大小
          itemStyle: { color: 'transparent' }
        }
      ] as any
    }
  ]
}

//工地好评率
export const semicircleOptions: EChartOption = {
  series: [
    {
      type: 'pie',
      label: {
        show: false
      },
      center: ['50%', '50%'],
      radius: ['70%', '80%'],
      startAngle: 180, //起始角度，根据实际需要调节
      data: [
        {
          name: '用量',
          value: myData.current,
          label: {
            show: true,
            position: 'center',
            // formatter: (percent ? (percent * 100).toFixed(2) : 0) + '%',
            formatter: `${myData.percent}%`,
            textStyle: {
              baseline: 'bottom',
              fontSize: 18,
              color: '#ffffff'
            }
          },
          labelLine: {
            show: false
          },
          itemStyle: {

            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(64,158,255,0.1)' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(64,158,255,1)' // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          }
        },
        {
          name: 'rest', // 实际显示部分是总量-用量
          value: myData.all - myData.current,
          itemStyle: { color: 'rgba(64,158,255,0.1)' }
        },
        {
          name: 'bottom',
          value: 270,//底部透明部分的颜色，看实际情况，如果需要的是半圆图，这个透明部分的value值就变成和all相同的值，以此类推，可以自己调节value的大小
          itemStyle: { color: 'transparent' }
        }
      ] as any
    }
  ]
}


export const pieOptions: EChartOption = {
  title: {
    text: '用户访问来源',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
  },
  series: [{
    name: '用户访问来源',
    type: 'pie',
    radius: '55%',
    center: ['50%', '60%'],
    data: [
      { value: 0, name: '直接访问' },
      { value: 0, name: '邮件营销' },
      { value: 0, name: '联盟广告' },
      { value: 0, name: '视频广告' },
      { value: 0, name: '搜索引擎' }
    ],
    itemStyle: {
      emphasis: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
  }]
}

export const barOptions: EChartOption = {
  title: {
    text: '每周用户活跃量',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    axisTick: {
      alignWithLabel: true
    }
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    name: '活跃量',
    data: [0, 0, 0, 0, 0, 0, 0],
    type: 'bar'
  }]
}

//echarts提示框组件，需要自取

// tooltip ={                                  //提示框组件
//
//   trigger:'item',                        //触发类型,'item'数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。 'axis'坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。
//
//   triggerOn:"mousemove",                  //提示框触发的条件,'mousemove'鼠标移动时触发。'click'鼠标点击时触发。'mousemove|click'同时鼠标移动和点击时触发。'none'不在 'mousemove' 或 'click' 时触发
//
//   showContent:true,                      //是否显示提示框浮层
//
//   alwaysShowContent:true,                //是否永远显示提示框内容
//
//   showDelay:0,                            //浮层显示的延迟，单位为 ms
//
//   hideDelay:100,                          //浮层隐藏的延迟，单位为 ms
//
//   enterable:false,                        //鼠标是否可进入提示框浮层中
//
//   confine:false,                          //是否将 tooltip 框限制在图表的区域内
//
//   transitionDuration:0.4,                //提示框浮层的移动动画过渡时间，单位是 s,设置为 0 的时候会紧跟着鼠标移动
//
//   position:['50%','50%'],                //提示框浮层的位置，默认不设置时位置会跟随鼠标的位置,[10, 10],回掉函数，inside鼠标所在图形的内部中心位置，top、left、bottom、right鼠标所在图形上侧，左侧，下侧，右侧，
//
//   formatter:"{b0}: {c0}<br />{b1}: {c1}",//提示框浮层内容格式器，支持字符串模板和回调函数两种形式,模板变量有 {a}, {b}，{c}，{d}，{e}，分别表示系列名，数据名，数据值等
//
//   backgroundColor:"transparent",          //标题背景色
//
//   borderColor:"#ccc",                    //边框颜色
//
//   borderWidth:0,                          //边框线宽
//
//   padding:5,                              //图例内边距，单位px  5  [5, 10]  [5,10,5,10]
//
//   textStyle:mytextStyle,                  //文本样式
//
// };
import { kunming } from './kunming'
import { yunnan } from './yunnan'
import echarts from 'echarts'
import moment from 'moment'

echarts.registerMap('yunnan', yunnan)
echarts.registerMap('kunming', kunming)

export const cityOptions: EChartOption = {

  tooltip: {
    trigger: 'item',
    hideDelay: 800,
    // alwaysShowContent:true,                //是否永远显示提示框内容
    // 背景色
    backgroundColor: `rgba(242, 170, 61, 0.6)`,
    // triggerOn: 'click',   //提示框触发的条件,'mousemove'鼠标移动时触发。'click'鼠标点击时触发。'mousemove|click'同时鼠标移动和点击时触发。'none'不在 'mousemove' 或 'click' 时触发
    formatter: (params: any) => {
      // console.log(params)
      return `<div>
                <div>${params.name}</div>
                <div style="font-size: 14px;font-weight: bold;">【工人】张三因未带安全帽被罚款</div>
                <div style="font-size: 12px;color: rgba(255, 255, 255, 0.6)">云纺国际商厦</div>
                <div style="font-size: 12px;color: rgba(255, 255, 255, 0.6)">${moment(new Date()).format('YYYY-MM-DD HH:mm')}</div>
             </div>`
    }
  },
  // geo: {
  //   map: `yunnan`,
  //   zoom: 1.1,
  //   aspectScale: 0.75,
  //   roam: false,
  //   label: {
  //     show: false,
  //     color: 'rgba(255, 255, 255, 0.6)',
  //     fontSize: 8
  //   },
  //   scaleLimit: { //滚轮缩放的极限控制
  //     min: 1.1,
  //     max: 2 //可以放大几倍
  //   },
  //   itemStyle: {
  //     normal: {
  //       areaColor: `rgba(16, 42, 77, 0.5)`,
  //       shadowColor: `#337495`,
  //       shadowOffsetX: 1,
  //       shadowOffsetY: 5,
  //       borderColor: 'rgba(255, 255, 255, 0.3)',
  //       borderWidth: 1,
  //       shadowBlur: 1
  //     },
  //     emphasis: {
  //       label: {
  //         show: true
  //       }
  //     }
  //   }
  // },
  series: [
    {
      name: '城市地图',
      type: 'map',
      map: 'yunnan',
      // mapType: 'kunming', //
      label: {
        show: false,
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 8
      },
      zoom: 1.1, //当前视角的缩放比例
      roam: false, //是否开启平游或缩放
      scaleLimit: { //滚轮缩放的极限控制
        min: 1.1,
        max: 2 //可以放大几倍
      },
      itemStyle: {
        normal: {
          areaColor: `rgba(16, 42, 77, 0.5)`,
          shadowColor: `#337495`,
          shadowOffsetX: 1,
          shadowOffsetY: 5,
          borderColor: 'rgba(255, 255, 255, 0.3)',
          borderWidth: 1,
          shadowBlur: 1
        },
        emphasis: {
          label: {
            show: true
          },
          borderWidth: .5,
          borderColor: '#000',
          areaColor: '#fff'
        }
      }
    }
  ] as any
}
