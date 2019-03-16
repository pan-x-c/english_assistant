<template>
  <section class="portfolio" id="portfolio">
    <div class="container">
      <h2 class="text-center text-uppercase text-secondary mb-0">Videos</h2>
      <hr class="star-dark mb-5">
      <div class="row">
        <div v-for="item in videoList"  class="col-md-4 col-xl-2 col-6 video-item" :key=item>
          <a @click="changeVideo(item)">
            <div class="portfolio-item-caption d-flex position-absolute h-100 w-100">
              <div class="portfolio-item-caption-content my-auto w-100 text-center text-white">
                <p>{{item}}</p>
                <i class="fas fa-play-circle fa-3x"></i>
              </div>
            </div>
          <img class="img-fluid" :src="'static/img/portfolio/' + item + '.png'" alt="">
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  var videoData = []
  for (var i = 0; i < 40; i += 1) {
    videoData.push('video' + i)
  }

  export default {
    name: 'VideoList',
    data () {
      return {
        videoList: [
          'learn_1', 'test_1', 'learn_2', 'test_2', 'learn_3', 'test_3'
        ],
        currentVideo: ''
      }
    },
    methods: {
      changeVideo (item) {
        this.currentVideo = item
        this.$emit('change-video', this.currentVideo)
      }
    }
  }
</script>

<style scoped>
  .video-item {
    cursor: pointer;
  }
  .video-item p {
    margin: 0;
    padding: 0;
  }
  .portfolio-item-caption-content {
    margin-right: 30px;
  }
</style>
