document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS (Animate On Scroll) for all pages
    AOS.init({
        duration: 1000,
        once: true, // Animations trigger only once
        offset: 100 // Trigger animations slightly before element is in view
    });

    // Navbar scroll effect (highlight active section and add shrink effect)
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Shrink navbar on scroll
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-shrink');
        } else {
            navbar.classList.remove('navbar-shrink');
        }

        // Highlight active nav link based on section in view
        const sections = document.querySelectorAll('section');
        let current = '';

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});