import {
  addClass
} from 'lib/dom'

export default (el) => {
  console.log(el)
  const video = el.querySelector('.js-video')

  if (!video) return
  const src = window.innerWidth > 768 ? video.getAttribute('data-src') : video.getAttribute('data-src-mobile')
  video.setAttribute('src', src)
  addClass('is-loaded', el)
}
