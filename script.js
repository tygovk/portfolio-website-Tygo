/**
 * script.js - Portfolio Functionaliteit, Beveiliging & Beheerdersinterface
 * 
 * Beveiligingsconcept:
 * - Publieke Bezoekers: Kunnen projecten bekijken, filteren, detailpagina's lezen,
 *   contact opnemen en door het portfolio bladeren. Ze hebben GEEN toegang tot
 *   het toevoegen, bewerken of verwijderen van projecten.
 * - Tygo (Beheerder): Kan inloggen met zijn beheerderswachtwoord (standaard: tygo2026).
 *   Na inloggen heeft alleen hij toegang tot de beheerbalk, "+ Project Toevoegen",
 *   projectbewerking, projectverwijdering en profielfotobeheer.
 */

import {
  getProjectsData,
  addProject,
  updateProject,
  deleteProject,
  isAdminLoggedIn,
  verifyAdminPassword,
  setAdminSession,
  logoutAdmin,
  changeAdminPassword
} from './projectsData.js';

// Maak data globaal traceerbaar in window object
window.projectsData = getProjectsData();
window.isAdminLoggedIn = isAdminLoggedIn;

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Dynamisch Jaar in Footer
  // --------------------------------------------------------------------------
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // 2. Toast Notificaties
  // --------------------------------------------------------------------------
  function showAdminToast(message, icon = '🛡️') {
    const existing = document.querySelector('.admin-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'admin-toast';
    toast.innerHTML = `<span>${icon}</span><span>${escapeHtml(message)}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 350);
    }, 3800);
  }

  // --------------------------------------------------------------------------
  // 3. Mobiel Menu Toggle
  // --------------------------------------------------------------------------
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      menuToggle.classList.toggle('is-active', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

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
  // 4. Projectkaarten Renderen op Homepage (Met Admin-strips als Tygo is ingelogd)
  // --------------------------------------------------------------------------
  const projectsGridContainer = document.getElementById('projects-grid-container');

  function renderProjectsGrid() {
    if (!projectsGridContainer) return;
    const projects = getProjectsData();
    window.projectsData = projects;
    const isAdmin = isAdminLoggedIn();

    if (projects.length === 0) {
      projectsGridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-muted);">
          <p style="color: var(--text-muted); margin-bottom: 1rem;">Er zijn momenteel geen projecten beschikbaar.</p>
          ${isAdmin ? `
            <button type="button" class="btn btn-primary btn-sm" id="btn-empty-add-project">+ Voeg eerste project toe</button>
          ` : ''}
        </div>
      `;
      const emptyBtn = document.getElementById('btn-empty-add-project');
      if (emptyBtn) emptyBtn.addEventListener('click', openAddProjectModal);
      return;
    }

    projectsGridContainer.innerHTML = projects.map(project => {
      const tagsHtml = (project.tags || []).slice(0, 4).map(tag => 
        `<span class="tech-tag">${escapeHtml(tag)}</span>`
      ).join('');

      const safeImgUrl = project.afbeeldingUrl || 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80';
      const photosCount = Array.isArray(project.afbeeldingen) && project.afbeeldingen.length > 0 
        ? project.afbeeldingen.length 
        : (project.afbeeldingUrl ? 1 : 0);

      return `
        <article class="project-card project-card-clickable" data-project-id="${escapeHtml(project.id)}">
          <a href="#project/${encodeURIComponent(project.id)}" class="project-media-wrap" aria-label="Bekijk details van ${escapeHtml(project.titel)}">
            <img
              src="${escapeHtml(safeImgUrl)}"
              alt="${escapeHtml(project.titel)} Afbeelding"
              class="project-img"
              loading="lazy"
              onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22400%22 viewBox=%220 0 600 400%22 fill=%22%231e293b%22><rect width=%22100%%22 height=%22100%%22 fill=%22%231e293b%22/><text x=%2250%%22 y=%2250%%22 font-family=%22Inter, sans-serif%22 font-size=%2220%22 font-weight=%22600%22 fill=%22%236366f1%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22>${encodeURIComponent(project.titel)}</text></svg>';"
            />
            ${photosCount > 1 ? `
              <span class="project-card-gallery-badge" title="Dit project bevat ${photosCount} foto's">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                <span>${photosCount} foto's</span>
              </span>
            ` : ''}
          </a>
          <div class="project-body">
            <h3 class="project-title">
              <a href="#project/${encodeURIComponent(project.id)}" class="project-card-link-title">
                ${escapeHtml(project.titel)}
              </a>
            </h3>
            <p class="project-desc">
              ${escapeHtml(project.korteOmschrijving || '')}
            </p>
            <div class="project-tags">
              ${tagsHtml}
            </div>
            <div class="project-actions">
              <a href="#project/${encodeURIComponent(project.id)}" class="btn btn-detail btn-sm" aria-label="Details bekijken van ${escapeHtml(project.titel)}">
                <span>Lees Meer</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </a>
              ${project.liveDemoUrl ? `
                <a href="${escapeHtml(project.liveDemoUrl)}" class="btn btn-secondary btn-sm" target="_blank" rel="noopener noreferrer" title="Bekijk Live Demo">
                  Demo
                </a>
              ` : ''}
              ${project.githubUrl ? `
                <a href="${escapeHtml(project.githubUrl)}" class="btn btn-secondary btn-sm" target="_blank" rel="noopener noreferrer" title="Bekijk GitHub Code">
                  Code
                </a>
              ` : ''}
            </div>

            ${isAdmin ? `
              <!-- Alleen zichtbaar voor Tygo bij actieve beheersessie -->
              <div class="project-admin-strip">
                <button type="button" class="btn-card-edit" data-edit-id="${escapeHtml(project.id)}" title="Project bewerken">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  <span>Bewerken</span>
                </button>
                <button type="button" class="btn-card-delete" data-delete-id="${escapeHtml(project.id)}" title="Project verwijderen">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  <span>Verwijderen</span>
                </button>
              </div>
            ` : ''}
          </div>
        </article>
      `;
    }).join('');

    // Klik-interactie op kaarten
    const cards = projectsGridContainer.querySelectorAll('.project-card');
    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('a') || e.target.closest('button')) return;
        const pId = card.getAttribute('data-project-id');
        if (pId) {
          window.location.hash = `#project/${pId}`;
        }
      });
    });

    // Event listeners voor Beheerknoppen op kaarten (indien admin ingelogd is)
    if (isAdmin) {
      projectsGridContainer.querySelectorAll('.btn-card-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const pId = btn.getAttribute('data-edit-id');
          if (pId) openEditProjectModal(pId);
        });
      });

      projectsGridContainer.querySelectorAll('.btn-card-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const pId = btn.getAttribute('data-delete-id');
          if (pId) handleDeleteProject(pId);
        });
      });
    }
  }

  // Eerste render van de projectenkaarten
  renderProjectsGrid();

  // --------------------------------------------------------------------------
  // 5. Losse Project Detailpagina, Fotogalerij & Lightbox Modal
  // --------------------------------------------------------------------------
  const homeView = document.getElementById('home-view');
  const projectDetailView = document.getElementById('project-detail-view');
  let currentActiveProjectId = null;

  // Detail Fotogalerij State & Elementen (tot 10 foto's)
  let detailGalleryImages = [];
  let detailGalleryCurrentIndex = 0;
  let detailGalleryProjectTitle = '';

  const detailHeroImage = document.getElementById('detail-hero-image');
  const galleryPrevBtn = document.getElementById('gallery-prev-btn');
  const galleryNextBtn = document.getElementById('gallery-next-btn');
  const galleryCounterPill = document.getElementById('gallery-counter-pill');
  const galleryCounterText = document.getElementById('gallery-counter-text');
  const galleryZoomBtn = document.getElementById('gallery-zoom-btn');
  const galleryThumbnailsStrip = document.getElementById('gallery-thumbnails-strip');

  // Lightbox elementen
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
  const lightboxPrevBtn = document.getElementById('lightbox-prev-btn');
  const lightboxNextBtn = document.getElementById('lightbox-next-btn');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCounter = document.getElementById('lightbox-counter');

  function updateDetailGalleryView(newIndex, animate = true) {
    if (detailGalleryImages.length === 0) return;
    if (newIndex < 0) newIndex = detailGalleryImages.length - 1;
    if (newIndex >= detailGalleryImages.length) newIndex = 0;
    detailGalleryCurrentIndex = newIndex;

    const currentUrl = detailGalleryImages[detailGalleryCurrentIndex];

    if (detailHeroImage) {
      if (animate) {
        detailHeroImage.style.opacity = '0.35';
        detailHeroImage.style.transform = 'scale(0.99)';
        setTimeout(() => {
          detailHeroImage.src = currentUrl;
          detailHeroImage.alt = `${detailGalleryProjectTitle} - Foto ${detailGalleryCurrentIndex + 1}`;
          detailHeroImage.style.opacity = '1';
          detailHeroImage.style.transform = 'scale(1)';
        }, 110);
      } else {
        detailHeroImage.src = currentUrl;
        detailHeroImage.alt = `${detailGalleryProjectTitle} - Foto ${detailGalleryCurrentIndex + 1}`;
        detailHeroImage.style.opacity = '1';
        detailHeroImage.style.transform = 'scale(1)';
      }
    }

    if (galleryCounterText) {
      galleryCounterText.textContent = `${detailGalleryCurrentIndex + 1} / ${detailGalleryImages.length}`;
    }

    if (galleryThumbnailsStrip) {
      const thumbBtns = galleryThumbnailsStrip.querySelectorAll('.gallery-thumb-btn');
      thumbBtns.forEach((btn, idx) => {
        if (idx === detailGalleryCurrentIndex) {
          btn.classList.add('is-active');
          btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
          btn.classList.remove('is-active');
        }
      });
    }
  }

  function setupDetailGallery(project) {
    detailGalleryProjectTitle = project.titel || 'Project';
    let images = Array.isArray(project.afbeeldingen) && project.afbeeldingen.length > 0
      ? project.afbeeldingen.filter(Boolean)
      : (project.afbeeldingUrl ? [project.afbeeldingUrl] : []);

    if (images.length === 0) {
      images = ['https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80'];
    }

    detailGalleryImages = images.slice(0, 10);
    detailGalleryCurrentIndex = 0;

    const hasMultiple = detailGalleryImages.length > 1;

    // Toon of verberg galerijknoppen, teller en miniaturenstrip
    if (galleryPrevBtn) galleryPrevBtn.classList.toggle('hidden', !hasMultiple);
    if (galleryNextBtn) galleryNextBtn.classList.toggle('hidden', !hasMultiple);
    if (galleryCounterPill) galleryCounterPill.classList.toggle('hidden', !hasMultiple);
    if (galleryThumbnailsStrip) galleryThumbnailsStrip.classList.toggle('hidden', !hasMultiple);

    // Bouw thumbnails voor tot maximaal 10 foto's
    if (galleryThumbnailsStrip) {
      if (hasMultiple) {
        galleryThumbnailsStrip.innerHTML = detailGalleryImages.map((imgUrl, idx) => `
          <button type="button" class="gallery-thumb-btn ${idx === 0 ? 'is-active' : ''}" data-index="${idx}" aria-label="Foto ${idx + 1} van ${detailGalleryImages.length} bekijken">
            <img src="${escapeHtml(imgUrl)}" alt="Miniatuur ${idx + 1}" class="gallery-thumb-img" loading="lazy" />
          </button>
        `).join('');

        galleryThumbnailsStrip.querySelectorAll('.gallery-thumb-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-index') || '0', 10);
            updateDetailGalleryView(idx);
          });
        });
      } else {
        galleryThumbnailsStrip.innerHTML = '';
      }
    }

    if (detailHeroImage) {
      detailHeroImage.onerror = function () {
        this.onerror = null;
        this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600" fill="%230f172a"><rect width="100%" height="100%" fill="%230f172a"/><text x="50%" y="50%" font-family="Inter, sans-serif" font-size="28" font-weight="600" fill="%236366f1" text-anchor="middle" dominant-baseline="middle">' + encodeURIComponent(detailGalleryProjectTitle) + '</text></svg>';
      };
    }

    updateDetailGalleryView(0, false);
  }

  // Galerij navigatie event listeners
  if (galleryPrevBtn) {
    galleryPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateDetailGalleryView(detailGalleryCurrentIndex - 1);
    });
  }
  if (galleryNextBtn) {
    galleryNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateDetailGalleryView(detailGalleryCurrentIndex + 1);
    });
  }

  // Lightbox Modal functies
  function openLightbox(index = detailGalleryCurrentIndex) {
    if (detailGalleryImages.length === 0 || !lightboxModal) return;
    detailGalleryCurrentIndex = index;
    updateLightboxView();
    lightboxModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function updateLightboxView() {
    if (!lightboxImg || detailGalleryImages.length === 0) return;
    const url = detailGalleryImages[detailGalleryCurrentIndex];
    lightboxImg.src = url;
    if (lightboxCaption) lightboxCaption.textContent = `${detailGalleryProjectTitle} - Foto ${detailGalleryCurrentIndex + 1}`;
    if (lightboxCounter) lightboxCounter.textContent = `${detailGalleryCurrentIndex + 1} / ${detailGalleryImages.length}`;

    const hasMulti = detailGalleryImages.length > 1;
    if (lightboxPrevBtn) lightboxPrevBtn.style.display = hasMulti ? 'flex' : 'none';
    if (lightboxNextBtn) lightboxNextBtn.style.display = hasMulti ? 'flex' : 'none';
  }

  if (galleryZoomBtn) {
    galleryZoomBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox();
    });
  }
  if (detailHeroImage) {
    detailHeroImage.addEventListener('click', () => openLightbox());
  }
  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxPrevBtn) {
    lightboxPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      detailGalleryCurrentIndex = (detailGalleryCurrentIndex - 1 + detailGalleryImages.length) % detailGalleryImages.length;
      updateLightboxView();
      updateDetailGalleryView(detailGalleryCurrentIndex, false);
    });
  }
  if (lightboxNextBtn) {
    lightboxNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      detailGalleryCurrentIndex = (detailGalleryCurrentIndex + 1) % detailGalleryImages.length;
      updateLightboxView();
      updateDetailGalleryView(detailGalleryCurrentIndex, false);
    });
  }
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (lightboxModal && !lightboxModal.classList.contains('hidden')) {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        detailGalleryCurrentIndex = (detailGalleryCurrentIndex - 1 + detailGalleryImages.length) % detailGalleryImages.length;
        updateLightboxView();
        updateDetailGalleryView(detailGalleryCurrentIndex, false);
      } else if (e.key === 'ArrowRight') {
        detailGalleryCurrentIndex = (detailGalleryCurrentIndex + 1) % detailGalleryImages.length;
        updateLightboxView();
        updateDetailGalleryView(detailGalleryCurrentIndex, false);
      }
    }
  });

  function renderProjectDetailPage(projectId) {
    const projects = getProjectsData();
    const projectIndex = projects.findIndex(p => p.id === projectId);
    const project = projectIndex !== -1 ? projects[projectIndex] : null;
    currentActiveProjectId = projectId;
    const isAdmin = isAdminLoggedIn();

    if (!project) {
      if (projectDetailView) {
        projectDetailView.innerHTML = `
          <div class="container detail-container" style="text-align: center; padding: 5rem 1rem;">
            <h1 class="detail-hero-title">Project niet gevonden</h1>
            <p class="detail-hero-lead" style="margin: 1rem auto 2rem auto;">
              Het opgevraagde project <strong>"${escapeHtml(projectId)}"</strong> kon niet worden gevonden.
            </p>
            <a href="#projecten" class="btn btn-primary">Terug naar Projecten</a>
          </div>
        `;
        projectDetailView.classList.remove('hidden');
      }
      if (homeView) homeView.classList.add('hidden');
      return;
    }

    document.title = `${project.titel} | Tygo van Kolfschoten`;

    const crumbTitle = document.getElementById('crumb-project-title');
    if (crumbTitle) crumbTitle.textContent = project.titel;

    const tagsContainer = document.getElementById('detail-tags-container');
    if (tagsContainer) {
      tagsContainer.innerHTML = (project.tags || []).map(t => 
        `<span class="badge-tag">${escapeHtml(t)}</span>`
      ).join('');
    }

    const titleEl = document.getElementById('detail-project-title');
    const leadEl = document.getElementById('detail-project-lead');
    if (titleEl) titleEl.textContent = project.titel;
    if (leadEl) leadEl.textContent = project.korteOmschrijving || '';

    const liveBtn = document.getElementById('detail-btn-live');
    const githubBtn = document.getElementById('detail-btn-github');
    const sidebarLiveBtn = document.getElementById('detail-sidebar-live-btn');
    const sidebarGithubBtn = document.getElementById('detail-sidebar-github-btn');

    if (liveBtn) {
      if (project.liveDemoUrl) {
        liveBtn.href = project.liveDemoUrl;
        liveBtn.classList.remove('hidden');
      } else {
        liveBtn.classList.add('hidden');
      }
    }
    if (sidebarLiveBtn) {
      if (project.liveDemoUrl) {
        sidebarLiveBtn.href = project.liveDemoUrl;
        sidebarLiveBtn.classList.remove('hidden');
      } else {
        sidebarLiveBtn.classList.add('hidden');
      }
    }

    if (githubBtn) {
      if (project.githubUrl) {
        githubBtn.href = project.githubUrl;
        githubBtn.classList.remove('hidden');
      } else {
        githubBtn.classList.add('hidden');
      }
    }
    if (sidebarGithubBtn) {
      if (project.githubUrl) {
        sidebarGithubBtn.href = project.githubUrl;
        sidebarGithubBtn.classList.remove('hidden');
      } else {
        sidebarGithubBtn.classList.add('hidden');
      }
    }

    // Detail Admin Acties (alleen tonen aan beheerder Tygo)
    const detailAdminBar = document.getElementById('detail-admin-actions-bar');
    if (detailAdminBar) {
      if (isAdmin) {
        detailAdminBar.classList.remove('hidden');
      } else {
        detailAdminBar.classList.add('hidden');
      }
    }

    // Initialiseer fotogalerij voor dit project (tot 10 foto's)
    setupDetailGallery(project);

    const longDescEl = document.getElementById('detail-long-desc');
    if (longDescEl) {
      const paragraphs = (project.langeOmschrijving || project.korteOmschrijving || '')
        .split('\n\n')
        .map(p => p.trim())
        .filter(Boolean);

      longDescEl.innerHTML = paragraphs.length > 0 
        ? paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('')
        : `<p>${escapeHtml(project.korteOmschrijving || '')}</p>`;
    }

    const problemTextEl = document.getElementById('detail-problem-text');
    const roleTextEl = document.getElementById('detail-role-text');

    if (problemTextEl) {
      problemTextEl.textContent = project.probleem || 
        'Traditionele oplossingen vereisen veel handmatig werk en bieden onvoldoende gepersonaliseerde AI-ondersteuning om dit vraagstuk efficiënt aan te pakken.';
    }

    if (roleTextEl) {
      roleTextEl.textContent = project.mijnRol || 
        'Als AI-student was ik verantwoordelijk voor de volledige realisatie: van probleemverkenning en modelarchitectuur tot en met de frontend interface en integratie.';
    }

    const featuresListEl = document.getElementById('detail-features-list');
    if (featuresListEl) {
      const features = Array.isArray(project.uniekeFuncties) && project.uniekeFuncties.length > 0
        ? project.uniekeFuncties
        : [
            "Doelgerichte AI-architectuur ontworpen voor betrouwbaarheid en snelheid",
            "Gebruiksvriendelijke interface met heldere feedback en statusindicatoren",
            "Privacy-bewust databeheer en geoptimaliseerde API-aanroepen",
            "Modulaire opzet voor continue doorontwikkeling en uitbreiding"
          ];

      featuresListEl.innerHTML = features.map(feat => `
        <li class="feature-item">
          <span class="feature-check-icon" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </span>
          <span>${escapeHtml(feat)}</span>
        </li>
      `).join('');
    }

    const sidebarTagsEl = document.getElementById('detail-sidebar-tags');
    if (sidebarTagsEl) {
      sidebarTagsEl.innerHTML = (project.tags || []).map(t => 
        `<span class="tech-tag">${escapeHtml(t)}</span>`
      ).join('');
    }

    const prevIndex = (projectIndex - 1 + projects.length) % projects.length;
    const nextIndex = (projectIndex + 1) % projects.length;
    const prevProject = projects[prevIndex];
    const nextProject = projects[nextIndex];

    const prevLink = document.getElementById('detail-prev-project');
    const prevTitle = document.getElementById('detail-prev-title');
    const nextLink = document.getElementById('detail-next-project');
    const nextTitle = document.getElementById('detail-next-title');

    if (prevLink && prevTitle && prevProject) {
      prevLink.href = `#project/${encodeURIComponent(prevProject.id)}`;
      prevTitle.textContent = prevProject.titel;
    }

    if (nextLink && nextTitle && nextProject) {
      nextLink.href = `#project/${encodeURIComponent(nextProject.id)}`;
      nextTitle.textContent = nextProject.titel;
    }
  }

  function handleRouting() {
    const hash = window.location.hash || '';

    if (hash === '#admin') {
      if (isAdminLoggedIn()) {
        showAdminToast('Beheerdersmodus is actief. Welkom Tygo!', '🛡️');
        window.location.hash = '#projecten';
      } else {
        openAdminLoginModal();
      }
      return;
    }

    if (hash.startsWith('#project/')) {
      const projectId = decodeURIComponent(hash.replace('#project/', '').split('?')[0].trim());
      if (homeView) homeView.classList.add('hidden');
      if (projectDetailView) projectDetailView.classList.remove('hidden');

      renderProjectDetailPage(projectId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (homeView) homeView.classList.remove('hidden');
      if (projectDetailView) projectDetailView.classList.add('hidden');
      document.title = 'Tygo van Kolfschoten | Portfolio';

      if (hash && hash !== '#' && hash !== '#home') {
        const targetEl = document.querySelector(hash);
        if (targetEl) {
          setTimeout(() => {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 50);
        }
      }
    }
  }

  window.addEventListener('hashchange', handleRouting);
  handleRouting();

  // Knoppen op de detailpagina voor bewerken & verwijderen
  const detailBtnEdit = document.getElementById('detail-btn-edit-proj');
  const detailBtnDelete = document.getElementById('detail-btn-delete-proj');

  if (detailBtnEdit) {
    detailBtnEdit.addEventListener('click', () => {
      if (currentActiveProjectId) {
        openEditProjectModal(currentActiveProjectId);
      }
    });
  }

  if (detailBtnDelete) {
    detailBtnDelete.addEventListener('click', () => {
      if (currentActiveProjectId) {
        handleDeleteProject(currentActiveProjectId);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 6. Project Modal (Toevoegen én Bewerken - Beveiligd)
  // --------------------------------------------------------------------------
  const modalBackdrop = document.getElementById('project-modal');
  const btnOpenModal = document.getElementById('btn-open-add-project');
  const barBtnAdd = document.getElementById('bar-btn-add-project');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnCancelModal = document.getElementById('btn-cancel-modal');
  const addProjectForm = document.getElementById('add-project-form');

  const inputOriginalId = document.getElementById('form-edit-original-id');
  const modalHeading = document.getElementById('modal-heading');
  const modalSubmitBtn = document.getElementById('btn-save-project');

  const inputTitle = document.getElementById('form-project-title');
  const inputId = document.getElementById('form-project-id');
  const inputShort = document.getElementById('form-project-short');
  const inputLong = document.getElementById('form-project-long');
  const inputProblem = document.getElementById('form-project-problem');
  const inputRole = document.getElementById('form-project-role');
  const inputFeatures = document.getElementById('form-project-features');
  const inputTags = document.getElementById('form-project-tags');
  const inputImage = document.getElementById('form-project-image');
  const inputLive = document.getElementById('form-project-live');
  const inputGithub = document.getElementById('form-project-github');

  // ==========================================================================
  // Multi-Photo Manager (tot maximaal 10 foto's per project)
  // ==========================================================================
  let currentModalPhotos = []; // Array met foto URLs / dataURLs (max 10)

  const photoCountCurrent = document.getElementById('photo-count-current');
  const photoCounterBadge = document.getElementById('photo-counter-badge');
  const projectPhotosGrid = document.getElementById('project-photos-grid');
  const projectImageDropzone = document.getElementById('project-image-dropzone');
  const formProjectImageFile = document.getElementById('form-project-image-file');
  const dropzoneEmptyState = document.getElementById('dropzone-empty-state');
  const dropzoneCompactState = document.getElementById('dropzone-compact-state');
  const photosMaxNotice = document.getElementById('photos-max-notice');
  const dropzoneUrlSwitch = document.getElementById('dropzone-url-switch');
  const btnToggleUrlInput = document.getElementById('btn-toggle-url-input');
  const urlInputContainer = document.getElementById('url-input-container');
  const inputImageUrlAlt = document.getElementById('form-project-image-url-alt');
  const btnAddImageUrl = document.getElementById('btn-add-image-url');

  let idTouchedByUser = false;

  // Afbeelding optimaliseren (verkleinen naar max 1200px voor soepele offline/local werking)
  function optimizeProjectImage(file) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        reject(new Error('Kies een geldige afbeelding.'));
        return;
      }
      if (file.type === 'image/svg+xml') {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1200;
          let w = img.width;
          let h = img.height;

          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target.result);
            return;
          }

          ctx.drawImage(img, 0, 0, w, h);
          try {
            const webp = canvas.toDataURL('image/webp', 0.85);
            if (webp && webp.startsWith('data:image/webp')) {
              resolve(webp);
              return;
            }
          } catch (err) {}
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function renderModalPhotosGrid() {
    const count = currentModalPhotos.length;
    if (photoCountCurrent) photoCountCurrent.textContent = count;
    if (photoCounterBadge) {
      photoCounterBadge.classList.toggle('is-full', count >= 10);
    }
    if (inputImage) {
      inputImage.value = currentModalPhotos[0] || '';
    }

    if (count === 0) {
      if (projectPhotosGrid) {
        projectPhotosGrid.innerHTML = '';
        projectPhotosGrid.classList.add('hidden');
      }
      if (projectImageDropzone) {
        projectImageDropzone.classList.remove('hidden');
        projectImageDropzone.classList.remove('is-compact');
      }
      if (dropzoneEmptyState) dropzoneEmptyState.classList.remove('hidden');
      if (dropzoneCompactState) dropzoneCompactState.classList.add('hidden');
      if (photosMaxNotice) photosMaxNotice.classList.add('hidden');
      if (dropzoneUrlSwitch) dropzoneUrlSwitch.classList.remove('hidden');
      return;
    }

    if (count >= 10) {
      if (projectImageDropzone) projectImageDropzone.classList.add('hidden');
      if (photosMaxNotice) photosMaxNotice.classList.remove('hidden');
      if (dropzoneUrlSwitch) dropzoneUrlSwitch.classList.add('hidden');
    } else {
      if (projectImageDropzone) {
        projectImageDropzone.classList.remove('hidden');
        projectImageDropzone.classList.add('is-compact');
      }
      if (dropzoneEmptyState) dropzoneEmptyState.classList.add('hidden');
      if (dropzoneCompactState) dropzoneCompactState.classList.remove('hidden');
      if (photosMaxNotice) photosMaxNotice.classList.add('hidden');
      if (dropzoneUrlSwitch) dropzoneUrlSwitch.classList.remove('hidden');
    }

    if (projectPhotosGrid) {
      projectPhotosGrid.classList.remove('hidden');
      projectPhotosGrid.innerHTML = currentModalPhotos.map((photoUrl, idx) => {
        const isCover = idx === 0;
        return `
          <div class="photo-tile ${isCover ? 'is-cover' : ''}" data-photo-index="${idx}">
            <img src="${escapeHtml(photoUrl)}" alt="Foto ${idx + 1}" class="photo-tile-img" />
            ${isCover ? `
              <span class="photo-cover-badge">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                Hoofdfoto
              </span>
            ` : `
              <span class="photo-index-badge">#${idx + 1}</span>
            `}
            <div class="photo-tile-overlay">
              <div class="photo-overlay-top">
                ${!isCover ? `
                  <button type="button" class="photo-btn-make-cover" data-action="cover" data-index="${idx}" title="Stel in als hoofdfoto">
                    ★ Maak Hoofd
                  </button>
                ` : '<span></span>'}
              </div>
              <div class="photo-overlay-bottom">
                <div style="display: flex; gap: 4px;">
                  ${idx > 0 ? `
                    <button type="button" class="photo-btn-icon" data-action="left" data-index="${idx}" title="Verplaats naar links">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                  ` : ''}
                  ${idx < count - 1 ? `
                    <button type="button" class="photo-btn-icon" data-action="right" data-index="${idx}" title="Verplaats naar rechts">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                  ` : ''}
                </div>
                <button type="button" class="photo-btn-icon photo-btn-delete" data-action="delete" data-index="${idx}" title="Verwijder foto">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');

      projectPhotosGrid.querySelectorAll('button[data-action]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const action = btn.getAttribute('data-action');
          const idx = parseInt(btn.getAttribute('data-index') || '0', 10);

          if (action === 'delete') {
            currentModalPhotos.splice(idx, 1);
            renderModalPhotosGrid();
          } else if (action === 'cover') {
            if (idx > 0 && idx < currentModalPhotos.length) {
              const selected = currentModalPhotos.splice(idx, 1)[0];
              currentModalPhotos.unshift(selected);
              renderModalPhotosGrid();
            }
          } else if (action === 'left') {
            if (idx > 0) {
              const temp = currentModalPhotos[idx];
              currentModalPhotos[idx] = currentModalPhotos[idx - 1];
              currentModalPhotos[idx - 1] = temp;
              renderModalPhotosGrid();
            }
          } else if (action === 'right') {
            if (idx < currentModalPhotos.length - 1) {
              const temp = currentModalPhotos[idx];
              currentModalPhotos[idx] = currentModalPhotos[idx + 1];
              currentModalPhotos[idx + 1] = temp;
              renderModalPhotosGrid();
            }
          }
        });
      });
    }
  }

  async function handleFilesUpload(fileList) {
    if (!fileList || fileList.length === 0) return;
    const remainingSlots = 10 - currentModalPhotos.length;
    if (remainingSlots <= 0) {
      alert("U heeft reeds het maximum van 10 foto's bereikt. Verwijder eerst een foto om een nieuwe te kunnen uploaden.");
      return;
    }

    const filesToProcess = Array.from(fileList).filter(f => f.type.startsWith('image/')).slice(0, remainingSlots);

    if (filesToProcess.length === 0) {
      alert('Selecteer a.u.b. geldige afbeeldingsbestanden (PNG, JPG, JPEG, WEBP of SVG).');
      return;
    }

    if (fileList.length > remainingSlots) {
      alert(`Er kunnen maximaal nog ${remainingSlots} foto('s) worden toegevoegd (maximum van 10 foto's per project).`);
    }

    for (const file of filesToProcess) {
      try {
        const optimizedDataUrl = await optimizeProjectImage(file);
        currentModalPhotos.push(optimizedDataUrl);
      } catch (err) {
        console.error('Fout bij optimaliseren van afbeelding:', file.name, err);
      }
    }

    renderModalPhotosGrid();
    if (formProjectImageFile) formProjectImageFile.value = '';
  }

  function handleAddImageUrl() {
    if (!inputImageUrlAlt) return;
    const url = inputImageUrlAlt.value.trim();
    if (!url) return;
    if (currentModalPhotos.length >= 10) {
      alert("U heeft al het maximum van 10 foto's bereikt. Verwijder eerst een foto om een nieuwe weblink toe te voegen.");
      return;
    }
    currentModalPhotos.push(url);
    inputImageUrlAlt.value = '';
    renderModalPhotosGrid();
  }

  if (btnAddImageUrl) {
    btnAddImageUrl.addEventListener('click', (e) => {
      e.stopPropagation();
      handleAddImageUrl();
    });
  }
  if (inputImageUrlAlt) {
    inputImageUrlAlt.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddImageUrl();
      }
    });
  }

  function resetProjectPhotos() {
    currentModalPhotos = [];
    if (formProjectImageFile) formProjectImageFile.value = '';
    if (inputImageUrlAlt) inputImageUrlAlt.value = '';
    if (inputImage) inputImage.value = '';
    if (urlInputContainer) urlInputContainer.classList.add('hidden');
    renderModalPhotosGrid();
  }

  // Drag & drop handlers op dropzone
  if (projectImageDropzone) {
    ['dragenter', 'dragover'].forEach(eventName => {
      projectImageDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        projectImageDropzone.classList.add('is-dragover');
      });
    });

    ['dragleave', 'dragend'].forEach(eventName => {
      projectImageDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        projectImageDropzone.classList.remove('is-dragover');
      });
    });

    projectImageDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      projectImageDropzone.classList.remove('is-dragover');

      const files = e.dataTransfer ? e.dataTransfer.files : null;
      if (files && files.length > 0) {
        handleFilesUpload(files);
      }
    });

    projectImageDropzone.addEventListener('click', (e) => {
      if (e.target.closest('#btn-toggle-url-input') || e.target.closest('.url-input-container')) {
        return;
      }
      if (formProjectImageFile) formProjectImageFile.click();
    });

    projectImageDropzone.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (formProjectImageFile) formProjectImageFile.click();
      }
    });
  }

  if (formProjectImageFile) {
    formProjectImageFile.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFilesUpload(e.target.files);
      }
    });
  }

  if (btnToggleUrlInput && urlInputContainer) {
    btnToggleUrlInput.addEventListener('click', (e) => {
      e.stopPropagation();
      urlInputContainer.classList.toggle('hidden');
      if (!urlInputContainer.classList.contains('hidden') && inputImageUrlAlt) {
        inputImageUrlAlt.focus();
      }
    });
  }

  function openAddProjectModal() {
    if (!isAdminLoggedIn()) {
      openAdminLoginModal();
      return;
    }
    if (!modalBackdrop) return;

    if (modalHeading) modalHeading.textContent = 'Nieuw Project Toevoegen';
    if (modalSubmitBtn) modalSubmitBtn.textContent = 'Project Toevoegen & Opslaan';
    if (inputOriginalId) inputOriginalId.value = '';
    if (inputId) inputId.disabled = false;

    if (addProjectForm) addProjectForm.reset();
    resetProjectPhotos();
    idTouchedByUser = false;

    modalBackdrop.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    if (inputTitle) inputTitle.focus();
  }

  function openEditProjectModal(projectId) {
    if (!isAdminLoggedIn()) {
      openAdminLoginModal();
      return;
    }
    if (!modalBackdrop) return;

    const projects = getProjectsData();
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    if (modalHeading) modalHeading.textContent = `Project Bewerken: ${project.titel}`;
    if (modalSubmitBtn) modalSubmitBtn.textContent = 'Wijzigingen Opslaan';
    if (inputOriginalId) inputOriginalId.value = project.id;

    if (inputTitle) inputTitle.value = project.titel || '';
    if (inputId) {
      inputId.value = project.id;
      inputId.disabled = true; // URL-slug stabiel houden tijdens bewerking
    }
    if (inputShort) inputShort.value = project.korteOmschrijving || '';
    if (inputLong) inputLong.value = project.langeOmschrijving || '';
    if (inputProblem) inputProblem.value = project.probleem || '';
    if (inputRole) inputRole.value = project.mijnRol || '';
    if (inputFeatures) inputFeatures.value = Array.isArray(project.uniekeFuncties) ? project.uniekeFuncties.join(', ') : '';
    if (inputTags) inputTags.value = Array.isArray(project.tags) ? project.tags.join(', ') : '';
    if (inputLive) inputLive.value = project.liveDemoUrl || '';
    if (inputGithub) inputGithub.value = project.githubUrl || '';

    // Laad bestaande foto's (tot maximaal 10)
    let images = Array.isArray(project.afbeeldingen) && project.afbeeldingen.length > 0
      ? [...project.afbeeldingen]
      : (project.afbeeldingUrl ? [project.afbeeldingUrl] : []);
    
    currentModalPhotos = images.slice(0, 10);
    renderModalPhotosGrid();

    modalBackdrop.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    if (inputTitle) inputTitle.focus();
  }

  function closeProjectModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.add('hidden');
    document.body.style.overflow = '';
    if (addProjectForm) addProjectForm.reset();
    resetProjectPhotos();
    if (inputOriginalId) inputOriginalId.value = '';
    if (inputId) inputId.disabled = false;
    idTouchedByUser = false;
  }

  function handleDeleteProject(projectId) {
    if (!isAdminLoggedIn()) {
      openAdminLoginModal();
      return;
    }
    const projects = getProjectsData();
    const project = projects.find(p => p.id === projectId);
    const title = project ? project.titel : projectId;

    const confirmed = window.confirm(`Weet u zeker dat u het project "${title}" wilt verwijderen? Dit kan niet ongedaan worden gemaakt.`);
    if (!confirmed) return;

    deleteProject(projectId);
    showAdminToast(`Project "${title}" is verwijderd.`, '🗑️');

    renderProjectsGrid();

    // Als we nu op de detailpagina van dit verwijderde project stonden, ga terug naar het overzicht
    const hash = window.location.hash || '';
    if (hash === `#project/${projectId}` || hash === `#project/${encodeURIComponent(projectId)}`) {
      window.location.hash = '#projecten';
    }
  }

  if (btnOpenModal) btnOpenModal.addEventListener('click', openAddProjectModal);
  if (barBtnAdd) barBtnAdd.addEventListener('click', openAddProjectModal);
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeProjectModal);
  if (btnCancelModal) btnCancelModal.addEventListener('click', closeProjectModal);

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeProjectModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && !modalBackdrop.classList.contains('hidden')) {
      closeProjectModal();
    }
  });

  // Slug generatie bij intypen titel (alleen bij nieuw project)
  if (inputTitle && inputId) {
    inputId.addEventListener('input', () => {
      idTouchedByUser = true;
    });

    inputTitle.addEventListener('input', () => {
      if (!idTouchedByUser && (!inputOriginalId || !inputOriginalId.value)) {
        const slug = inputTitle.value
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
        inputId.value = slug;
      }
    });
  }

  // Formulier opslaan (Toevoegen of Updaten)
  if (addProjectForm) {
    addProjectForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Veiligheidscontrole: Alleen beheerder mag opslaan
      if (!isAdminLoggedIn()) {
        alert('Toegang geweigerd. U moet ingelogd zijn als beheerder om projecten te bewerken.');
        closeProjectModal();
        openAdminLoginModal();
        return;
      }

      const isEditMode = inputOriginalId && inputOriginalId.value.trim() !== '';
      const originalId = isEditMode ? inputOriginalId.value.trim() : null;

      const title = inputTitle ? inputTitle.value.trim() : '';
      let id = inputId ? inputId.value.trim() : '';
      const shortDesc = inputShort ? inputShort.value.trim() : '';
      const longDesc = inputLong ? inputLong.value.trim() : '';
      const problem = inputProblem ? inputProblem.value.trim() : '';
      const role = inputRole ? inputRole.value.trim() : '';
      const featuresRaw = inputFeatures ? inputFeatures.value.trim() : '';
      const tagsRaw = inputTags ? inputTags.value.trim() : '';
      
      // Foto's verwerken (tot maximaal 10 foto's per project)
      let photoList = currentModalPhotos.filter(Boolean).slice(0, 10);
      let imageUrl = photoList[0] || (inputImage ? inputImage.value.trim() : '');
      if (!imageUrl && inputImageUrlAlt && inputImageUrlAlt.value.trim()) {
        imageUrl = inputImageUrlAlt.value.trim();
        photoList = [imageUrl];
      }

      const liveUrl = inputLive ? inputLive.value.trim() : '';
      const githubUrl = inputGithub ? inputGithub.value.trim() : '';

      if (!title || !shortDesc || !longDesc) {
        alert('Vul alstublieft minimaal de titel, korte omschrijving en uitgebreide toelichting in.');
        return;
      }

      if (!id) {
        id = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      }

      if (!imageUrl) {
        imageUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
        photoList = [imageUrl];
      }

      const tags = tagsRaw
        ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean)
        : ['AI', 'Portfolio'];

      const uniekeFuncties = featuresRaw
        ? featuresRaw.split(',').map(f => f.trim()).filter(Boolean)
        : [];

      const projectDataPayload = {
        titel: title,
        korteOmschrijving: shortDesc,
        langeOmschrijving: longDesc,
        afbeeldingUrl: imageUrl,
        afbeeldingen: photoList,
        tags,
        liveDemoUrl: liveUrl,
        githubUrl: githubUrl,
        probleem: problem,
        mijnRol: role,
        uniekeFuncties: uniekeFuncties.length > 0 ? uniekeFuncties : undefined
      };

      if (isEditMode && originalId) {
        updateProject(originalId, projectDataPayload);
        showAdminToast(`Project "${title}" succesvol bijgewerkt.`, '✏️');
        renderProjectsGrid();
        closeProjectModal();

        // Als we momenteel op de detailpagina van dit project zijn, werk de inhoud direct bij
        if (currentActiveProjectId === originalId) {
          renderProjectDetailPage(originalId);
        }
      } else {
        const newProject = {
          ...projectDataPayload,
          id
        };
        addProject(newProject);
        showAdminToast(`Nieuw project "${title}" succesvol toegevoegd!`, '✨');
        renderProjectsGrid();
        closeProjectModal();

        // Direct naar de nieuwe detailpagina navigeren
        window.location.hash = `#project/${encodeURIComponent(newProject.id)}`;
      }
    });
  }

  // --------------------------------------------------------------------------
  // 7. Beheerders Authenticatie (Login Modal & Sessiebeheer)
  // --------------------------------------------------------------------------
  const adminLoginModal = document.getElementById('admin-login-modal');
  const btnOpenAdminLogin = document.getElementById('btn-open-admin-login');
  const btnCloseAdminLogin = document.getElementById('btn-close-admin-login');
  const btnCancelAdminLogin = document.getElementById('btn-cancel-admin-login');
  const adminLoginForm = document.getElementById('admin-login-form');
  const adminPassInput = document.getElementById('admin-passcode');
  const adminRememberCheckbox = document.getElementById('admin-remember-me');
  const adminLoginError = document.getElementById('admin-login-error');

  const btnLogoutBar = document.getElementById('bar-btn-logout');

  function openAdminLoginModal() {
    if (!adminLoginModal) return;
    if (adminLoginError) {
      adminLoginError.style.display = 'none';
      adminLoginError.textContent = '';
    }
    if (adminPassInput) adminPassInput.value = '';
    adminLoginModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    if (adminPassInput) setTimeout(() => adminPassInput.focus(), 80);
  }

  function closeAdminLoginModal() {
    if (!adminLoginModal) return;
    adminLoginModal.classList.add('hidden');
    document.body.style.overflow = '';
    if (adminPassInput) adminPassInput.value = '';
  }

  if (btnOpenAdminLogin) {
    btnOpenAdminLogin.addEventListener('click', () => {
      if (isAdminLoggedIn()) {
        showAdminToast('Beheerdersmodus is momenteel al actief.', '🛡️');
      } else {
        openAdminLoginModal();
      }
    });
  }

  if (btnCloseAdminLogin) btnCloseAdminLogin.addEventListener('click', closeAdminLoginModal);
  if (btnCancelAdminLogin) btnCancelAdminLogin.addEventListener('click', closeAdminLoginModal);

  if (adminLoginModal) {
    adminLoginModal.addEventListener('click', (e) => {
      if (e.target === adminLoginModal) closeAdminLoginModal();
    });
  }

  // Wachtwoord zichtbaarheid wisselen (oogje)
  const btnToggleLoginPass = document.getElementById('btn-toggle-login-pass');
  if (btnToggleLoginPass && adminPassInput) {
    btnToggleLoginPass.addEventListener('click', () => {
      const isPassword = adminPassInput.type === 'password';
      adminPassInput.type = isPassword ? 'text' : 'password';
      btnToggleLoginPass.innerHTML = isPassword
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="eye-off-icon"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="eye-icon"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    });
  }

  // Sneltoets Ctrl + Shift + A of Cmd + Shift + A
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
      e.preventDefault();
      if (isAdminLoggedIn()) {
        showAdminToast('U bent al ingelogd als beheerder.', '🛡️');
      } else {
        openAdminLoginModal();
      }
    }
    if (e.key === 'Escape' && adminLoginModal && !adminLoginModal.classList.contains('hidden')) {
      closeAdminLoginModal();
    }
  });

  // Login formulier verwerking
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const pass = adminPassInput ? adminPassInput.value : '';
      const remember = adminRememberCheckbox ? adminRememberCheckbox.checked : true;

      if (!pass) {
        if (adminLoginError) {
          adminLoginError.textContent = 'Voer alstublieft een wachtwoord in.';
          adminLoginError.style.display = 'block';
        }
        return;
      }

      const submitBtn = document.getElementById('btn-submit-admin-login');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Verifiëren...';
      }

      try {
        const isValid = await verifyAdminPassword(pass);
        if (isValid) {
          setAdminSession(remember);
          closeAdminLoginModal();
          updateAdminUI();
          showAdminToast('Welkom Tygo! Beheerdersmodus succesvol geactiveerd.', '🔓');
        } else {
          if (adminLoginError) {
            adminLoginError.textContent = 'Onjuist wachtwoord. Alleen Tygo van Kolfschoten kan inloggen.';
            adminLoginError.style.display = 'block';
          }
          if (adminPassInput) adminPassInput.select();
        }
      } catch (err) {
        if (adminLoginError) {
          adminLoginError.textContent = 'Er is een verificatiefout opgetreden. Probeer het opnieuw.';
          adminLoginError.style.display = 'block';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Inloggen';
        }
      }
    });
  }

  // Uitloggen
  if (btnLogoutBar) {
    btnLogoutBar.addEventListener('click', () => {
      logoutAdmin();
      updateAdminUI();
      showAdminToast('U bent uitgelogd. De site staat nu in publieke bezoekersmodus.', '🔒');
    });
  }

  // --------------------------------------------------------------------------
  // 8. Wachtwoord Wijzigen Modal (Voor Tygo)
  // --------------------------------------------------------------------------
  const passwordModal = document.getElementById('admin-password-modal');
  const barBtnChangePass = document.getElementById('bar-btn-change-pass');
  const btnClosePassModal = document.getElementById('btn-close-pass-modal');
  const btnCancelPassModal = document.getElementById('btn-cancel-pass-modal');
  const passwordForm = document.getElementById('admin-password-form');
  const currentPassInput = document.getElementById('admin-current-pass');
  const newPassInput = document.getElementById('admin-new-pass');
  const confirmPassInput = document.getElementById('admin-confirm-pass');
  const passErrorEl = document.getElementById('admin-pass-error');
  const passSuccessEl = document.getElementById('admin-pass-success');

  function openPasswordModal() {
    if (!isAdminLoggedIn()) {
      openAdminLoginModal();
      return;
    }
    if (!passwordModal) return;
    if (passwordForm) passwordForm.reset();
    if (passErrorEl) passErrorEl.style.display = 'none';
    if (passSuccessEl) passSuccessEl.style.display = 'none';
    passwordModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    if (currentPassInput) setTimeout(() => currentPassInput.focus(), 80);
  }

  function closePasswordModal() {
    if (!passwordModal) return;
    passwordModal.classList.add('hidden');
    document.body.style.overflow = '';
    if (passwordForm) passwordForm.reset();
  }

  if (barBtnChangePass) barBtnChangePass.addEventListener('click', openPasswordModal);
  if (btnClosePassModal) btnClosePassModal.addEventListener('click', closePasswordModal);
  if (btnCancelPassModal) btnCancelPassModal.addEventListener('click', closePasswordModal);

  if (passwordModal) {
    passwordModal.addEventListener('click', (e) => {
      if (e.target === passwordModal) closePasswordModal();
    });
  }

  if (passwordForm) {
    passwordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (passErrorEl) passErrorEl.style.display = 'none';
      if (passSuccessEl) passSuccessEl.style.display = 'none';

      const curPass = currentPassInput ? currentPassInput.value : '';
      const newPass = newPassInput ? newPassInput.value : '';
      const confirmPass = confirmPassInput ? confirmPassInput.value : '';

      const isCurrentValid = await verifyAdminPassword(curPass);
      if (!isCurrentValid) {
        if (passErrorEl) {
          passErrorEl.textContent = 'Het huidige wachtwoord is onjuist.';
          passErrorEl.style.display = 'block';
        }
        return;
      }

      if (newPass.length < 4) {
        if (passErrorEl) {
          passErrorEl.textContent = 'Het nieuwe wachtwoord moet minimaal 4 tekens bevatten.';
          passErrorEl.style.display = 'block';
        }
        return;
      }

      if (newPass !== confirmPass) {
        if (passErrorEl) {
          passErrorEl.textContent = 'De twee nieuwe wachtwoorden komen niet overeen.';
          passErrorEl.style.display = 'block';
        }
        return;
      }

      try {
        await changeAdminPassword(newPass);
        if (passSuccessEl) {
          passSuccessEl.textContent = 'Wachtwoord succesvol gewijzigd! Onthoud dit wachtwoord goed.';
          passSuccessEl.style.display = 'block';
        }
        showAdminToast('Uw beheerderswachtwoord is succesvol gewijzigd.', '🔑');
        setTimeout(() => {
          closePasswordModal();
        }, 1400);
      } catch (err) {
        if (passErrorEl) {
          passErrorEl.textContent = 'Fout bij opslaan: ' + err.message;
          passErrorEl.style.display = 'block';
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 9. Centrale UI-Status Sync (Admin vs Publiek)
  // --------------------------------------------------------------------------
  function updateAdminUI() {
    const isAdmin = isAdminLoggedIn();
    const adminTopBar = document.getElementById('admin-top-bar');
    const footerBtnText = document.getElementById('footer-admin-btn-text');

    if (isAdmin) {
      document.body.classList.add('has-admin-bar');
      if (adminTopBar) adminTopBar.classList.remove('hidden');
      if (footerBtnText) footerBtnText.textContent = 'Beheer (Actief)';

      document.querySelectorAll('.admin-only').forEach(el => el.classList.remove('hidden'));
      enablePhotoUploadForAdmin();
    } else {
      document.body.classList.remove('has-admin-bar');
      if (adminTopBar) adminTopBar.classList.add('hidden');
      if (footerBtnText) footerBtnText.textContent = 'Beheer';

      document.querySelectorAll('.admin-only').forEach(el => el.classList.add('hidden'));
      disablePhotoUploadForPublic();
    }

    renderProjectsGrid();

    // Werk detailpagina bij indien die nu open staat
    const hash = window.location.hash || '';
    if (hash.startsWith('#project/')) {
      const pId = decodeURIComponent(hash.replace('#project/', '').split('?')[0].trim());
      renderProjectDetailPage(pId);
    }
  }

  // --------------------------------------------------------------------------
  // 10. Smooth Scroll voor Ankerlinks
  // --------------------------------------------------------------------------
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const targetId = anchor.getAttribute('href');
    if (!targetId || targetId === '#' || targetId === '#admin') return;

    if (targetId.startsWith('#project/')) return;

    if (projectDetailView && !projectDetailView.classList.contains('hidden')) {
      if (homeView) homeView.classList.remove('hidden');
      projectDetailView.classList.add('hidden');
      document.title = 'Tygo van Kolfschoten | Portfolio';
    }

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      e.preventDefault();
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      history.pushState(null, '', targetId);
    }
  });

  // --------------------------------------------------------------------------
  // 11. Navigatie Scroll Highlighting
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  const highlightNavOnScroll = () => {
    if (homeView && homeView.classList.contains('hidden')) return;

    const scrollY = window.scrollY + 140;

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
  // 12. Contactformulier
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

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !message) {
        showFeedback('Vul alstublieft alle verplichte velden in.', 'error');
        return;
      }

      if (!emailRegex.test(email)) {
        showFeedback('Voer alstublieft een geldig e-mailadres in.', 'error');
        return;
      }

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
        alert(successMessage);
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
  // 13. Profielfoto & Uploadbeveiliging (Alleen Tygo mag uploaden)
  // --------------------------------------------------------------------------
  const heroFrame = document.getElementById('hero-image-frame');
  const fileInput = document.getElementById('photo-file-input');
  const heroImgEl = document.getElementById('hero-profile-image');
  const heroPlaceholder = document.getElementById('hero-photo-placeholder');
  const photoBadge = document.getElementById('photo-change-badge');
  const aboutImg = document.getElementById('about-avatar-image');
  const aboutPlaceholder = document.getElementById('about-avatar-placeholder');

  const STORAGE_PHOTO_KEY = 'tygo_profile_photo';

  function applyPhoto(dataUrl) {
    if (!dataUrl) return;

    if (heroImgEl) {
      heroImgEl.src = dataUrl;
      heroImgEl.classList.remove('hidden');
    }
    if (heroPlaceholder) {
      heroPlaceholder.classList.add('hidden');
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
    if (!isAdminLoggedIn()) {
      alert('Alleen de beheerder (Tygo) heeft permissie om de profielfoto aan te passen.');
      return;
    }

    if (!file || !file.type.startsWith('image/')) {
      alert('Selecteer a.u.b. een geldige afbeelding (PNG, JPG, JPEG of WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      try {
        localStorage.setItem(STORAGE_PHOTO_KEY, dataUrl);
      } catch (err) {
        console.warn('Kon foto niet in localStorage opslaan:', err);
      }
      applyPhoto(dataUrl);
      showAdminToast('Profielfoto succesvol gewijzigd!', '📸');

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

  const savedPhoto = localStorage.getItem(STORAGE_PHOTO_KEY);
  if (savedPhoto) {
    applyPhoto(savedPhoto);
  } else {
    const testImg = new Image();
    testImg.onload = () => {
      applyPhoto('/tygo-van-kolfschoten.jpg');
    };
    testImg.src = '/tygo-van-kolfschoten.jpg';
  }

  function enablePhotoUploadForAdmin() {
    if (!heroFrame) return;
    heroFrame.style.cursor = 'pointer';
    heroFrame.title = 'Klik om uw profielfoto te wijzigen (Beheer)';
    if (photoBadge) photoBadge.classList.remove('hidden');
  }

  function disablePhotoUploadForPublic() {
    if (!heroFrame) return;
    heroFrame.style.cursor = 'default';
    heroFrame.removeAttribute('title');
    if (photoBadge) photoBadge.classList.add('hidden');
  }

  if (heroFrame && fileInput) {
    heroFrame.addEventListener('click', () => {
      if (isAdminLoggedIn()) {
        fileInput.click();
      }
    });

    heroFrame.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && isAdminLoggedIn()) {
        e.preventDefault();
        fileInput.click();
      }
    });

    fileInput.addEventListener('change', (e) => {
      const files = e.target.files;
      if (files && files[0] && isAdminLoggedIn()) {
        handleImageFile(files[0]);
      }
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      heroFrame.addEventListener(eventName, (e) => {
        if (!isAdminLoggedIn()) return;
        e.preventDefault();
        e.stopPropagation();
        heroFrame.classList.add('is-dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      heroFrame.addEventListener(eventName, (e) => {
        if (!isAdminLoggedIn()) return;
        e.preventDefault();
        e.stopPropagation();
        heroFrame.classList.remove('is-dragover');
      });
    });

    heroFrame.addEventListener('drop', (e) => {
      if (!isAdminLoggedIn()) return;
      const dt = e.dataTransfer;
      const files = dt ? dt.files : null;
      if (files && files[0]) {
        handleImageFile(files[0]);
      }
    });
  }

  // Initialiseer Admin status bij het opstarten
  updateAdminUI();

  // Helper om XSS te voorkomen bij dynamische HTML injectie
  function escapeHtml(str) {
    if (!str && str !== 0) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
