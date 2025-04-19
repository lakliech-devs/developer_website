document.addEventListener('DOMContentLoaded', () => {
    // Typed.js for hero
    new Typed('#typed', {
        strings: ['Crafting Mobile Experiences', 'Building Your Dream App', 'Innovating with Flutter'],
        typeSpeed: 50,
        backSpeed: 30,
        loop: true
    });

    // Particles.js for hero background
    particlesJS('particles-js', {
        particles: {
            number: { value: 80 },
            color: { value: '#FFD700' },
            shape: { type: 'circle' },
            opacity: { value: 0.5 },
            size: { value: 3 },
            move: { speed: 2 }
        },
        interactivity: {
            events: {
                onhover: { enable: true, mode: 'repulse' },
                onclick: { enable: true, mode: 'push' }
            }
        }
    });

    // Swiper for apps
    new Swiper('.app-slider', {
        slidesPerView: 1,
        spaceBetween: 20,
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        breakpoints: {
            768: { slidesPerView: 2 },
            992: { slidesPerView: 3 }
        },
        autoplay: {
            delay: 3000
        }
    });

    // Swiper for testimonials
    new Swiper('.testimonial-slider', {
        slidesPerView: 1,
        spaceBetween: 20,
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        autoplay: {
            delay: 5000
        }
    });
});