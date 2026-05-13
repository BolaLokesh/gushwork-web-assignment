(function() {
  // ========== STICKY HEADER LOGIC ==========
  const stickyHeader = document.getElementById('stickyHeader');
  if (!stickyHeader) return;
  
  let lastScrollY = window.scrollY;
  let ticking = false;
  const heroSection = document.querySelector('.hero');
  let foldThreshold = 0;
  
  function updateFoldThreshold() {
    if (heroSection) {
      const heroBottom = heroSection.getBoundingClientRect().bottom + window.scrollY;
      foldThreshold = heroBottom;
    } else {
      foldThreshold = window.innerHeight * 0.7;
    }
  }
  
  updateFoldThreshold();
  window.addEventListener('resize', () => updateFoldThreshold());
  
  function handleStickyHeader() {
    const currentY = window.scrollY;
    if (currentY > foldThreshold) {
      if (currentY > lastScrollY) {
        stickyHeader.classList.add('visible');
      } else {
        stickyHeader.classList.remove('visible');
      }
    } else {
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
  
  // ========== IMAGE CAROUSEL WITH ZOOM & NAVIGATION ==========
  const track = document.getElementById('carouselTrack');
  const wrapper = document.getElementById('carouselWrapper');
  const prevButton = document.getElementById('prevBtn');
  const nextButton = document.getElementById('nextBtn');
  
  if (track && wrapper && prevButton && nextButton) {
    let scrollAmount = 0;
    
    function updateScrollAmount() {
      const firstCard = track.querySelector('.carousel-item');
      if (!firstCard) return;
      const cardWidth = firstCard.offsetWidth;
      const gap = parseInt(getComputedStyle(track).gap) || 28;
      scrollAmount = cardWidth + gap;
    }
    
    updateScrollAmount();
    window.addEventListener('resize', () => updateScrollAmount());
    
    nextButton.addEventListener('click', () => {
      const currentScroll = wrapper.scrollLeft;
      const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;
      let newScroll = currentScroll + scrollAmount;
      if (newScroll > maxScroll) newScroll = maxScroll;
      wrapper.scrollTo({ left: newScroll, behavior: 'smooth' });
    });
    
    prevButton.addEventListener('click', () => {
      const currentScroll = wrapper.scrollLeft;
      let newScroll = currentScroll - scrollAmount;
      if (newScroll < 0) newScroll = 0;
      wrapper.scrollTo({ left: newScroll, behavior: 'smooth' });
    });
    
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
  
  // ========== TOUCH DEVICE ZOOM SUPPORT ==========
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
  
  // ========== LAZY LOADING & INIT ==========
  const allImgs = document.querySelectorAll('.carousel-img');
  if ('loading' in HTMLImageElement.prototype) {
    allImgs.forEach(img => { img.loading = 'lazy'; });
  }
  
  window.addEventListener('load', () => {
    updateFoldThreshold();
  });
})();