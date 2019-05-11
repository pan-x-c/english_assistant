<template>
  <div id="app">
    <!-- Modal -->
    <div
      class="modal fade"
      id="score-modal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Your Score: {{finalScore}}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">suggestion: {{suggest}}</div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    <nav class="navbar navbar-expand-lg bg-secondary fixed-top text-uppercase" id="mainNav">
      <div class="container">
        <a class="navbar-brand js-scroll-trigger" href="#page-top">
          <img src="static/img/logo.png">
        </a>
        <button
          class="navbar-toggler navbar-toggler-right text-uppercase bg-primary text-white rounded"
          type="button"
          data-toggle="collapse"
          data-target="#navbarResponsive"
          aria-controls="navbarResponsive"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          Menu
          <i class="fas fa-bars"></i>
        </button>
        <div class="collapse navbar-collapse" id="navbarResponsive">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item mx-0 mx-lg-1">
              <a
                class="nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger active"
                href="#practice"
              >Practice</a>
            </li>
            <li class="nav-item mx-0 mx-lg-1">
              <a
                class="nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger"
                href="#portfolio"
              >Videos</a>
            </li>
            <li class="nav-item mx-0 mx-lg-1">
              <a class="nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger" href="#instruct">Help</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="copyright py-4 text-center text-white" style="visibility:hidden;">
      <div class="container">placeholder</div>
    </div>
    <section id="practice" class="bg-primary text-white practice">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <button
              class="btn btn-outline-light ea-btn col-lg-4"
              :class="playing? 'disabled':''"
              @click="onPlay($event)"
            >Start rating</button>
            <button
              class="btn btn-outline-light ea-btn col-lg-4"
              :class="playing? '':'disabled'"
              @click="onStop($event)"
            >end rating</button>
            <button
              class="btn btn-outline-light ea-btn col-lg-4"
              @click="clearRate($event)"
            >Clear rate</button>
          </div>
          <div class="col-lg-8">
            <video
              :src="'static/video/'+currentVideo+'.mp4'"
              width="100%"
              id="video"
              controls="controls"
              @ended="onEnd($event)"
              @pause="onStop($event)"
              @play="onPlay($event)"
              poster="../static/img/playvideo.png"
            ></video>
          </div>
          <div class="col-lg-4">
            <video id="cam" width="100%" autoplay poster="../../static/img/webcamera.png"></video>
            <div id="radar" style="gitwidth:100%;height:200px;"></div>
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
            <p class="lead">使用前务必允许网站使用camera，点击videos中的任意视频开始学习。使用过程中将摄像头对准面部，保证摄像头能够拍摄到完整的嘴型</p>
          </div>
          <div class="col-lg-4 mr-auto">
            <p class="lead">learn类型的视频中。test类型视频中会提取对应的learn类型视频的关键语句进行重复性测试，每个句子重复三遍</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>


<script>
import VideoList from "@/components/VideoList";
// import func from './vue-temp/vue-editor-bridge'

export default {
  name: "app",
  data() {
    return {
      currentVideo: "learn_1",
      currentIndex: 0,
      radarChart: null,
      lineChart: null,
      playing: false,
      radarOption: null,
      lineOption: null,
      time_in: 500,
      end: false,
      finalScore: 0,
      suggest: "口型不准",
    };
  },
  computed: {
    videoType() {
      return this.currentVideo.split("_")[0];
    }
  },
  components: {
    VideoList
  },
  mounted: async function() {
    this.radarChart = this.drawRadar();
    this.lineChart = this.drawLine();
    await this.$AI.nets.ssdMobilenetv1.load("/static/weights");
    await this.$AI.loadFaceLandmarkModel("/static/weights");
    this.camera();
  },
  methods: {
    randomdata: function(length) {
      let rd = [];
      for (let i = 0; i < length; i++) {
        rd.push(Math.random() * 100);
      }
      return rd;
    },
    clearRate: function(event) {
      this.radarChart.clear();
      this.lineChart.clear();
      this.radarChart.setOption(this.radarOption);
      this.lineChart.setOption(this.lineOption);
      this.currentIndex = 0;
    },
    changeVideoSource: function(name) {
      this.currentVideo = name;
    },
    calFinalScore() {
      if (!this.radarChart) {
        return 0;
      }
      let scores = this.radarChart.getOption().series[0].data[0].value;
      this.finalScore = Math.round(
        (scores[0] + scores[1] + scores[2] + scores[3]) * 2.5
      );
    },
    drawRadar: function() {
      let radarChart = this.$echarts.init(document.getElementById("radar"));
      this.radarOption = {
        tooltip: {
          trigger: "axis"
        },
        grid: {
          top: "10%",
          left: 0,
          bottom: "10%",
          right: 0
        },
        radar: [
          {
            indicator: [
              { text: "accent", max: 1 },
              { text: "shape of mouth", max: 1 },
              { text: "liaison", max: 1 },
              { text: "pause", max: 1 }
            ],
            radius: "60%",
            name: {
              textStyle: {
                color: "rgb(255, 255, 255)"
              }
            }
          }
        ],
        series: [
          {
            type: "radar",
            color: {
              type: "radial",
              x: 0.5,
              y: 0.5,
              r: 0.5,
              colorStops: [
                {
                  offset: 0,
                  color: "red" // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "blue" // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            },
            data: [
              {
                itemStyle: { normal: { areaStyle: { type: "default" } } },
                value: [0.5, 0.5, 0.5, 0.5]
              }
            ],
            symbol: "none",
            itemStyle: {
              normal: {
                color: "white"
              }
            },
            areaStyle: {
              normal: {
                opacity: 0.5
              }
            }
          }
        ]
      };
      radarChart.setOption(this.radarOption);
      return radarChart;
    },
    drawLine: function() {
      let lineChart = this.$echarts.init(document.getElementById("time-line"));
      this.lineOption = {
        tooltip: {
          trigger: "axis"
        },
        dataZoom: [
          {
            id: "dataZoomX",
            type: "inside",
            xAxisIndex: [0],
            filterMode: "filter"
          }
        ],
        grid: {
          top: "10%",
          left: "3%",
          bottom: "25%",
          right: "3%",
          show: false
        },
        xAxis: {
          type: "value",
          max: "dataMax",
          minInterval: 1,
          nameTextStyle: {
            color: "white"
          },
          axisLine: {
            lineStyle: {
              type: "solid",
              color: "#fff"
            }
          },
          splitLine: {
            lineStyle: {
              color: "#fff"
            }
          }
        },
        yAxis: {
          type: "value",
          nameTextStyle: {
            color: "white"
          },
          axisLine: {
            lineStyle: {
              type: "solid",
              color: "#fff"
            }
          },
          splitLine: {
            lineStyle: {
              color: "#fff"
            }
          },
          max: 1.0
        },
        series: [
          {
            name: "accent",
            smooth: true,
            data: [],
            type: "line",
            color: "#ffee58",
            animation: false
          },
          {
            name: "shape of mouth",
            smooth: true,
            data: [],
            type: "line",
            color: "#f44336",
            animation: false
          },
          {
            name: "liaison",
            smooth: true,
            data: [],
            type: "line",
            color: "#039be5",
            animation: false
          },
          {
            name: "pause",
            smooth: true,
            data: [],
            type: "line",
            color: "white",
            animation: false
          }
        ]
      };
      lineChart.setOption(this.lineOption);
      return lineChart;
    },
    updateRadar: function(scores) {
      const old_scores = this.radarChart.getOption().series[0].data[0].value
      for (let i=0;i<4;++i) {
        scores[i] = scores[i] * 0.2 + old_scores[i] * 0.8
      }
      this.radarChart.setOption({
        series: {
          data: [
            {
              value: scores
            }
          ]
        }
      });
    },
    updateLine: function(scores) {
      for (let i = 0; i < 4; ++i) {
        this.lineChart.appendData({
          seriesIndex: i,
          data: [[this.currentIndex, scores[i]]]
        });
      }
      this.currentIndex++;
      this.lineChart.resize();
    },
    camera: async function() {
      navigator.getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;
      window.URL =
        window.URL || window.webkitURL || window.mozURL || window.msURL;
      if (!navigator.getUserMedia) {
        alert("不支持");
      } else {
        navigator.mediaDevices
          .getUserMedia({
            video: true,
            audio: true
          })
          .then(stream => {
            const video = document.querySelector("#cam");
            video.srcObject = stream;
          });
      }
    },
    onPlay: function(event) {
      console.log(this.$AI);
      if (this.$AI.nets.ssdMobilenetv1.params === undefined) {
        alert("模型未加载");
        return;
      }
      this.playing = true;
      setTimeout(this.getResult(), this.time_in);
      this.end = false;
    },
    onStop: function(event) {
      this.playing = false;
    },
    onEnd: function(event) {
      this.onStop(event);
      this.calFinalScore();
      this.end = true;
      $("#score-modal").modal("show");
    },
    getResult: async function() {
      const videoELWebCam = document.querySelector("#cam");
      const videoEL = document.querySelector("#video");
      const resultWebCam = await this.$AI
        .detectSingleFace(
          videoELWebCam,
          new this.$AI.SsdMobilenetv1Options({ minConfidence: 0.5 })
        )
        .withFaceLandmarks();
      const result = await this.$AI
        .detectSingleFace(
          videoEL,
          new this.$AI.SsdMobilenetv1Options({ minConfidence: 0.5 })
        )
        .withFaceLandmarks();
      if (result !== undefined && resultWebCam !== undefined) {
        const mark1 = this.getCosDistance(
          this.getFeature(result.landmarks, 15, 20),
          this.getFeature(resultWebCam.landmarks, 15, 20)
        );
        const mark2 = this.getCosDistance(
          this.getFeature(result.landmarks, 15, 30),
          this.getFeature(resultWebCam.landmarks, 15, 30)
        );
        const mark3 = this.getCosDistance(
          this.getFeature(result.landmarks, 15, 10),
          this.getFeature(resultWebCam.landmarks, 15, 10)
        );
        const mark4 = this.getCosDistance(
          this.getFeature(result.landmarks, 15, 50),
          this.getFeature(resultWebCam.landmarks, 15, 50)
        );
        const data = [Math.sqrt(mark1), Math.sqrt(mark2), Math.sqrt(mark3), Math.sqrt(mark4)]
        this.updateLine(data);
        this.updateRadar(data);
      }
      if (this.playing === true) {
        setTimeout(this.getResult(), this.time_in);
      }
    },
    getCosDistance: function(a, b) {
      const alen = Math.sqrt(a[0] * a[0] + a[1] * a[1]);
      const blen = Math.sqrt(b[0] * b[0] + b[1] * b[1]);
      const ablen =
        (a[0] / alen - b[0] / blen) * (a[0] / alen - b[0] / blen) +
        (a[1] / alen - b[1] / blen) * (a[1] / alen - b[1] / blen);
      return Math.sqrt(ablen);
    },
    getFeature: function(landmarks, indexA, indexB) {
      const imgH = landmarks.imageHeight;
      const imgW = landmarks.imageWidth;
      const basePoint = [
        landmarks.positions[indexA].x / imgW,
        landmarks.positions[indexA].y / imgH
      ];
      const feature1Point = [
        landmarks.positions[indexB].x / imgW,
        landmarks.positions[indexB].y / imgH
      ];
      return [basePoint[0] - feature1Point[0], basePoint[1] - feature1Point[1]];
    }
  }
};
</script>

<style>
.ea-btn {
  width: 90%;
  float: left;
}

@media (max-width:790px){
  #cam{
    width: 100%;
    height: 180px;
    box-sizing: border-box;
    overflow: hidden;
  }
}
</style>
