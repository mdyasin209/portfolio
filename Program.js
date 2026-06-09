(function () {
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
  });*/
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

})();
