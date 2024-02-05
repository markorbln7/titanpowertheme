import './section-faq.css'

const accordions = document.querySelectorAll('.faq__accordion');

if (accordions && accordions.length) {
    accordions.forEach(accordion => {
        const accordionBtn = accordion.querySelector('.faq__accordion-header');
        accordionBtn.addEventListener('click', () => {
            toggleAccordion(accordion);
        })
    })
}

function toggleAccordion(accordion) {
    const panel = accordion.querySelector('.faq__accordion-panel');
    accordion.classList.toggle('open-accordion');

    panel.style.maxHeight = panel.scrollHeight + 'px';
    !accordion.classList.contains('open-accordion') 
        ? panel.style.maxHeight = null 
        : panel.style.maxHeight = panel.scrollHeight + 'px';      
}