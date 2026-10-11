/**
 * MATHEMATICS & FRENCH TUTOR WEBSITE
 * Educator: Shikha Arya
 * Features: Mobile Nav, Accessible Accordion, Review Modal, Form Validation,
 * and Subtle Scroll Micro-Animations.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------------------------------
   * 1. Dynamic Year in Footer
   * ------------------------------------------------------------------------- */
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* -------------------------------------------------------------------------
   * 2. Sticky Header Elevation on Scroll
   * ------------------------------------------------------------------------- */
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  /* -------------------------------------------------------------------------
   * 3. Subtle Scroll Micro-Animations (Intersection Observer)
   * ------------------------------------------------------------------------- */
  const animatedElements = document.querySelectorAll('.fade-in-up');

  if ('IntersectionObserver' in window) {
    const appearOptions = {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    };

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, appearOptions);

    animatedElements.forEach(el => {
      appearOnScroll.observe(el);
    });
  } else {
    // Fallback if IntersectionObserver is unsupported
    animatedElements.forEach(el => el.classList.add('is-visible'));
  }

  /* -------------------------------------------------------------------------
   * 4. Accessible Mobile Navigation
   * ------------------------------------------------------------------------- */
  const mobileToggle = document.getElementById('mobile-toggle');
  const siteNav = document.getElementById('site-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && siteNav) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : siteNav.classList.contains('is-open');
      if (isOpen) {
        siteNav.classList.remove('is-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      } else {
        siteNav.classList.add('is-open');
        mobileToggle.setAttribute('aria-expanded', 'true');
      }
    };

    mobileToggle.addEventListener('click', () => {
      const isCurrentlyOpen = siteNav.classList.contains('is-open');
      toggleMenu(!isCurrentlyOpen);
    });

    // Close menu when a navigation link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleMenu(true);
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && siteNav.classList.contains('is-open')) {
        toggleMenu(true);
        mobileToggle.focus();
      }
    });

    // Close when clicking outside of nav on mobile
    document.addEventListener('click', (e) => {
      if (
        siteNav.classList.contains('is-open') &&
        !siteNav.contains(e.target) &&
        !mobileToggle.contains(e.target)
      ) {
        toggleMenu(true);
      }
    });
  }

  /* -------------------------------------------------------------------------
   * 5. Accessible FAQ Accordion
   * ------------------------------------------------------------------------- */
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(button => {
    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      const panelId = button.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);

      // Close other accordions for neatness
      accordionHeaders.forEach(otherBtn => {
        if (otherBtn !== button) {
          otherBtn.setAttribute('aria-expanded', 'false');
          const otherPanelId = otherBtn.getAttribute('aria-controls');
          const otherPanel = document.getElementById(otherPanelId);
          if (otherPanel) {
            otherPanel.hidden = true;
          }
        }
      });

      // Toggle current panel
      if (isExpanded) {
        button.setAttribute('aria-expanded', 'false');
        if (panel) panel.hidden = true;
      } else {
        button.setAttribute('aria-expanded', 'true');
        if (panel) panel.hidden = false;
      }
    });
  });

  /* -------------------------------------------------------------------------
   * 6. Review Screenshot Lightbox Modal
   * ------------------------------------------------------------------------- */
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-image');
  const modalCaption = document.getElementById('modal-caption');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const viewScreenshotButtons = document.querySelectorAll('.view-original-btn');
  let lastActiveElement = null;

  const openModal = (src, alt) => {
    if (!modal || !modalImg) return;
    lastActiveElement = document.activeElement;
    modalImg.src = src;
    modalImg.alt = alt || 'Authentic review screenshot';
    if (modalCaption) {
      modalCaption.textContent = alt || 'Authentic review shared by parent via WhatsApp message.';
    }
    modal.hidden = false;
    requestAnimationFrame(() => {
      modal.classList.add('is-open');
      modalCloseBtn.focus();
    });
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('is-open');
    setTimeout(() => {
      modal.hidden = true;
      modalImg.src = '';
      document.body.style.overflow = '';
      if (lastActiveElement) {
        lastActiveElement.focus();
      }
    }, 250);
  };

  viewScreenshotButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const src = btn.getAttribute('data-img-src');
      const alt = btn.getAttribute('data-alt');
      openModal(src, alt);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hidden) {
        closeModal();
      }
    });
  }

  /* -------------------------------------------------------------------------
   * 7. Contact & Enquiry Form Validation
   * ------------------------------------------------------------------------- */
  const enquiryForm = document.getElementById('enquiry-form');
  const formStatus = document.getElementById('form-status');

  if (enquiryForm) {
    const fields = {
      name: {
        el: document.getElementById('student-name'),
        errorEl: document.getElementById('name-error'),
        validate: (val) => val.trim().length >= 2 ? '' : 'Please enter your full name.'
      },
      email: {
        el: document.getElementById('student-email'),
        errorEl: document.getElementById('email-error'),
        validate: (val) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(val.trim()) ? '' : 'Please provide a valid email address.';
        }
      },
      subject: {
        el: document.getElementById('subject-interest'),
        errorEl: document.getElementById('subject-error'),
        validate: (val) => val ? '' : 'Please select Mathematics, French, or Both.'
      },
      grade: {
        el: document.getElementById('grade-level'),
        errorEl: document.getElementById('grade-error'),
        validate: (val) => val.trim().length >= 1 ? '' : 'Please state your or your child\'s class level.'
      },
      format: {
        el: document.getElementById('lesson-format'),
        errorEl: document.getElementById('format-error'),
        validate: (val) => val ? '' : 'Please choose your preferred lesson format.'
      },
      message: {
        el: document.getElementById('student-message'),
        errorEl: document.getElementById('message-error'),
        validate: (val) => val.trim().length >= 10 ? '' : 'Please share a brief note about your goals (at least 10 characters).'
      }
    };

    // Real-time input clearing
    Object.values(fields).forEach(({ el, errorEl }) => {
      if (!el || !errorEl) return;
      el.addEventListener('input', () => {
        el.classList.remove('is-invalid');
        errorEl.textContent = '';
      });
    });

    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let hasError = false;
      const formData = {};

      // Validate each field
      Object.entries(fields).forEach(([key, { el, errorEl, validate }]) => {
        if (!el || !errorEl) return;
        const value = el.value;
        formData[key] = value.trim();
        const errorMessage = validate(value);
        if (errorMessage) {
          hasError = true;
          el.classList.add('is-invalid');
          errorEl.textContent = errorMessage;
        } else {
          el.classList.remove('is-invalid');
          errorEl.textContent = '';
        }
      });

      if (hasError) {
        if (formStatus) {
          formStatus.className = 'form-status is-error';
          formStatus.textContent = 'Please correct the highlighted fields before submitting.';
        }
        return;
      }

      // Teacher contact details updated for Shikha Arya
      const teacherEmail = 'shikhaarya170@gmail.com';
      const mailtoSubject = encodeURIComponent(`Lesson Enquiry: ${formData.subject} - ${formData.name}`);
      const mailtoBody = encodeURIComponent(
        `Hello Shikha Arya,\n\nI would like to enquire about Mathematics / French lessons.\n\n` +
        `Student/Parent Name: ${formData.name}\n` +
        `Contact Email: ${formData.email}\n` +
        `Subject of Interest: ${formData.subject}\n` +
        `Current Class/Level: ${formData.grade}\n` +
        `Preferred Format: ${formData.format}\n\n` +
        `Learning Goals / Notes:\n${formData.message}\n`
      );

      const mailtoUrl = `mailto:${teacherEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;
      const waUrl = `https://wa.me/919660216537?text=${encodeURIComponent('Hello Shikha Arya, I have submitted an enquiry for lessons for ' + formData.name)}`;

      if (formStatus) {
        formStatus.className = 'form-status is-success';
        formStatus.innerHTML = `
          <strong>Thank you, ${escapeHTML(formData.name)}!</strong><br>
          Your enquiry details are verified. 
          <a href="${mailtoUrl}" style="text-decoration:underline; font-weight:700; color:var(--color-navy);">Click here to open email client and send to shikhaarya170@gmail.com</a>, 
          or <a href="${waUrl}" target="_blank" rel="noopener noreferrer" style="text-decoration:underline; font-weight:700; color:var(--color-success);">chat immediately on WhatsApp (+91 96602 16537)</a>.
        `;
      }

      // Automatically launch mail client after 1 second
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 1200);
    });
  }

  // Utility to prevent XSS in inserted messages
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

});
