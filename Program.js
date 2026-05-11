// ===============================
// HEADER SCROLL EFFECT
// ===============================

const siteHeader = document.getElementById("siteHeader");
const navWrap = document.getElementById("navWrap");

let lastScrollY = window.scrollY;

function handleHeader() {
    const currentY = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? (currentY / scrollHeight) * 100 : 0;

    navWrap.style.setProperty("--scroll-progress", `${progress}%`);

    if (currentY > lastScrollY && currentY > 120) {
        siteHeader.classList.add("nav-hidden");
    } else {
        siteHeader.classList.remove("nav-hidden");
    }

    lastScrollY = currentY;
}

window.addEventListener("scroll", handleHeader, { passive: true });
window.addEventListener("resize", handleHeader);

handleHeader();


// ===============================
// THEME TOGGLE
// ===============================

const themeToggle = document.getElementById("themeToggle");

function setTheme(theme) {
    const isLight = theme === "light";

    document.body.dataset.theme = isLight ? "light" : "dark";

    themeToggle.setAttribute("aria-pressed", String(isLight));

    themeToggle.setAttribute(
        "aria-label",
        isLight ? "Switch to dark mode" : "Switch to light mode"
    );
}

setTheme("dark");

themeToggle.addEventListener("click", () => {
    setTheme(document.body.dataset.theme === "dark" ? "light" : "dark");
});


// ===============================
// MOBILE MENU
// ===============================

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

function closeMobileMenu() {
    navLinks.classList.remove("show");
    menuBtn.setAttribute("aria-expanded", "false");
}

function toggleMobileMenu() {
    const isOpen = navLinks.classList.toggle("show");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
}

menuBtn.addEventListener("click", toggleMobileMenu);

document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 991) {
        closeMobileMenu();
    }
});


// ===============================
// PROJECT FILTER
// ===============================

const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const filterValue = button.dataset.filter;

        filterButtons.forEach((btn) => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        projectCards.forEach((card) => {
            const categories = card.dataset.category;

            card.classList.toggle(
                "hide",
                !(filterValue === "all" || categories.includes(filterValue))
            );
        });
    });
});


// ===============================
// REVEAL ANIMATION
// ===============================

const revealItems = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.16
    }
);

revealItems.forEach((item) => {
    revealObserver.observe(item);
});


// ===============================
// SKILLS BOARD ANIMATION
// ===============================

const skillsBoard = document.querySelector(".skills-board");

if (skillsBoard) {
    const skillsObserver = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting) {
                skillsBoard.classList.add("skills-animated");
                skillsObserver.unobserve(skillsBoard);
            }
        },
        {
            threshold: 0.35
        }
    );

    skillsObserver.observe(skillsBoard);
}


// ===============================
// COUNTER ANIMATION
// ===============================

const statsSection = document.getElementById("stats");
const counters = document.querySelectorAll("[data-count]");

let counted = false;

function runCounter() {
    counters.forEach((counter) => {
        const target = Number(counter.dataset.count);
        const duration = 1300;
        const startTime = performance.now();

        const suffix = target === 98 ? "%" : target === 7 ? "d" : "+";

        function update(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            counter.textContent = Math.floor(eased * target) + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    });
}

const statsObserver = new IntersectionObserver(
    (entries) => {
        if (entries[0].isIntersecting && !counted) {
            counted = true;
            runCounter();
            statsObserver.unobserve(statsSection);
        }
    },
    {
        threshold: 0.4
    }
);

statsObserver.observe(statsSection);


// ===============================
// CARD MOUSE HOVER EFFECT
// ===============================

document
    .querySelectorAll(
        ".service-card, .project-card, .process-card, .testimonial-card, .tool-card"
    )
    .forEach((card) => {
        card.addEventListener("mousemove", (event) => {
            const rect = card.getBoundingClientRect();

            card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
            card.style.setProperty("--my", `${event.clientY - rect.top}px`);
        });
    });


// ===============================
// CONTACT FORM
// ===============================

const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");
const submitBtn = document.getElementById("submitBtn");

contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email");
    const phone = document.getElementById("phone");

    if (!email.checkValidity()) {
        email.reportValidity();
        return;
    }

    if (!phone.checkValidity()) {
        phone.reportValidity();
        return;
    }

    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    try {
        const response = await fetch(contactForm.action, {
            method: "POST",
            body: new FormData(contactForm),
            headers: {
                Accept: "application/json"
            }
        });

        formSuccess.textContent = response.ok
            ? "Thank you! Your message has been submitted successfully."
            : "Message submitted, but please check FormSubmit email verification if this is your first submission.";

        formSuccess.classList.add("show");

        if (response.ok) {
            contactForm.reset();
        }
    } catch (error) {
        formSuccess.textContent =
            "Network issue. Please email me directly at mdyasinjkt209@gmail.com.";

        formSuccess.classList.add("show");
    } finally {
        submitBtn.textContent = "Send Message →";
        submitBtn.disabled = false;
    }
});


// ===============================
// FAQ ACCORDION
// ===============================

const faqPanels = document.querySelectorAll(".faq-panel");

function closeFaq(panel) {
    const answer = panel.querySelector(".faq-answer");

    panel.classList.remove("active");
    answer.style.maxHeight = "0px";
}

function openFaq(panel) {
    const answer = panel.querySelector(".faq-answer");

    panel.classList.add("active");
    answer.style.maxHeight = `${answer.scrollHeight}px`;
}

faqPanels.forEach((panel) => {
    const button = panel.querySelector(".faq-question");
    const answer = panel.querySelector(".faq-answer");

    if (panel.classList.contains("active")) {
        answer.style.maxHeight = `${answer.scrollHeight}px`;
    }

    button.addEventListener("click", () => {
        const isActive = panel.classList.contains("active");

        faqPanels.forEach(closeFaq);

        if (!isActive) {
            openFaq(panel);
        }
    });
});

window.addEventListener("resize", () => {
    faqPanels.forEach((panel) => {
        if (panel.classList.contains("active")) {
            const answer = panel.querySelector(".faq-answer");
            answer.style.maxHeight = `${answer.scrollHeight}px`;
        }
    });
});


// ===============================
// BACK TO TOP BUTTON
// ===============================

const backToTop = document.getElementById("backToTop");

window.addEventListener(
    "scroll",
    () => {
        backToTop.classList.toggle("show", window.scrollY > 500);
    },
    {
        passive: true
    }
);

backToTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


// ===============================
// CURRENT YEAR
// ===============================

document.getElementById("year").textContent = new Date().getFullYear();