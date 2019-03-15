<template>
  <div id="app">
    <section id="practice" class="bg-primary text-white practice">
      <div class="container">
        <div class="row">
          <div class="col-lg-7">
            <web-camera></web-camera>
          </div>
          <div class="col-lg-5">
            <video :src="'static/video/'+currentVideo+'.mp4'" width="100%" controls="controls" poster="../static/img/playvideo.png"></video>
            <div id="radar" style="width:100%;height:200px;"></div>
          </div>
          <div id="time-line" style="width:100%;height:100px;"></div>
        </div>
      </div>
    </section>
    <video-list v-on:change-video="changeVideoSource"></video-list>
    <button @click="updateRadar(randomdata(4))">更新雷达</button>
    <button @click="updateLine(randomdata(4))">更新折线</button>
    <section class="bg-primary text-white mb-0" id="instruct">
      <div class="container">
        <h2 class="text-center text-uppercase text-white">Instructions</h2>
        <hr class="star-light mb-5">
        <div class="row">
          <div class="col-lg-4 ml-auto">
            <p class="lead">使用前务必允许使用camera，点击videos中的任意视频开始学习</p>
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
  export default {
    name: 'app',
    data () {
      return {
        currentVideo: 'cabin',
        currentIndex: 0,
        radarChart: null,
        lineChart: null
      }
    },
    components: {
      WebCamera,
      VideoList
    },
    mounted () {
      this.radarChart = this.drawRadar()
      this.lineChart = this.drawLine()
    },
    methods: {
      randomdata: function (length) {
        let rd = []
        for (let i = 0; i < length; i++) {
          rd.push(Math.random() * 100)
        }
        return rd
      },
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
                  value: this.randomdata(4)
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
        return radarChart
      },
      drawLine: function () {
        let lineChart = this.$echarts.init(document.getElementById('time-line'))
        let lineOption = {
          tooltip: {
            trigger: 'axis'
          },
          dataZoom: [
            {
              id: 'dataZoomX',
              type: 'inside',
              xAxisIndex: [0],
              filterMode: 'filter'
            }
          ],
          grid: {
            top: '20%',
            left: '10%',
            bottom: '25%',
            right: '10%'
          },
          xAxis: {
            type: 'value',
            max: 'dataMax',
            minInterval: 1,
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
            name: 'accent',
            smooth: true,
            data: [],
            type: 'line',
            color: '#ffee58'
          }, {
            name: 'shape of mouth',
            smooth: true,
            data: [],
            type: 'line',
            color: '#f44336'
          }, {
            name: 'liaison',
            smooth: true,
            data: [],
            type: 'line',
            color: '#039be5'
          }, {
            name: 'pause',
            smooth: true,
            data: [],
            type: 'line',
            color: 'white'
          }]
        }
        lineChart.setOption(lineOption)
        return lineChart
      },
      updateRadar: function (scores) {
        this.radarChart.setOption({
          series: {
            data: [{
              value: scores
            }]
          }
        })
      },
      updateLine: function (scores) {
        for (let i = 0; i < 4; ++i) {
          this.lineChart.appendData({
            seriesIndex: i,
            data: [[this.currentIndex, scores[i]]]
          })
        }
        this.currentIndex++
        this.lineChart.resize()
      }
    }
  }
</script>

<style>
</style>
