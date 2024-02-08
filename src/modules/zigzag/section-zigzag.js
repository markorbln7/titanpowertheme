import './section-zigzag.css'

const numbersWrapper = document.querySelectorAll('.zigzag__heading');

const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters(entry.target);
            observer.unobserve(entry.target);
        }
    });
}, options);

numbersWrapper.forEach(section => {
    observer.observe(section);
});

function animateCounters(section) {
    const counters = section.querySelectorAll('.zigzag__number');
    
    counters.forEach(counter => {
        const id = counter.getAttribute('id');
        const start = parseInt(counter.getAttribute('data-start'));
        const end = parseInt(counter.getAttribute('data-end'));
        const duration = parseInt(counter.getAttribute('data-duration'));
        startCounter(id, start, end, duration);
    });
}

function startCounter(id, start, end, duration) {
    let obj = document.getElementById(id),
        current = start,
        range = end - start,
        increment = end > start ? 1 : -1,
        step = Math.abs(Math.floor(duration / range)),
        timer = setInterval(() => {
            current += increment;
            obj.textContent = current;
            if (current == end) {
                clearInterval(timer);
            }
        }, step);
}

const progressBars = document.querySelectorAll('.zigzag__progressbar');

const progressBarsOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
};

const progressbarObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBar = entry.target.querySelector('.zigzag__progressbar-bar');
            const width = parseFloat(progressBar.getAttribute('data-width'));
            progressBar.style.width = `${width}%`;
            observer.unobserve(entry.target);
        }
    });
}, progressBarsOptions);

progressBars.forEach(progressBar => {
    progressbarObserver.observe(progressBar);
});
