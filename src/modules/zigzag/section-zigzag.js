import './section-zigzag.css'

const numbersWrapper = document.querySelectorAll('.zigzag__heading')

const options = {
  root: null,
  rootMargin: '0px',
  threshold: 0.5
}

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters(entry.target)
      observer.unobserve(entry.target)
    }
  })
}, options)

numbersWrapper.forEach(section => {
  observer.observe(section)
})

function animateCounters (section) {
  const counters = section.querySelectorAll('.zigzag__number')

  counters.forEach(counter => {
    const _this = counter
    const id = counter.getAttribute('id')
    const end = parseInt(counter.getAttribute('data-end'))
    let start
    if(end !== 0) {
      start = parseInt(counter.getAttribute('data-start'))
      console.log(start, _this, 'i svasta po nesto')
      _this.textContent = start
    } else {
      start = 0
    }
    const duration = parseInt(counter.getAttribute('data-duration'))
    if(end !== 0) {
      startCounter(id, start, end, duration)
    }
  })
}

function startCounter (id, start, end, duration) {
  const obj = document.getElementById(id)
  let current = start
  const range = end - start
  const increment = end > start ? 1 : -1
  const step = Math.abs(Math.floor(duration / range))
  const timer = setInterval(() => {
    current += increment
    obj.textContent = current
    if (current === end) {
      clearInterval(timer)
    }
  }, step)
}

const progressBars = document.querySelectorAll('.zigzag__progressbar')

const progressBarsOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.5
}

const progressbarObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const progressBar = entry.target.querySelector('.zigzag__progressbar-bar')
      const width = parseFloat(progressBar.getAttribute('data-width'))
      progressBar.style.width = `${width}%`
      observer.unobserve(entry.target)
    }
  })
}, progressBarsOptions)

progressBars.forEach(progressBar => {
  progressbarObserver.observe(progressBar)
})
