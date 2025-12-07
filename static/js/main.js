document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navbar = document.querySelector('.navbar');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Mobile dropdown toggle
    const dropdowns = document.querySelectorAll('.dropdown > a');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parent = dropdown.parentElement;
                parent.classList.toggle('active');
            }
        });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const carousel = document.querySelector('.hero-carousel');
    if (carousel) {
        initCarousel();
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    const serviceCarousel = document.querySelector('.service-carousel');
    if (serviceCarousel) {
        initServiceCarousel();
    }
});

function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    let currentSlide = 0;

    if (slides.length === 0) return;

    slides[0].classList.add('active');

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    setInterval(nextSlide, 6000);

    let touchStartX = 0;
    let touchEndX = 0;

    const carousel = document.querySelector('.hero-carousel');

    if (carousel) {
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            nextSlide();
        }
        if (touchEndX > touchStartX + 50) {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
        }
    }
}

function initServiceCarousel() {
    const slides = document.querySelectorAll('.service-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;

    if (slides.length === 0) return;

    // Show first slide
    slides[0].classList.add('active');

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Optional: Auto-play
    // setInterval(nextSlide, 5000);
}

async function handleContactForm(e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        event_type: document.getElementById('event_type').value,
        event_date: document.getElementById('event_date').value,
        message: document.getElementById('message').value
    };

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
            alert(data.message);
            e.target.reset();
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        alert('Error submitting form. Please try again.');
    }
}

function sendEmail() {
    emailjs.init({
        publicKey: 'Tbj9SyFbfUQnEReIM',
    });
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const event_type = document.getElementById('event_type').value.trim();
    const event_date = document.getElementById('event_date').value.trim();
    const message = document.getElementById('message').value.trim();
    const params = {
        from_name: name,
        from_email: email,
        from_phone: phone,
        from_event_type: event_type,
        from_event_date: event_date,
        message: message,
    };
    emailjs.send('service_5g5krwt', 'template_6auc8dr', params).then(function () {
        alert('Email sent!');
    }).catch(function () {
        alert('Failed to send Email!');
    })
}