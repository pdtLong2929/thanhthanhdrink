export function initHeroSlider() {
    const slides = document.querySelectorAll('#hero-slides-wrapper .banner-slide');
    const dots = document.querySelectorAll('#hero-dots .dot');
    if (!slides.length) return;

    let currentSlide = 0;
    const totalSlides = slides.length;
    let slideInterval;

    function goToSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));

        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % totalSlides);
    }

    function startSlide() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function stopSlide() {
        clearInterval(slideInterval);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopSlide();
            goToSlide(index);
            startSlide();
        });
    });

    startSlide();
}

export function initAboutSlider() {
    const slides = document.querySelectorAll('#about-slides-wrapper .banner-slide');
    const texts = document.querySelectorAll('.about-text-slide');
    const dots = document.querySelectorAll('#about-dots .dot');
    if (!slides.length) return;

    let currentSlide = 0;
    const totalSlides = slides.length;
    let slideInterval;

    function goToSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        if (texts.length) texts.forEach(t => t.classList.remove('active'));

        slides[index].classList.add('active');
        dots[index].classList.add('active');
        if (texts.length && texts[index]) texts[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % totalSlides);
    }

    function startSlide() {
        slideInterval = setInterval(nextSlide, 6000);
    }

    function stopSlide() {
        clearInterval(slideInterval);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopSlide();
            goToSlide(index);
            startSlide();
        });
    });

    startSlide();
}

export function initScrollspy() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navigation a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        if (scrollY < 100) {
            navLinks.forEach(link => link.classList.remove('active'));
            const homeLink = document.querySelector('.navigation a[href="#home"]');
            if(homeLink) homeLink.classList.add('active');
        }
    });
}
