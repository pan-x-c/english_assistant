<template>
  <div id="app">
    <section id="practice" class="bg-primary text-white practice">
      <div class="container">
        <div class="row">
          <div class="col-lg-7">
            <web-camera></web-camera>
          </div>
          <div class="col-lg-5">
            <video :src="'static/video/'+currentVideo+'.mp4'" width="100%" controls="controls" ></video>
            <div id="radar" style="width:100%;height:200px;"></div>
          </div>
          <div id="time-line" style="width:100%;height:100px;"></div>
        </div>
      </div>
    </section>
    <video-list v-on:change-video="changeVideoSource"></video-list>

    <section class="bg-primary text-white mb-0" id="instruct">
      <div class="container">
        <h2 class="text-center text-uppercase text-white">Instructions</h2>
        <hr class="star-light mb-5">
        <div class="row">
          <div class="col-lg-4 ml-auto">
            <p class="lead">使用前务必允许使用camera，点击video list中的任意视频开始学习</p>
          </div>
          <div class="col-lg-4 mr-auto">
            <p class="lead">将摄像头对准面部，保证摄像头能够拍摄到完整的嘴型</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>


<script>
  import WebCamera from '@/components/WebCamera'
  import VideoList from '@/components/VideoList'
  function randomdata (length) {
    let rd = []
    for (let i = 0; i < length; i++) {
      rd.push(Math.random() * 100)
    }
    return rd
}
  export default {
    name: 'app',
    data () {
      return {
        currentVideo: ''
      }
    },
    components: {
      WebCamera,
      VideoList
    },
    mounted () {
      this.drawRadar()
      this.drawLine()
    },
    methods: {
      changeVideoSource: function (name) {
        this.currentVideo = name
      },
      drawRadar: function () {
        let radarChart = this.$echarts.init(document.getElementById('radar'))
        let radarOption = {
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            top: '10%',
            left: 0,
            bottom: '10%',
            right: 0
          },
          radar: [
            {
              indicator: [
                {text: 'accent', max: 100},
                {text: 'shape of mouth', max: 100},
                {text: 'liaison', max: 100},
                {text: 'pause', max: 100}
              ],
              radius: '60%',
              name: {
                textStyle: {
                  color: 'rgb(255, 255, 255)'
                }
              }
            }
          ],
          series: [
            {
              type: 'radar',
              color: {
                type: 'radial',
                x: 0.5,
                y: 0.5,
                r: 0.5,
                colorStops: [{
                  offset: 0, color: 'red' // 0% 处的颜色
                }, {
                  offset: 1, color: 'blue' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              },
              data: [
                {
                  itemStyle: {normal: {areaStyle: {type: 'default'}}},
                  value: randomdata(4)
                }
              ],
              symbol: 'none',
              itemStyle: {
                normal: {
                  color: 'white'
                }
              },
              areaStyle: {
                normal: {
                  opacity: 0.5
                }
              }
            }
          ]
        }
        radarChart.setOption(radarOption)
      },
      drawLine: function () {
        let lineChart = this.$echarts.init(document.getElementById('time-line'))
        let lineOption = {
          grid: {
            top: '20%',
            left: '10%',
            bottom: '25%',
            right: '10%'
          },
          xAxis: {
            type: 'category',
            data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            nameTextStyle: {
              color: 'white'
            },
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: '#fff'
              }
            }
          },
          yAxis: {
            type: 'value',
            nameTextStyle: {
              color: 'white'
            },
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: '#fff'
              }
            },
            max: 101
          },
          series: [{
            data: randomdata(10),
            type: 'line',
            color: '#ffee58'
          }, {
            data: randomdata(10),
            type: 'line',
            color: '#f44336'
          }, {
            data: randomdata(10),
            type: 'line',
            color: '#039be5'
          }, {
            data: randomdata(10),
            type: 'line',
            color: 'white'
          }]
        }
        lineChart.setOption(lineOption)
      }
    }
  }
</script>

<style>


</style>
