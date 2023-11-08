import './treasure.css'
// Set the date we're counting down to
var countDownDate = new Date('Nov 10, 2023 21:00:00').getTime()

// Update the count down every 1 second
var x = setInterval(function () {
  // Get today's date and time
  var now = new Date().getTime()
  // Find the distance between now and the count down date
  var distance = countDownDate - now
  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24))
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  var seconds = Math.floor((distance % (1000 * 60)) / 1000)
  if (days < 10) {
    days = '0' + days
  }
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  if (seconds < 10) {
    seconds = '0' + seconds
  }
  if (hours < 10) {
    hours = '0' + hours
  }

  // Display the result in the element with id="demo"
  document.getElementById('demo').innerHTML = '<div class="number-block">' + days + '<span>days</span>' + '</div>' + '<div class="number-block">' + hours + '<span>hours</span>' + '</div>' + '<div class="number-block">' + minutes + '<span>minutes</span>' + '</div>' + '<div class="number-block">' + seconds + '<span>seconds</span>' + '</div>'
  document.getElementById('demo2').innerHTML = '<div class="number-block">' + days + '<span>days</span>' + '</div>' + '<div class="number-block">' + hours + '<span>hours</span>' + '</div>' + '<div class="number-block">' + minutes + '<span>minutes</span>' + '</div>' + '<div class="number-block">' + seconds + '<span>seconds</span>' + '</div>'

  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x)
    document.getElementById('demo').innerHTML = 'EXPIRED'
    document.getElementById('demo2').innerHTML = 'EXPIRED'
  }
}, 1000)

const imageClickHandlers = document.querySelectorAll('.js-image-click')

imageClickHandlers.forEach((imageClickHandler) => {
  imageClickHandler.addEventListener('click', function () {
    const urlReveal = this.parentNode.querySelector('.js-url-reveal')
    const upperReveal = this.parentNode.querySelector('.js-upper-reveal')
    const video = this.parentNode.querySelector('.video')
    const imageDesktop = this.parentNode.querySelector('.js-image.desktop')
    const imageMobile = this.parentNode.querySelector('.js-image.mobile')
    imageDesktop.classList.add('hide')
    imageMobile.classList.add('hide')
    video.classList.add('reveal')
    video.play()
    setTimeout(() => {
      urlReveal.classList.add('reveal')
      upperReveal.classList.add('reveal')
    }, '2000')
  })
})
