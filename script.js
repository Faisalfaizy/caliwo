document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // 2. Navbar Scroll Effect (Glassmorphism solidifies slightly on scroll)
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Scroll Animations using Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.slide-up').forEach((el) => {
        observer.observe(el);
    });

    // 4. Smooth Scrolling for Anchor Links (polyfill/enhancement)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Form Submission Handling
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            // Developer Friendly Fallback if Access Key is still default
            if (object.access_key === 'YOUR_ACCESS_KEY_HERE') {
                console.warn("Web3Forms access key is set to 'YOUR_ACCESS_KEY_HERE'. Please obtain a key from web3forms.com to receive emails.");
                setTimeout(() => {
                    contactForm.reset();
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                    
                    formSuccess.textContent = "Thank you! Enquiry received. (Note: Please set your Web3Forms access key in index.html to receive actual emails).";
                    formSuccess.style.borderColor = "var(--accent-color)";
                    formSuccess.classList.remove('hidden');
                    
                    setTimeout(() => {
                        formSuccess.classList.add('hidden');
                    }, 8000);
                }, 1200);
                return;
            }

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let jsonResponse = await response.json();
                if (response.status === 200) {
                    formSuccess.textContent = "Thank you! Your enquiry has been received.";
                    formSuccess.style.borderColor = "var(--accent-color)";
                    formSuccess.classList.remove('hidden');
                    contactForm.reset();
                } else {
                    formSuccess.textContent = jsonResponse.message || "Something went wrong. Please try again.";
                    formSuccess.style.borderColor = "#ff4a4a";
                    formSuccess.classList.remove('hidden');
                }
            })
            .catch(error => {
                console.error(error);
                formSuccess.textContent = "Error sending message. Please check your network connection.";
                formSuccess.style.borderColor = "#ff4a4a";
                formSuccess.classList.remove('hidden');
            })
            .then(() => {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                setTimeout(() => {
                    formSuccess.classList.add('hidden');
                }, 5000);
            });
        });
    }

    // 6. Lightbox Modal Gallery triggers
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');

    if (lightboxModal && lightboxImg) {
        // Add click listener to all work items
        document.querySelectorAll('.work-item').forEach(item => {
            item.addEventListener('click', () => {
                const src = item.getAttribute('data-src');
                const alt = item.querySelector('img').alt;
                if (src) {
                    lightboxImg.src = src;
                    lightboxImg.alt = alt;
                    lightboxModal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Stop page scrolling
                }
            });
        });

        // Close lightbox button click
        if (lightboxClose) {
            lightboxClose.addEventListener('click', () => {
                lightboxModal.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            });
        }

        // Close lightbox when clicking outside the image
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                lightboxModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
                lightboxModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // 7. Package Buttons Enquiry Auto-fill Handlers
    document.querySelectorAll('.btn-package').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const packageName = button.getAttribute('data-package');
            const messageTextarea = document.getElementById('message');
            const enquirySection = document.getElementById('enquiry');
            
            if (messageTextarea && packageName) {
                messageTextarea.value = `Hi CALIWO, I am interested in enquiring about your ${packageName} package. Please share more details.`;
            }
            
            if (enquirySection) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = enquirySection.getBoundingClientRect().top + window.scrollY - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
