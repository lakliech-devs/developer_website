document.addEventListener('DOMContentLoaded', () => {
    AOS.init({ duration: 1000 });
    
    console.log('EmailJS initialized');

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            const name = contactForm.querySelector('#name').value.trim();
            const email = contactForm.querySelector('#email').value.trim();
            const subject = contactForm.querySelector('#subject').value.trim();
            const budget = contactForm.querySelector('#budget').value.trim();
            const message = contactForm.querySelector('#message').value.trim();

            if (!name || !email || !message) {
                alert('Please fill in Name, Email, and Message.');
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
                return;
            }

            const templateParams = {
                from_name: name,
                from_email: email,
                subject: subject || 'No Subject',
                budget: budget || 'Not specified',
                message: message,
                timestamp: new Date().toISOString()
            };

            // Using EmailJS v4 syntax
            emailjs.send('service_seowwan', 'template_aazujdb', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    alert('Thank you! Your message has been sent successfully.');
                    contactForm.reset();
                })
                .catch(function(error) {
                    console.error('FAILED...', error);
                    alert('Failed to send message: ' + (error.text || 'Unknown error'));
                })
                .finally(function() {
                    // Re-enable button
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                });
        });
    }
});