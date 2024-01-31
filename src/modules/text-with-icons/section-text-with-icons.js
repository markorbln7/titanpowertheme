const sections = document.querySelectorAll('.section-text-with-icons');

const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.7
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animation-on');
            const numbers = entry.target.querySelectorAll('.number');
            numbers.forEach(number => updateCount(number)); // Pokretanje animacije brojanja za sve brojeve u sekciji
            observer.unobserve(entry.target); // Prestanak posmatranja kada se sekcija pojavi
        } else {
            entry.target.classList.remove('animation-on');
        }
    });
}, options);

sections.forEach(section => {
    observer.observe(section);
});

// Dodatni Intersection Observer za praćenje gubitka sekcija iz pregleda
const reverseObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            entry.target.classList.remove('animation-on');
        } else {
            entry.target.classList.add('animation-on');
        }
    });
}, { root: null, rootMargin: '0px', threshold: 0.4 });

sections.forEach(section => {
    reverseObserver.observe(section);
});

const updateCount = (el) => {
    const value = parseInt(el.dataset.value);
    const increment = Math.ceil(value / 100);
    let initialValue = 0;

    const increaseCount = setInterval(() => {
        initialValue += increment;

        if (initialValue > value) {
            el.textContent = `${value}`;
            clearInterval(increaseCount);
            return;
        }

        el.textContent = `${initialValue}`;
    }, 10);
};
