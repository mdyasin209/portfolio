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
        budget: "Please enter a valid project budget.",
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

        /* Budget Number Validation Start */
        if (
            field.name === "budget" &&
            fieldValue
        ) {
            const budgetValue = Number(fieldValue);

            if (
                !Number.isFinite(budgetValue) ||
                budgetValue <= 0
            ) {
                showFieldError(
                    field,
                    validationMessages.budget
                );

                return false;
            }
        }
        /* Budget Number Validation End */

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














/* =================================
   Services JS Start
================================= */
const services = [
  { title:"Webflow Development", body:"Responsive Webflow builds with clean structure and smooth animations.", color:"blue",
    img:"Assets/Webflow_icon.svg" },
  { title:"Frontend Development", body:"Modern HTML, CSS, and JavaScript interfaces.", color:"pink",
    img:"Assets/frontend-development.svg" },
  { title:"CMS & Dynamic Websites", body:"CMS collections for blogs, projects, teams, and resources.", color:"green",
    img:"Assets/cms-setup.svg" },
  { title:"Website Redesign", body:"Modern redesigns that improve trust, flow, and usability.", color:"purple",
    img:"Assets/website-redesign.svg" },
  { title:"SEO Basics", body:"Meta, heading, image, and page structure optimization.", color:"yellow",
    img:"Assets/seo-basics.svg" },
  { title:"Maintenance", body:"Updates, bug fixes, new sections, and ongoing improvements.", color:"blue",
    img:"Assets/maintenance.svg" },
];

const n = services.length;
const stepDeg = 40;
const stage = document.getElementById('stage');
const dotsWrap = document.getElementById('dots');
let center = 0;
let animating = false;

// build persistent slot/card elements once — this is key to a real
// "rotate" feel: the same DOM node swings from one angle to the next
// instead of being re-created, so the browser tweens the arc motion.
const slots = services.map((s, i) => {
  const slot = document.createElement('div');
  slot.className = 'slot';
  slot.innerHTML = `
    <div class="card">
      <div class="services-card-icon-wrap service-icon icon-bg-${s.color}">
        <img src="${s.img}" alt="" aria-hidden="true">
      </div>
      <h3>${s.title}</h3>
      <p>${s.body}</p>
      
    </div>
  `;
  stage.appendChild(slot);
  return slot;
});

function shortestOffset(i, c){
  let raw = i - c;
  const half = n / 2;
  while (raw > half) raw -= n;
  while (raw <= -half) raw += n;
  return raw;
}

function layout(){
  slots.forEach((slot, i) => {
    const offset = shortestOffset(i, center);
    const angle = offset * stepDeg;
    const abs = Math.abs(offset);

    slot.style.transform = `translateX(-50%) rotate(${angle}deg)`;
    slot.style.zIndex = 10 - abs;
    slot.classList.toggle('is-center', offset === 0);

    const card = slot.querySelector('.card');
    const scale = Math.max(0.78, 1 - abs * 0.08);
    const opacity = abs === 0 ? 1 : abs === 1 ? 1 : abs === 2 ? 0.22 : 0;
    card.style.transform = `scale(${scale})`;
    card.style.opacity = opacity;
    card.style.pointerEvents = abs >= 2 ? 'none' : 'auto';
  });
  renderDots();
}

function renderDots(){
  dotsWrap.innerHTML = '';
  services.forEach((_, i) => {
    const b = document.createElement('button');
    b.className = i === center ? 'active' : '';
    b.setAttribute('aria-label', 'View service ' + (i + 1));
    b.addEventListener('click', () => { goTo(i); restartAuto(); });
    dotsWrap.appendChild(b);
  });
  curveIndicator();
}

// bows the whole prev-arrow / dots / next-arrow row into a shallow
// arc so it echoes the dome's curve, instead of sitting dead flat.
function curveIndicator(){
  const items = document.querySelectorAll('#indicator > .nav-btn, #indicator .dots button');
  const count = items.length;
  const center = (count - 1) / 2;
  const w = window.innerWidth;
  const factor = w < 420 ? 1.3 : w < 720 ? 1.7 : 2.0;

  items.forEach((el, i) => {
    const d = i - center;
    const dip = (d * d * factor).toFixed(1);
    const scale = el.classList.contains('active') ? ' scale(1.9)' : '';
    el.style.transform = `translateY(${dip}px)${scale}`;
  });
}

window.addEventListener('resize', curveIndicator);

function slide(dir){
  if (animating) return;
  animating = true;
  center = ((center + dir) % n + n) % n;
  layout();
  setTimeout(() => { animating = false; }, 760);
}

function goTo(i){
  if (animating || i === center) return;
  animating = true;
  center = i;
  layout();
  setTimeout(() => { animating = false; }, 760);
}

document.getElementById('nextBtn').addEventListener('click', () => { slide(1); restartAuto(); });
document.getElementById('prevBtn').addEventListener('click', () => { slide(-1); restartAuto(); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') { slide(1); restartAuto(); }
  if (e.key === 'ArrowLeft') { slide(-1); restartAuto(); }
});

// ---- autoplay: loops forever, pauses on card hover ----
const AUTO_DELAY = 3200;
let autoTimer = null;
let paused = false;

function startAuto(){
  stopAuto();
  autoTimer = setInterval(() => {
    if (!paused) slide(1);
  }, AUTO_DELAY);
}
function stopAuto(){
  if (autoTimer) clearInterval(autoTimer);
  autoTimer = null;
}
function restartAuto(){
  startAuto();
}

stage.addEventListener('mouseenter', () => { paused = true; });
stage.addEventListener('mouseleave', () => { paused = false; });
stage.addEventListener('focusin', () => { paused = true; });
stage.addEventListener('focusout', () => { paused = false; });

// touch swipe — mobile has no hover, so this is the mobile equivalent
let touchStartX = null;
stage.addEventListener('touchstart', (e) => {
  paused = true;
  touchStartX = e.touches[0].clientX;
}, { passive: true });

stage.addEventListener('touchend', (e) => {
  if (touchStartX !== null){
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40){
      slide(dx < 0 ? 1 : -1);
    }
  }
  touchStartX = null;
  paused = false;
  restartAuto();
}, { passive: true });

layout();
startAuto();
/* =================================
   Services JS End
================================= */

