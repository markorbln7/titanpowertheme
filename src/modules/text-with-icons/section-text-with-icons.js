import './section-text-with-icons.css'

const numbersWrapper = document.querySelectorAll('.section-text-with-icons__repeater');

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
    const counters = section.querySelectorAll('.number');
    
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
