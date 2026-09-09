/**
 * script.js - Portfolio Functionaliteit & UX
 * 
 * Functionaliteiten:
 * 1. Automatisch dynamisch jaar in footer
 * 2. Mobiel hamburgermenu (openen/sluiten & sluiten bij klik op navigatielink)
 * 3. Smooth scrolling voor alle ankerlinks
 * 4. Actieve navigatiestatus tijdens scrollen (IntersectionObserver)
 * 5. Contactformulier validatie & verzendinteractie met succesmelding
 * 6. Fallback voor placeholder afbeeldingen
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Dynamisch Jaar in Footer
  // --------------------------------------------------------------------------
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // 2. Mobiel Menu Toggle
  // --------------------------------------------------------------------------
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      menuToggle.classList.toggle('is-active', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Sluit het mobiele menu automatisch wanneer een navigatielink wordt aangeklikt
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('is-open')) {
          navMenu.classList.remove('is-open');
          menuToggle.classList.remove('is-active');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. Smooth Scroll voor Ankerlinks
  // --------------------------------------------------------------------------
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update URL hash zonder abrupte sprong
        history.pushState(null, '', targetId);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 4. Actieve Navigatielink Highlighting bij Scrollen
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  const highlightNavOnScroll = () => {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navItems.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  // --------------------------------------------------------------------------
  // 5. Contactformulier Validatie & Interactie
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const messageInput = document.getElementById('contact-message');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      // E-mail validatie met Regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !message) {
        showFeedback('Vul alstublieft alle verplichte velden in.', 'error');
        return;
      }

      if (!emailRegex.test(email)) {
        showFeedback('Voer alstublieft een geldig e-mailadres in.', 'error');
        return;
      }

      // Succesvolle verzending simuleren
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Verzenden...';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Verstuur Bericht';
        }

        const successMessage = `Bedankt voor je bericht, ${name}! We hebben je aanvraag ontvangen en nemen zo snel mogelijk contact met je op.`;
        
        showFeedback(successMessage, 'success');
        
        // Browser alert melding zoals gevraagd in de specificaties
        alert(successMessage);

        // Reset het formulier
        contactForm.reset();
      }, 600);
    });
  }

  function showFeedback(text, type) {
    if (!formFeedback) return;

    formFeedback.textContent = text;
    formFeedback.className = `form-feedback is-${type}`;
    formFeedback.style.display = 'block';

    if (type === 'success') {
      setTimeout(() => {
        formFeedback.style.display = 'none';
      }, 6000);
    }
  }

  // --------------------------------------------------------------------------
  // 6. Fallback voor Placeholder Afbeeldingen
  // --------------------------------------------------------------------------
  const projectImages = document.querySelectorAll('.project-img');
  projectImages.forEach(img => {
    img.addEventListener('error', function () {
      // Inline SVG fallback als externe placeholder service geblokkeerd of offline is
      this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="%231e293b"><rect width="100%" height="100%" fill="%231e293b"/><text x="50%" y="50%" font-family="Inter, sans-serif" font-size="20" font-weight="600" fill="%236366f1" text-anchor="middle" dominant-baseline="middle">[Project+Afbeelding+Placeholder]</text></svg>';
    });
  });

  // --------------------------------------------------------------------------
  // 7. Beheer van Tygo's Eigen Profielfoto (Upload, Drag-and-Drop & Opslag)
  // --------------------------------------------------------------------------
  const heroFrame = document.getElementById('hero-image-frame');
  const fileInput = document.getElementById('photo-file-input');
  const heroImg = document.getElementById('hero-profile-image');
  const heroPlaceholder = document.getElementById('hero-photo-placeholder');
  const photoBadge = document.getElementById('photo-change-badge');
  const aboutImg = document.getElementById('about-avatar-image');
  const aboutPlaceholder = document.getElementById('about-avatar-placeholder');

  const STORAGE_KEY = 'tygo_profile_photo';

  function applyPhoto(dataUrl) {
    if (!dataUrl) return;

    if (heroImg) {
      heroImg.src = dataUrl;
      heroImg.classList.remove('hidden');
    }
    if (heroPlaceholder) {
      heroPlaceholder.classList.add('hidden');
    }
    if (photoBadge) {
      photoBadge.classList.remove('hidden');
    }
    if (aboutImg) {
      aboutImg.src = dataUrl;
      aboutImg.classList.remove('hidden');
    }
    if (aboutPlaceholder) {
      aboutPlaceholder.classList.add('hidden');
    }
  }

  function handleImageFile(file) {
    if (!file || !file.type.startsWith('image/')) {
      alert('Selecteer a.u.b. een geldige afbeelding (PNG, JPG, JPEG of WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      // Direct in localStorage opslaan voor directe persistente weergave
      try {
        localStorage.setItem(STORAGE_KEY, dataUrl);
      } catch (err) {
        console.warn('Kon foto niet in localStorage opslaan (mogelijk te groot):', err);
      }
      applyPhoto(dataUrl);

      // Probeer de foto ook op de server/project public map op te slaan
      fetch('/api/upload-photo', {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      }).catch(err => {
        console.info('Server-upload optioneel:', err);
      });
    };
    reader.readAsDataURL(file);
  }

  // 1. Controleer eerst of er al een foto in localStorage staat
  const savedPhoto = localStorage.getItem(STORAGE_KEY);
  if (savedPhoto) {
    applyPhoto(savedPhoto);
  } else {
    // Test of er al een bestand op de server staat
    const testImg = new Image();
    testImg.onload = () => {
      applyPhoto('/tygo-van-kolfschoten.jpg');
    };
    testImg.onerror = () => {
      // Geen foto gevonden: laat de mooie 'Upload je eigen foto' placeholder staan
    };
    testImg.src = '/tygo-van-kolfschoten.jpg';
  }

  // 2. Klik- en toetsenbord-interactie om bestandskiezer te openen
  if (heroFrame && fileInput) {
    heroFrame.addEventListener('click', () => {
      fileInput.click();
    });

    heroFrame.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fileInput.click();
      }
    });

    fileInput.addEventListener('change', (e) => {
      const files = e.target.files;
      if (files && files[0]) {
        handleImageFile(files[0]);
      }
    });

    // 3. Drag-and-drop functionaliteit voor het slepen van eigen foto
    ['dragenter', 'dragover'].forEach(eventName => {
      heroFrame.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        heroFrame.classList.add('is-dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      heroFrame.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        heroFrame.classList.remove('is-dragover');
      });
    });

    heroFrame.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt ? dt.files : null;
      if (files && files[0]) {
        handleImageFile(files[0]);
      }
    });
  }
});
