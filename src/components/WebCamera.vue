<template>
  <div>
    <video id="video" width="100%" height="75%" controls="controls" @click.once="camera" poster="../../static/img/webcamera.png">

    </video>
  </div>
</template>

<script>
  export default {
    name: 'WebCamera',
    // mounted () {
    //   this.camera()
    // },
    methods: {
      camera: function () {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||
          navigator.msGetUserMedia
        window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL
        if (!navigator.getUserMedia) {
          alert('不支持')
        } else {
          navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
          }).then(stream => {
            const video = document.querySelector('#video')
            video.srcObject = stream
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>
