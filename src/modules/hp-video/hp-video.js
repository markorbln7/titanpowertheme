import './hp-video.css'
const startVideo = document.querySelector('.js-video-start')

startVideo.addEventListener('click', function () {
  const video = document.querySelector('.js-video')
  video.play()
  startVideo.classList.add('mobile-video__poster--hide')
})
