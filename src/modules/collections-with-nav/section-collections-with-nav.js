import './section-collections-with-nav.css'
document.addEventListener('DOMContentLoaded', function() {
    const collectionLinks = document.querySelectorAll('.collection-link');
  
    collectionLinks.forEach(link => {
      link.addEventListener('click', function(event) {
        event.preventDefault();

        collectionLinks.forEach(link => {
          link.closest('li').classList.remove('active');
        });
  
        this.closest('li').classList.add('active');
  
        const targetSection = document.querySelector(`${this.getAttribute('href')}`);
        console.log(targetSection);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  });
  