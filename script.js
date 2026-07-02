document.addEventListener('DOMContentLoaded', () => {
    /* ---------- Smooth scrolling ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const targetId = anchor.getAttribute('href').slice(1);
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    /* ---------- Reveal on scroll (IntersectionObserver) ---------- */
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length) {
        const revealObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const index = Array.from(revealElements).indexOf(el);
                    setTimeout(() => el.classList.add('visible'), index * 100);
                    obs.unobserve(el);
                }
            });
        }, { threshold: 0.1 });
        revealElements.forEach(el => revealObserver.observe(el));
    }

    /* ---------- Stat counters ---------- */
    const statElements = document.querySelectorAll('.stat-number');
    if (statElements.length) {
        const counterObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.target, 10) || 0;
                    const duration = 2000;
                    let start = null;
                    const step = timestamp => {
                        if (!start) start = timestamp;
                        const progress = timestamp - start;
                        const current = Math.min(Math.floor((progress / duration) * target), target);
                        el.textContent = current;
                        if (progress < duration) {
                            requestAnimationFrame(step);
                        } else {
                            el.textContent = target;
                        }
                    };
                    requestAnimationFrame(step);
                    obs.unobserve(el);
                }
            });
        }, { threshold: 0.6 });
        statElements.forEach(el => counterObserver.observe(el));
    }

    /* ---------- Navbar behavior ---------- */
    const nav = document.querySelector('.glass-nav');
    let lastScroll = 0;
    const navHeight = nav ? nav.offsetHeight : 0;
    const handleNav = () => {
        const curScroll = window.scrollY;
        if (!nav) return;
        // shrink & backdrop blur
        if (curScroll > 80) {
            nav.classList.add('shrink');
        } else {
            nav.classList.remove('shrink');
        }
        // hide on scroll down, show on scroll up
        if (curScroll > lastScroll && curScroll > navHeight) {
            nav.classList.add('hidden');
        } else {
            nav.classList.remove('hidden');
        }
        lastScroll = curScroll;
    };
    window.addEventListener('scroll', handleNav);

    /* ---------- Hamburger menu toggle ---------- */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            navLinks.classList.toggle('open');
        });
    }

    /* ---------- Gallery Lightbox ---------- */
    const gallery = document.querySelector('.gallery-grid');
    if (gallery) {
        const images = Array.from(gallery.querySelectorAll('img'));
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <button class="lightbox-close">&times;</button>
            <button class="lightbox-prev">&#10094;</button>
            <img class="lightbox-img" src="" alt="">
            <button class="lightbox-next">&#10095;</button>
        `;
        document.body.appendChild(lightbox);
        const lightboxImg = lightbox.querySelector('.lightbox-img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let currentIdx = 0;

        const openLightbox = idx => {
            currentIdx = idx;
            lightboxImg.src = images[currentIdx].src;
            lightbox.classList.add('active');
        };
        const closeLightbox = () => lightbox.classList.remove('active');
        const showPrev = () => {
            currentIdx = (currentIdx - 1 + images.length) % images.length;
            lightboxImg.src = images[currentIdx].src;
        };
        const showNext = () => {
            currentIdx = (currentIdx + 1) % images.length;
            lightboxImg.src = images[currentIdx].src;
        };

        images.forEach((img, i) => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => openLightbox(i));
        });
        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);
        // close on overlay click
        lightbox.addEventListener('click', e => {
            if (e.target === lightbox) closeLightbox();
        });
        // keyboard navigation
        document.addEventListener('keydown', e => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        });
    }

    /* ---------- Form validation & success message ---------- */
    const form = document.querySelector('.contact-form');
    if (form) {
        // create success message element
        const successMsg = document.createElement('div');
        successMsg.className = 'form-success';
        successMsg.textContent = 'Viesti lähetetty onnistuneesti!';
        successMsg.style.opacity = '0';
        successMsg.style.transition = 'opacity 0.5s';
        form.parentNode.insertBefore(successMsg, form.nextSibling);

        form.addEventListener('submit', e => {
            e.preventDefault();
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            // simulate async submission
            form.querySelector('button[type="submit"]').disabled = true;
            setTimeout(() => {
                form.reset();
                form.querySelector('button[type="submit"]').disabled = false;
                successMsg.style.opacity = '1';
                successMsg.classList.add('fade-in');
                setTimeout(() => {
                    successMsg.style.opacity = '0';
                }, 3000);
            }, 800);
        });
    }
});