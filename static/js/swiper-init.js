/**
 * Tukko Swiper Initialization
 * 
 * This file handles initialization of all Swiper carousels on the page.
 * It auto-detects configuration based on CSS classes:
 *   - .swiper-poster   → full width poster carousel (1 slide, centered)
 *   - .swiper-cards    → multi-slide cards carousel
 *
 * Usage:
 *   - Include Swiper bundle first
 *   - This script auto-runs on DOMContentLoaded
 *   - For manual re-init (e.g. after dynamic content): window.initTukkoSwipers()
 */

(function() {
  'use strict';

  function initSwipers() {
    if (typeof Swiper === 'undefined') {
      console.warn('[Tukko] Swiper library not found. Make sure swiper-bundle.min.js is loaded before this script.');
      return;
    }

    const swipers = document.querySelectorAll('.swiper');

    swipers.forEach(function (el) {
      // Skip if already initialized, or if this is a gallery lightbox swiper
      if (el.swiper) {
        return;
      }
      if (el.classList.contains('gallery-swiper-main') || el.classList.contains('gallery-swiper-thumbs') ||
          el.classList.contains('swiper-media-main') || el.classList.contains('swiper-media-thumbs') ||
          el.classList.contains('swiper-product-main') || el.classList.contains('swiper-product-thumbs')) {
        return;
      }

      const isPoster = el.classList.contains('swiper-poster');
      const showNav = el.dataset.showNavigation !== 'false';

      const swiperConfig = {
        // Base settings
        loop: false,
        // pagination added conditionally below

        // Mode specific
        slidesPerView: isPoster ? 1 : 1.2,
        spaceBetween: isPoster ? 0 : 16,
        centeredSlides: isPoster,

        // Responsive only for cards
        breakpoints: isPoster ? {} : {
          640: {
            slidesPerView: 2.2,
            spaceBetween: 20
          },
          900: {
            slidesPerView: 3.2,
            spaceBetween: 24
          }
        }
      };

      if (showNav) {
        if (isPoster) {
          swiperConfig.pagination = {
            el: el.querySelector('.swiper-pagination'),
            clickable: true,
          };
        } else {
          swiperConfig.pagination = false;
        }

        const navRoot = el.closest('.swiper-cards-wrap') || el;
        const nextEl = navRoot.querySelector('.swiper-button-next');
        const prevEl = navRoot.querySelector('.swiper-button-prev');
        if (nextEl && prevEl) {
          swiperConfig.navigation = {
            nextEl: nextEl,
            prevEl: prevEl,
          };
        } else {
          swiperConfig.navigation = false;
        }
      } else {
        swiperConfig.pagination = false;
        swiperConfig.navigation = false;
      }

      new Swiper(el, swiperConfig);
    });

    document.querySelectorAll('.media-gallery').forEach(function (gallery) {
      if (gallery.dataset.ready) return;
      gallery.dataset.ready = '1';
      const mainEl = gallery.querySelector('.swiper-media-main');
      const thumbsEl = gallery.querySelector('.swiper-media-thumbs');
      if (!mainEl) return;

      var thumbs;
      if (thumbsEl) {
        thumbs = new Swiper(thumbsEl, {
          spaceBetween: 8,
          slidesPerView: 'auto',
          watchSlidesProgress: true,
          slideToClickedSlide: true,
        });
      }

      new Swiper(mainEl, {
        spaceBetween: 0,
        keyboard: { enabled: true },
        navigation: {
          nextEl: gallery.querySelector('.swiper-button-next'),
          prevEl: gallery.querySelector('.swiper-button-prev'),
        },
        thumbs: thumbs ? { swiper: thumbs } : undefined,
      });
    });
  }

  // Auto init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSwipers);
  } else {
    initSwipers();
  }

  // Expose for future / manual use (e.g. after AJAX load or CMS preview)
  window.initTukkoSwipers = initSwipers;

  // Optional: re-init on window resize for some edge cases (debounced)
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      // Only re-init if we want dynamic behavior
      // initSwipers(); // uncomment if needed
    }, 250);
  });

})();
