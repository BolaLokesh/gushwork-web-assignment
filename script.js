/**
 * Gushwork Assignment - Interactive Features
 * ==========================================
 * 1. Sticky Header: Appears when scrolling beyond first fold, hides on scroll up
 * 2. Image Carousel: Horizontal scroll with next/prev buttons
 * 3. Zoom on Hover: Image scaling effect on carousel items
 */

(function() {
  'use strict';

  // ========== 1. STICKY HEADER LOGIC ==========
  const stickyHeader = document.getElementById('stickyHeader');
  if (!stickyHeader) return;
  
  let lastScrollY = window.scrollY;
  let ticking = false;
  const heroSection = document.querySelector('.hero');
  let foldThreshold = 0;
  
  /**
   * Calculates the bottom position of hero section (first fold)
   * Header appears only after user scrolls past this point
   */
  function updateFoldThreshold() {
    if (heroSection) {
      const heroBottom = heroSection.getBoundingClientRect().bottom + window.scrollY;
      foldThreshold = heroBottom;
    } else {
      foldThreshold = window.innerHeight * 0.7; // fallback
    }
  }
  
  updateFoldThreshold();
  window.addEventListener('resize', () => updateFoldThreshold());
  
  /**
   * Shows/hides sticky header based on scroll direction and position
   * - Shows header when scrolling DOWN and past the fold
   * - Hides header when scrolling UP
   */
  function handleStickyHeader() {
    const currentY = window.scrollY;
    if (currentY > foldThreshold) {
      if (currentY > lastScrollY) {
        // Scrolling down - show header
        stickyHeader.classList.add('visible');
      } else {
        // Scrolling up - hide header
        stickyHeader.classList.remove('visible');
      }
    } else {
      // Above fold - keep header hidden
      stickyHeader.classList.remove('visible');
    }
    lastScrollY = currentY;
    ticking = false;
  }
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleStickyHeader();
        ticking = false;
      });
      ticking = true;
    }
  });
  
  handleStickyHeader();
  
  // ========== 2. IMAGE CAROUSEL NAVIGATION ==========
  const track = document.getElementById('carouselTrack');
  const wrapper = document.getElementById('carouselWrapper');
  const prevButton = document.getElementById('prevBtn');
  const nextButton = document.getElementById('nextBtn');
  
  if (track && wrapper && prevButton && nextButton) {
    let scrollAmount = 0;
    
    /**
     * Calculates scroll distance equal to one card width + gap
     * Allows smooth one-card-at-a-time navigation
     */
    function updateScrollAmount() {
      const firstCard = track.querySelector('.carousel-item');
      if (!firstCard) return;
      const cardWidth = firstCard.offsetWidth;
      const gap = parseInt(getComputedStyle(track).gap) || 28;
      scrollAmount = cardWidth + gap;
    }
    
    updateScrollAmount();
    window.addEventListener('resize', () => updateScrollAmount());
    
    // Next button - scroll right by one card
    nextButton.addEventListener('click', () => {
      const currentScroll = wrapper.scrollLeft;
      const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;
      let newScroll = currentScroll + scrollAmount;
      if (newScroll > maxScroll) newScroll = maxScroll;
      wrapper.scrollTo({ left: newScroll, behavior: 'smooth' });
    });
    
    // Previous button - scroll left by one card
    prevButton.addEventListener('click', () => {
      const currentScroll = wrapper.scrollLeft;
      let newScroll = currentScroll - scrollAmount;
      if (newScroll < 0) newScroll = 0;
      wrapper.scrollTo({ left: newScroll, behavior: 'smooth' });
    });
    
    // Keyboard navigation support (Arrow Left/Right)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        prevButton.click();
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        nextButton.click();
        e.preventDefault();
      }
    });
  }
  
  // ========== 3. ZOOM ON HOVER (with touch support) ==========
  // CSS handles the desktop hover zoom via .image-zoom-container:hover .carousel-img
  // For touch devices, we add a temporary zoom effect on tap
  const zoomContainers = document.querySelectorAll('.image-zoom-container');
  if ('ontouchstart' in window) {
    zoomContainers.forEach(container => {
      container.addEventListener('touchstart', () => {
        const img = container.querySelector('.carousel-img');
        if (img) {
          img.style.transform = 'scale(1.1)';
          setTimeout(() => { img.style.transform = ''; }, 300);
        }
      });
    });
  }
  
  // ========== 4. PERFORMANCE OPTIMIZATIONS ==========
  // Lazy loading for carousel images
  const allImgs = document.querySelectorAll('.carousel-img');
  if ('loading' in HTMLImageElement.prototype) {
    allImgs.forEach(img => { img.loading = 'lazy'; });
  }
  
  // Recalculate fold threshold after all images load (prevents misalignment)
  window.addEventListener('load', () => {
    updateFoldThreshold();
  });
  
})();