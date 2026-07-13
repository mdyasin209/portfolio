/*(function () {
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) body.setAttribute('data-theme', savedTheme);

  function setThemeButtonState() {
    const isLight = body.getAttribute('data-theme') === 'light';
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', String(isLight));
      themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    }
  }
  setThemeButtonState();

  themeToggle?.addEventListener('click', () => {
    const nextTheme = body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', nextTheme);
    localStorage.setItem('portfolio-theme', nextTheme);
    setThemeButtonState();
  });

  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  menuBtn?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('show');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    navLinks.classList.remove('show');
    menuBtn?.setAttribute('aria-expanded', 'false');
  }));

  const navWrap = document.getElementById('navWrap');
  const backToTop = document.getElementById('backToTop');
  const siteHeader = document.getElementById('siteHeader');
  let lastScroll = 0;
  function onScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    navWrap?.style.setProperty('--scroll-progress', `${progress}%`);
    backToTop?.classList.toggle('show', scrollTop > 500);
    if (siteHeader && scrollTop > 160) {
      siteHeader.classList.toggle('nav-hidden', scrollTop > lastScroll && !navLinks?.classList.contains('show'));
    } else {
      siteHeader?.classList.remove('nav-hidden');
    }
    lastScroll = Math.max(scrollTop, 0);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  document.querySelectorAll('.service-card, .project-card, .process-card, .testimonial-card, .tool-card').forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      card.style.setProperty('--my', `${event.clientY - rect.top}px`);
    });
  });

  const stats = document.getElementById('stats');
  if (stats) {
    const statObserver = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      stats.querySelectorAll('[data-count]').forEach((number) => {
        const target = Number(number.getAttribute('data-count')) || 0;
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 70));
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            number.textContent = String(target);
            clearInterval(timer);
          } else {
            number.textContent = String(current);
          }
        }, 18);
      });
      statObserver.disconnect();
    }, { threshold: 0.4 });
    statObserver.observe(stats);
  }

  const filters = document.querySelectorAll('.filter-btn');
  const projects = document.querySelectorAll('.project-card');
  filters.forEach((btn) => btn.addEventListener('click', () => {
    filters.forEach((item) => item.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projects.forEach((card) => {
      const match = filter === 'all' || card.dataset.category.includes(filter);
      card.classList.toggle('hide', !match);
    });
  }));

  document.querySelectorAll('.faq-panel').forEach((panel) => {
    const button = panel.querySelector('.faq-question');
    const answer = panel.querySelector('.faq-answer');
    const setHeight = () => {
      if (panel.classList.contains('active')) answer.style.maxHeight = `${answer.scrollHeight}px`;
      else answer.style.maxHeight = '0px';
    };
    setHeight();
    button?.addEventListener('click', () => {
      document.querySelectorAll('.faq-panel').forEach((item) => {
        if (item !== panel) {
          item.classList.remove('active');
          const itemAnswer = item.querySelector('.faq-answer');
          if (itemAnswer) itemAnswer.style.maxHeight = '0px';
        }
      });
      panel.classList.toggle('active');
      setHeight();
    });
    window.addEventListener('resize', setHeight);
  });

  const slider = document.getElementById('testimonialSlider');
  if (slider) {
    const track = slider.querySelector('.testimonial-track');
    const originalCards = Array.from(track.children);
    originalCards.forEach((card) => track.appendChild(card.cloneNode(true)));
    let index = 0;
    let timer;
    function visibleCount() {
      if (window.matchMedia('(max-width: 760px)').matches) return 1;
      if (window.matchMedia('(max-width: 991px)').matches) return 2;
      return 3;
    }
    function slideWidth() {
      const first = track.children[0];
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      return first.getBoundingClientRect().width + gap;
    }
    function move() {
      track.style.transition = 'transform 600ms cubic-bezier(.2,.8,.2,1)';
      track.style.transform = `translateX(${-index * slideWidth()}px)`;
    }
    function next() {
      index += 1;
      move();
      const maxIndex = originalCards.length;
      if (index >= maxIndex) {
        setTimeout(() => {
          track.style.transition = 'none';
          index = 0;
          track.style.transform = 'translateX(0px)';
        }, 610);
      }
    }
    function start() { timer = setInterval(next, 2800); }
    function stop() { clearInterval(timer); }
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    window.addEventListener('resize', move);
    start();
  }

  const skillsBoard = document.querySelector('.skills-board');
  if (skillsBoard) {
    const skillsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        skillsBoard.classList.add('skills-animated');
        skillsObserver.disconnect();
      }
    }, { threshold: 0.35 });
    skillsObserver.observe(skillsBoard);
  }
/*
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    success?.classList.add('show');
    form.reset();
  });*//*
  const form = document.getElementById('contactForm');
const success = document.getElementById('formSuccess');

form?.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const formData = new FormData(form);

  try {
    await fetch('/', {
      method: 'POST',
      body: formData
    });

    success?.classList.add('show');
    form.reset();
  } catch (error) {
    alert('Something went wrong. Please try again.');
  }
});

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();


  // ===============================
  // ABOUT IMAGE RANDOM HOVER (5 images)
  // ===============================
  const aboutImageBox = document.querySelector('.about-image');
  if (aboutImageBox) {
    const aboutImages = Array.from(aboutImageBox.querySelectorAll('.about-random-img'));
    let lastAboutIndex = 0;

    function showRandomAboutImage() {
      if (aboutImages.length <= 1) return;
      let nextIndex = Math.floor(Math.random() * aboutImages.length);
      if (nextIndex === lastAboutIndex) {
        nextIndex = (nextIndex + 1) % aboutImages.length;
      }
      aboutImages.forEach((img, index) => img.classList.toggle('active', index === nextIndex));
      lastAboutIndex = nextIndex;
    }

    aboutImageBox.addEventListener('mouseenter', showRandomAboutImage);
    aboutImageBox.addEventListener('touchstart', showRandomAboutImage, { passive: true });
  }

  // ===============================
  // PROJECT FILTER + PAGINATION
  // 6 items per page; pagination only shows when filtered items > 6
  // ===============================
  const projectGrid = document.querySelector('.project-grid');
  const projectPagination = document.getElementById('projectPagination');
  const projectFilterButtons = document.querySelectorAll('.filter-btn');
  const allProjectCards = Array.from(document.querySelectorAll('.project-card'));
  const projectsPerPage = 6;
  let activeProjectFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
  let currentProjectPage = 1;

  function getFilteredProjects() {
    return allProjectCards.filter((card) => {
      const categories = card.dataset.category || '';
      return activeProjectFilter === 'all' || categories.includes(activeProjectFilter);
    });
  }

  function renderProjectPagination() {
    if (!projectGrid || !projectPagination || allProjectCards.length === 0) return;

    const filteredProjects = getFilteredProjects();
    const totalPages = Math.ceil(filteredProjects.length / projectsPerPage) || 1;
    currentProjectPage = Math.min(currentProjectPage, totalPages);

    allProjectCards.forEach((card) => {
      card.classList.add('project-hidden');
      card.classList.remove('hide');
    });

    filteredProjects.forEach((card, index) => {
      const start = (currentProjectPage - 1) * projectsPerPage;
      const end = start + projectsPerPage;
      card.classList.toggle('project-hidden', !(index >= start && index < end));
    });

    projectPagination.innerHTML = '';
    projectPagination.classList.toggle('show', filteredProjects.length > projectsPerPage);
    if (filteredProjects.length <= projectsPerPage) return;

    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'project-nav-btn';
    prevBtn.textContent = 'Prev';
    prevBtn.disabled = currentProjectPage === 1;
    prevBtn.addEventListener('click', () => {
      if (currentProjectPage > 1) {
        currentProjectPage -= 1;
        renderProjectPagination();
        projectGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
    projectPagination.appendChild(prevBtn);

    for (let page = 1; page <= totalPages; page += 1) {
      const pageBtn = document.createElement('button');
      pageBtn.type = 'button';
      pageBtn.className = `project-page-btn${page === currentProjectPage ? ' active' : ''}`;
      pageBtn.textContent = String(page);
      pageBtn.setAttribute('aria-label', `Go to project page ${page}`);
      pageBtn.addEventListener('click', () => {
        currentProjectPage = page;
        renderProjectPagination();
        projectGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      projectPagination.appendChild(pageBtn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'project-nav-btn';
    nextBtn.textContent = 'Next';
    nextBtn.disabled = currentProjectPage === totalPages;
    nextBtn.addEventListener('click', () => {
      if (currentProjectPage < totalPages) {
        currentProjectPage += 1;
        renderProjectPagination();
        projectGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
    projectPagination.appendChild(nextBtn);
  }

  projectFilterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      activeProjectFilter = btn.dataset.filter || 'all';
      currentProjectPage = 1;
      setTimeout(renderProjectPagination, 0);
    });
  });

  renderProjectPagination();

})();*/





"use strict";

/* =================================
   GLOBAL HELPERS JS START
================================= */

function debounce(callback, delay = 200) {
    let timeoutId;

    return function (...args) {
        window.clearTimeout(timeoutId);

        timeoutId = window.setTimeout(function () {
            callback.apply(this, args);
        }, delay);
    };
}

/* =================================
   GLOBAL HELPERS JS END
================================= */


/* =================================
   HEADER JS START
================================= */

document.addEventListener("DOMContentLoaded", function () {
    const siteHeader = document.querySelector("#siteHeader");
    const mobileMenuButton = document.querySelector("#mobileMenuButton");
    const mobileNavigation = document.querySelector("#mobileNavigation");
    const mobileNavigationLinks = document.querySelectorAll(
        "#mobileNavigation a"
    );

    function updateHeaderOnScroll() {
        if (!siteHeader) return;

        siteHeader.classList.toggle(
            "is-scrolled",
            window.scrollY > 20
        );
    }

    function closeMobileNavigation() {
        if (!mobileMenuButton || !mobileNavigation) return;

        mobileMenuButton.classList.remove("is-active");
        mobileNavigation.classList.remove("is-open");
        mobileMenuButton.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
    }

    if (mobileMenuButton && mobileNavigation) {
        mobileMenuButton.addEventListener("click", function () {
            const menuIsOpen =
                mobileNavigation.classList.toggle("is-open");

            mobileMenuButton.classList.toggle(
                "is-active",
                menuIsOpen
            );

            mobileMenuButton.setAttribute(
                "aria-expanded",
                String(menuIsOpen)
            );

            document.body.classList.toggle(
                "menu-open",
                menuIsOpen
            );
        });
    }

    mobileNavigationLinks.forEach(function (navigationLink) {
        navigationLink.addEventListener(
            "click",
            closeMobileNavigation
        );
    });

    window.addEventListener("scroll", updateHeaderOnScroll, {
        passive: true
    });

    window.addEventListener(
        "resize",
        debounce(function () {
            if (window.innerWidth > 991) {
                closeMobileNavigation();
            }
        }, 150)
    );

    updateHeaderOnScroll();
});

/* =================================
   HEADER JS END
================================= */


/* =================================
   SCROLL REVEAL JS START
================================= */

document.addEventListener("DOMContentLoaded", function () {
    const revealElements = document.querySelectorAll(".reveal");

    if (!revealElements.length) return;

    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {
        revealElements.forEach(function (element) {
            element.classList.add("is-visible");
        });

        return;
    }

    const revealObserver = new IntersectionObserver(
        function (entries, observer) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;

                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        },
        {
            root: null,
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    revealElements.forEach(function (element) {
        revealObserver.observe(element);
    });
});

/* =================================
   SCROLL REVEAL JS END
================================= */


/* =================================
   PROJECT FILTER JS START
================================= */

document.addEventListener("DOMContentLoaded", function () {
    const filterButtons = document.querySelectorAll(
        ".project-filter-button"
    );

    const projectCards = document.querySelectorAll(
        ".project-card"
    );

    if (!filterButtons.length || !projectCards.length) return;

    filterButtons.forEach(function (filterButton) {
        filterButton.addEventListener("click", function () {
            const selectedFilter =
                filterButton.dataset.filter;

            filterButtons.forEach(function (button) {
                button.classList.remove("is-active");
            });

            filterButton.classList.add("is-active");

            projectCards.forEach(function (projectCard) {
                const projectCategories =
                    projectCard.dataset.category || "";

                const shouldShow =
                    selectedFilter === "all" ||
                    projectCategories
                        .split(" ")
                        .includes(selectedFilter);

                projectCard.classList.toggle(
                    "is-hidden",
                    !shouldShow
                );
            });
        });
    });
});

/* =================================
   PROJECT FILTER JS END
================================= */


/* =================================
   TESTIMONIAL SLIDER JS START
================================= */

document.addEventListener("DOMContentLoaded", function () {
    const testimonialSlider = document.querySelector(
        "#testimonialSlider"
    );

    if (!testimonialSlider) return;

    const sliderTrack = testimonialSlider.querySelector(
        ".testimonial-slider-track"
    );

    const sliderSlides = Array.from(
        testimonialSlider.querySelectorAll(
            ".testimonial-slide"
        )
    );

    const previousButton = testimonialSlider.querySelector(
        ".testimonial-previous"
    );

    const nextButton = testimonialSlider.querySelector(
        ".testimonial-next"
    );

    const dotsContainer = testimonialSlider.querySelector(
        ".testimonial-slider-dots"
    );

    if (
        !sliderTrack ||
        !sliderSlides.length ||
        !previousButton ||
        !nextButton ||
        !dotsContainer
    ) {
        return;
    }

    const sliderSettings = {
        desktopVisibleSlides: 2,
        mobileVisibleSlides: 1,
        mobileBreakpoint: 767,
        autoplayDelay: 5000,
        minimumSwipeDistance: 50
    };

    let currentIndex = 0;
    let autoplayTimer = null;
    let touchStartX = 0;
    let touchEndX = 0;

    function getVisibleSlideCount() {
        return window.innerWidth <=
            sliderSettings.mobileBreakpoint
            ? sliderSettings.mobileVisibleSlides
            : sliderSettings.desktopVisibleSlides;
    }

    function getMaximumIndex() {
        return Math.max(
            0,
            sliderSlides.length - getVisibleSlideCount()
        );
    }

    function getSlidePercentage() {
        return 100 / getVisibleSlideCount();
    }

    function createSliderDots() {
        dotsContainer.innerHTML = "";

        const totalDots = getMaximumIndex() + 1;

        for (
            let dotIndex = 0;
            dotIndex < totalDots;
            dotIndex++
        ) {
            const dotButton =
                document.createElement("button");

            dotButton.type = "button";
            dotButton.className =
                "testimonial-slider-dot";

            dotButton.setAttribute(
                "aria-label",
                `Go to testimonial group ${dotIndex + 1}`
            );

            dotButton.addEventListener(
                "click",
                function () {
                    currentIndex = dotIndex;
                    updateSlider();
                    restartAutoplay();
                }
            );

            dotsContainer.appendChild(dotButton);
        }
    }

    function updateSlider() {
        const maximumIndex = getMaximumIndex();

        if (currentIndex > maximumIndex) {
            currentIndex = maximumIndex;
        }

        if (currentIndex < 0) {
            currentIndex = maximumIndex;
        }

        const translatePercentage =
            currentIndex * getSlidePercentage();

        sliderTrack.style.transform =
            `translate3d(-${translatePercentage}%, 0, 0)`;

        const sliderDots = dotsContainer.querySelectorAll(
            ".testimonial-slider-dot"
        );

        sliderDots.forEach(function (sliderDot, dotIndex) {
            const dotIsActive =
                dotIndex === currentIndex;

            sliderDot.classList.toggle(
                "is-active",
                dotIsActive
            );

            sliderDot.setAttribute(
                "aria-current",
                dotIsActive ? "true" : "false"
            );
        });
    }

    function showNextSlide() {
        currentIndex += 1;

        if (currentIndex > getMaximumIndex()) {
            currentIndex = 0;
        }

        updateSlider();
    }

    function showPreviousSlide() {
        currentIndex -= 1;

        if (currentIndex < 0) {
            currentIndex = getMaximumIndex();
        }

        updateSlider();
    }

    function stopAutoplay() {
        if (!autoplayTimer) return;

        window.clearInterval(autoplayTimer);
        autoplayTimer = null;
    }

    function startAutoplay() {
        stopAutoplay();

        if (
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches
        ) {
            return;
        }

        autoplayTimer = window.setInterval(
            showNextSlide,
            sliderSettings.autoplayDelay
        );
    }

    function restartAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    previousButton.addEventListener("click", function () {
        showPreviousSlide();
        restartAutoplay();
    });

    nextButton.addEventListener("click", function () {
        showNextSlide();
        restartAutoplay();
    });

    testimonialSlider.addEventListener(
        "mouseenter",
        stopAutoplay
    );

    testimonialSlider.addEventListener(
        "mouseleave",
        startAutoplay
    );

    testimonialSlider.addEventListener(
        "focusin",
        stopAutoplay
    );

    testimonialSlider.addEventListener(
        "focusout",
        startAutoplay
    );

    testimonialSlider.addEventListener(
        "touchstart",
        function (event) {
            touchStartX =
                event.changedTouches[0].clientX;

            stopAutoplay();
        },
        {
            passive: true
        }
    );

    testimonialSlider.addEventListener(
        "touchend",
        function (event) {
            touchEndX =
                event.changedTouches[0].clientX;

            const swipeDistance =
                touchStartX - touchEndX;

            if (
                Math.abs(swipeDistance) >=
                sliderSettings.minimumSwipeDistance
            ) {
                if (swipeDistance > 0) {
                    showNextSlide();
                } else {
                    showPreviousSlide();
                }
            }

            startAutoplay();
        },
        {
            passive: true
        }
    );

    window.addEventListener(
        "resize",
        debounce(function () {
            currentIndex = Math.min(
                currentIndex,
                getMaximumIndex()
            );

            createSliderDots();
            updateSlider();
        }, 180)
    );

    createSliderDots();
    updateSlider();
    startAutoplay();
});

/* =================================
   TESTIMONIAL SLIDER JS END
================================= */


/* =================================
   SKILL PROGRESS JS START
================================= */

document.addEventListener("DOMContentLoaded", function () {
    const skillsGrid = document.querySelector(".skills-grid");

    if (!skillsGrid) return;

    const skillItems = skillsGrid.querySelectorAll(
        ".skill-item"
    );

    const skillObserver = new IntersectionObserver(
        function (entries, observer) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;

                skillItems.forEach(function (skillItem) {
                    const skillValue =
                        skillItem.dataset.value || "0";

                    skillItem.style.setProperty(
                        "--skill-value",
                        `${skillValue}%`
                    );

                    skillItem.classList.add("is-animated");
                });

                observer.disconnect();
            });
        },
        {
            threshold: 0.25
        }
    );

    skillObserver.observe(skillsGrid);
});

/* =================================
   SKILL PROGRESS JS END
================================= */


/* =================================
   FAQ ACCORDION JS START
================================= */

document.addEventListener("DOMContentLoaded", function () {
    const faqAccordion = document.querySelector(
        "#faqAccordion"
    );

    if (!faqAccordion) return;

    const faqItems = Array.from(
        faqAccordion.querySelectorAll(".faq-item")
    );

    faqItems.forEach(function (faqItem) {
        const faqButton = faqItem.querySelector(
            ".faq-question"
        );

        if (!faqButton) return;

        faqButton.addEventListener("click", function () {
            const itemIsAlreadyOpen =
                faqItem.classList.contains("is-open");

            faqItems.forEach(function (otherFaqItem) {
                const otherFaqButton =
                    otherFaqItem.querySelector(
                        ".faq-question"
                    );

                otherFaqItem.classList.remove("is-open");

                if (otherFaqButton) {
                    otherFaqButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }
            });

            if (!itemIsAlreadyOpen) {
                faqItem.classList.add("is-open");

                faqButton.setAttribute(
                    "aria-expanded",
                    "true"
                );
            }
        });
    });
});

/* =================================
   FAQ ACCORDION JS END
================================= */


/* =================================
   NETLIFY CONTACT FORM JS START
================================= */

document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.querySelector(
        "#contactForm"
    );

    if (!contactForm) return;

    const submitButton = contactForm.querySelector(
        "#submitBtn"
    );

    const submitButtonText = submitButton?.querySelector(
        ".submit-button-text"
    );

    const successMessage = contactForm.querySelector(
        "#formSuccess"
    );

    const submitErrorMessage = contactForm.querySelector(
        "#formSubmitError"
    );

    const originalButtonText =
        submitButtonText?.textContent.trim() ||
        "Send Message";

    const validationMessages = {
        name: "Please enter your name.",
        email: "Please enter a valid email address.",
        phone: "Please enter a valid phone number.",
        budget: "Please enter your project budget.",
        service: "Please select a service.",
        message: "Please enter your project details."
    };

    function encodeFormData(formData) {
        return new URLSearchParams(formData).toString();
    }

    function getFieldFormGroup(field) {
        return field.closest(".form-group");
    }

    function clearFieldError(field) {
        const formGroup = getFieldFormGroup(field);

        if (!formGroup) return;

        const errorElement =
            formGroup.querySelector(".form-error");

        formGroup.classList.remove("has-error");

        if (errorElement) {
            errorElement.textContent = "";
        }
    }

    function showFieldError(field, message) {
        const formGroup = getFieldFormGroup(field);

        if (!formGroup) return;

        const errorElement =
            formGroup.querySelector(".form-error");

        formGroup.classList.add("has-error");

        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    function validateField(field) {
        clearFieldError(field);

        const fieldName = field.name;
        const fieldValue = field.value.trim();

        if (field.required && !fieldValue) {
            showFieldError(
                field,
                validationMessages[fieldName] ||
                    "This field is required."
            );

            return false;
        }

        if (
            field.type === "email" &&
            fieldValue &&
            !field.validity.valid
        ) {
            showFieldError(
                field,
                validationMessages.email
            );

            return false;
        }

        if (
            field.name === "phone" &&
            fieldValue &&
            !field.validity.valid
        ) {
            showFieldError(
                field,
                validationMessages.phone
            );

            return false;
        }

        return true;
    }

    function validateForm() {
        const formFields = Array.from(
            contactForm.querySelectorAll(
                "input:not([type='hidden']):not([name='bot-field']), select, textarea"
            )
        );

        let formIsValid = true;
        let firstInvalidField = null;

        formFields.forEach(function (field) {
            const fieldIsValid = validateField(field);

            if (!fieldIsValid) {
                formIsValid = false;

                if (!firstInvalidField) {
                    firstInvalidField = field;
                }
            }
        });

        if (firstInvalidField) {
            firstInvalidField.focus();
        }

        return formIsValid;
    }

    function clearAllErrors() {
        contactForm
            .querySelectorAll(".form-group")
            .forEach(function (formGroup) {
                formGroup.classList.remove("has-error");
            });

        contactForm
            .querySelectorAll(".form-error")
            .forEach(function (errorElement) {
                errorElement.textContent = "";
            });
    }

    function hideFormMessages() {
        successMessage?.classList.remove("is-visible");
        submitErrorMessage?.classList.remove("is-visible");
    }

    function setSubmittingState(isSubmitting) {
        if (!submitButton || !submitButtonText) return;

        submitButton.disabled = isSubmitting;

        submitButtonText.textContent = isSubmitting
            ? "Sending..."
            : originalButtonText;
    }

    contactForm
        .querySelectorAll(
            "input:not([type='hidden']), select, textarea"
        )
        .forEach(function (field) {
            field.addEventListener("input", function () {
                const formGroup =
                    getFieldFormGroup(field);

                if (
                    formGroup?.classList.contains(
                        "has-error"
                    )
                ) {
                    validateField(field);
                }
            });

            field.addEventListener("change", function () {
                const formGroup =
                    getFieldFormGroup(field);

                if (
                    formGroup?.classList.contains(
                        "has-error"
                    )
                ) {
                    validateField(field);
                }
            });
        });

    contactForm.addEventListener(
        "submit",
        async function (event) {
            event.preventDefault();

            hideFormMessages();

            if (!validateForm()) {
                return;
            }

            setSubmittingState(true);

            try {
                const formData = new FormData(contactForm);

                const response = await fetch("/", {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded"
                    },
                    body: encodeFormData(formData)
                });

                if (!response.ok) {
                    throw new Error(
                        `Form submission failed with status ${response.status}`
                    );
                }

                contactForm.reset();
                clearAllErrors();

                successMessage?.classList.add(
                    "is-visible"
                );
            } catch (error) {
                console.error(
                    "Netlify form submission error:",
                    error
                );

                submitErrorMessage?.classList.add(
                    "is-visible"
                );
            } finally {
                setSubmittingState(false);
            }
        }
    );
});

/* =================================
   NETLIFY CONTACT FORM JS END
================================= */

/* =================================
   FLOATING CONTACT BUTTON JS START
================================= */

document.addEventListener("DOMContentLoaded", function () {
    const floatingContact =
        document.querySelector("#floatingContact");

    const floatingContactButton =
        document.querySelector("#floatingContactButton");

    if (!floatingContact || !floatingContactButton) {
        return;
    }

    function openFloatingContact() {
        floatingContact.classList.remove("collapsed");

        floatingContactButton.setAttribute(
            "aria-expanded",
            "true"
        );

        floatingContactButton.setAttribute(
            "aria-label",
            "Close contact options"
        );
    }

    function closeFloatingContact() {
        floatingContact.classList.add("collapsed");

        floatingContactButton.setAttribute(
            "aria-expanded",
            "false"
        );

        floatingContactButton.setAttribute(
            "aria-label",
            "Open contact options"
        );
    }

    function toggleFloatingContact() {
        const isCollapsed =
            floatingContact.classList.contains("collapsed");

        if (isCollapsed) {
            openFloatingContact();
        } else {
            closeFloatingContact();
        }
    }

    floatingContactButton.addEventListener(
        "click",
        function (event) {
            event.stopPropagation();
            toggleFloatingContact();
        }
    );

    floatingContact.addEventListener(
        "click",
        function (event) {
            event.stopPropagation();
        }
    );

    document.addEventListener(
        "click",
        function () {
            closeFloatingContact();
        }
    );

    document.addEventListener(
        "keydown",
        function (event) {
            if (event.key === "Escape") {
                closeFloatingContact();
            }
        }
    );
});

/* =================================
   FLOATING CONTACT BUTTON JS END
================================= */





/* =================================
   TOOLS MARQUEE JS START
================================= */

document.addEventListener("DOMContentLoaded", function () {
    const toolsMarquee = document.querySelector(
        "#toolsMarquee"
    );

    if (!toolsMarquee) return;

    const toolsTrack = toolsMarquee.querySelector(
        ".tools-track"
    );

    const originalToolsGroup = toolsMarquee.querySelector(
        ".tools-group"
    );

    if (!toolsTrack || !originalToolsGroup) return;


    /*
    Seamless infinite loop তৈরি করার জন্য
    original tools group clone করা হচ্ছে।
    HTML-এ manually duplicate করতে হবে না।
    */
    const clonedToolsGroup =
        originalToolsGroup.cloneNode(true);

    clonedToolsGroup.setAttribute(
        "aria-hidden",
        "true"
    );

    clonedToolsGroup.classList.add(
        "tools-group-clone"
    );

    toolsTrack.appendChild(clonedToolsGroup);


    /*
    Clone তৈরি হওয়ার পরে সব tool item select করা হচ্ছে।
    */
    const allToolItems = Array.from(
        toolsMarquee.querySelectorAll(".tool-item")
    );


    function clearToolEffects() {
        toolsMarquee.classList.remove(
            "has-active-tool"
        );

        allToolItems.forEach(function (toolItem) {
            toolItem.classList.remove(
                "is-hovered",
                "is-near-one",
                "is-near-two"
            );
        });
    }


    function activateToolEffect(activeIndex) {
        clearToolEffects();

        toolsMarquee.classList.add(
            "has-active-tool"
        );

        const totalItems = allToolItems.length;

        allToolItems.forEach(function (
            toolItem,
            toolIndex
        ) {
            const directDistance =
                Math.abs(toolIndex - activeIndex);

            const circularDistance =
                Math.min(
                    directDistance,
                    totalItems - directDistance
                );

            if (circularDistance === 0) {
                toolItem.classList.add(
                    "is-hovered"
                );
            } else if (circularDistance === 1) {
                toolItem.classList.add(
                    "is-near-one"
                );
            } else if (circularDistance === 2) {
                toolItem.classList.add(
                    "is-near-two"
                );
            }
        });
    }


    allToolItems.forEach(function (
        toolItem,
        toolIndex
    ) {
        toolItem.setAttribute(
            "tabindex",
            "0"
        );

        toolItem.addEventListener(
            "mouseenter",
            function () {
                activateToolEffect(toolIndex);
            }
        );

        toolItem.addEventListener(
            "focus",
            function () {
                activateToolEffect(toolIndex);
            }
        );
    });


    toolsMarquee.addEventListener(
        "mouseleave",
        clearToolEffects
    );

    toolsMarquee.addEventListener(
        "focusout",
        function (event) {
            const nextFocusedElement =
                event.relatedTarget;

            if (
                !nextFocusedElement ||
                !toolsMarquee.contains(
                    nextFocusedElement
                )
            ) {
                clearToolEffects();
            }
        }
    );
});

/* =================================
   TOOLS MARQUEE JS END
================================= */
