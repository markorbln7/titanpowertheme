
import './section-image-tabs.css'

document.addEventListener('DOMContentLoaded', function () {
  const buttons = document.querySelectorAll('.image-tabs__button')
  const imagesWrapper = document.querySelectorAll('.image-tabs__images')
  console.log(imagesWrapper)

  buttons.forEach(function (button) {
    button.addEventListener('click', function (e) {
      const doc = this.parentNode.parentNode.parentNode
      console.log(doc, 'test')
      const panels = doc.querySelectorAll('.image-tabs__panel')
      const images = doc.querySelectorAll('.image-tabs__images figure')
      const tabs = doc.querySelectorAll('.image-tabs__button')
      panels.forEach(function (panel) {
        panel.classList.remove('active')
      })
      images.forEach(function (image) {
        image.classList.remove('active')
      })
      tabs.forEach(function (tab) {
        tab.classList.remove('active')
      })

      const tabNumber = this.getAttribute('data-tab')
      this.classList.add('active')
      const panel = doc.querySelector('.image-tabs__panel[data-content="' + tabNumber + '"]')
      const image = doc.querySelector('.image-tabs__images figure[data-image="' + tabNumber + '"]')
      panel.classList.add('active')
      image.classList.add('active')
    })
  })

  imagesWrapper.forEach(el => {
    el.addEventListener('mouseenter', function () {
      el.classList.add('is-open')
      console.log(el)
    })

    el.addEventListener('mouseleave', function () {
      el.classList.remove('is-open')
    })
  })
})
