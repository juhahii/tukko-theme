/**
 * Fullscreen image-grid gallery (Swiper main + thumbs).
 * Grid cells open the lightbox at the clicked index.
 */
(function () {
  'use strict';

  function initGalleries() {
    if (typeof Swiper === 'undefined') return;

    document.querySelectorAll('.image-grid').forEach(function (grid) {
      const id = grid.dataset.gallery;
      const lightbox = id ? document.getElementById(id) : null;
      if (!lightbox || lightbox.dataset.ready) return;
      lightbox.dataset.ready = '1';

      const mainEl = lightbox.querySelector('.gallery-swiper-main');
      const thumbsEl = lightbox.querySelector('.gallery-swiper-thumbs');
      if (!mainEl || !thumbsEl) return;

      let thumbs;
      let main;

      function ensureSwipers() {
        if (main) return;
        thumbs = new Swiper(thumbsEl, {
          spaceBetween: 6,
          slidesPerView: 'auto',
          watchSlidesProgress: true,
          slideToClickedSlide: true,
        });
        main = new Swiper(mainEl, {
          direction: 'vertical',
          spaceBetween: 8,
          keyboard: { enabled: true },
          mousewheel: { forceToAxis: true },
          thumbs: { swiper: thumbs },
        });
        lightbox._galleryMain = main;
      }

      function open(index) {
        lightbox.hidden = false;
        document.body.classList.add('gallery-open');
        ensureSwipers();
        requestAnimationFrame(function () {
          thumbs.update();
          thumbs.setTranslate(0);
          main.update();
          main.slideTo(index || 0, 0);
        });
        const closeBtn = lightbox.querySelector('.gallery-close');
        if (closeBtn) closeBtn.focus();
      }

      function close() {
        lightbox.hidden = true;
        document.body.classList.remove('gallery-open');
      }

      grid.querySelectorAll('.image-grid-cell').forEach(function (cell) {
        cell.addEventListener('click', function () {
          open(parseInt(cell.dataset.index, 10) || 0);
        });
      });

      const closeBtn = lightbox.querySelector('.gallery-close');
      if (closeBtn) closeBtn.addEventListener('click', close);

      lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) close();
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !lightbox.hidden) close();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGalleries);
  } else {
    initGalleries();
  }

  window.initTukkoGalleries = initGalleries;
})();
