let activateInfo = document.querySelectorAll('.js-info-activate')
let pullBack = document.querySelector('.pull-back')
let skipVideos = document.querySelectorAll('.js-skip-video')
let riseShop = document.querySelector('.rise-shop')
let streamStart = document.querySelector('.stream-start')
let streamOverlay = document.querySelector('.stream-overlay')
console.log(skipVideos, pullBack, activateInfo, 'activateInfosss')

activateInfo.forEach((info) => {
    info.addEventListener('click', (e) => {
            let target = e.target
            console.log(target, 'target')
            let infoParent = target.closest('.tp-shop__wrapper')
            let infoContent = infoParent.querySelector('.tp-shop__list--single__info')
            infoContent.classList.add('active')
            document.querySelector('.pull-back').classList.add('visible')
            console.log(infoParent, infoContent, target, 'infoContent')
    })
})
skipVideos.forEach((skip) => {
    skip.addEventListener('click', (e) => {
        e.stopPropagation()
        console.log(e.target, 'skip clicked')
        var video = document.getElementById("video");
        video.currentTime = e.target.getAttribute('data-video-time');
    })
})
pullBack.addEventListener('click', (e) => {
   document.querySelector('.tp-shop__list--single__info.active').classList.remove('active')
   document.querySelector('.pull-back').classList.remove('visible')
})
riseShop.addEventListener('click', (e) => {
    document.querySelector('.tp-shop').classList.toggle('active')
})
streamStart.addEventListener('click', (e) => {
    document.querySelector('.stream-overlay').classList.add('active')
    video.play()
})
streamOverlay.addEventListener('click', (e) => {
    if (e.target.classList.contains('stream-overlay')) {
        document.querySelector('.stream-overlay').classList.remove('active')
        video.pause()
    }
})