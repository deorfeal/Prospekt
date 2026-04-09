/**
 * sliders.js
 * Инициализация всех Swiper-слайдеров
 */

const Sliders = {
  instances: {},

  init() {
    this.initPoints();
    this.initProjectPages();
    this.initProjectMobile();
    this.initReviews();
    this.initRecalls();
  },

  initPoints() {
    const el = $(".points-list");
    if (!el) return;

    const syncPointsContent = (index) => {
      const tabs = $$('.tub[data-tubs="points"]');
      const contents = $$('.tub-element[data-tubs="points"]');

      tabs.forEach((tab, tabIndex) => {
        tab.classList.toggle("tub--active", tabIndex === index);
      });

      contents.forEach((content, contentIndex) => {
        content.classList.toggle("tub-element--active", contentIndex === index);
      });
    };

    if (!el.dataset.pointsSwiperBound) {
      el.dataset.pointsSwiperBound = "1";

      $$('.tub[data-tubs="points"]').forEach((tab, index) => {
        tab.addEventListener("click", () => {
          this.instances.points?.slideToLoop(index);
        });
      });
    }

    const initSwiper = () => {
      if (window.innerWidth > 1200) {
        if (this.instances.points) {
          this.instances.points.destroy(true, true);
          delete this.instances.points;
        }
        return;
      }

      if (this.instances.points) return;

      this.instances.points = new Swiper(".points-list", {
        slidesPerView: 1.3,
        speed: CONFIG.swiper.speed,
        spaceBetween: 20,
        loop: true,
        slideToClickedSlide: true,
        watchOverflow: true,
        breakpoints: {
          769: {
            slidesPerView: "auto",
            spaceBetween: 30,
          },
        },
        on: {
          init(swiper) {
            syncPointsContent(swiper.realIndex);
          },
          slideChange(swiper) {
            syncPointsContent(swiper.realIndex);
          },
        },
      });
    };

    initSwiper();

    if (!this.pointsResizeHandler) {
      this.pointsResizeHandler = initSwiper;
      window.addEventListener("resize", this.pointsResizeHandler);
    }
  },

  // Проекты (fade эффект)
  initProjectPages() {
    const el = $(".projectpages-swiper");
    if (!el) return;

    this.instances.projectPages = new Swiper(".projectpages-swiper", {
      slidesPerView: 1,
      speed: CONFIG.swiper.speed,
      effect: "fade",
      loop: true,
      fadeEffect: { crossFade: true },
      navigation: {
        prevEl: ".projectpages-arrow--prev",
        nextEl: ".projectpages-arrow--next",
      },
    });
  },

  // Мобильные проекты
  initProjectMobile() {
    const el = $(".projectmobile-swiper");
    if (!el) return;

    this.instances.projectMobile = new Swiper(".projectmobile-swiper", {
      slidesPerView: 3,
      speed: CONFIG.swiper.speed,
      spaceBetween: 55,
      loop: true,
      navigation: {
        prevEl: ".projectmobile-arrow--prev",
        nextEl: ".projectmobile-arrow--next",
      },
      breakpoints: {
        301: { slidesPerView: 1, spaceBetween: 30 },
        769: { slidesPerView: 2, spaceBetween: 30 },
        1201: { slidesPerView: 3, spaceBetween: 55 },
      },
    });
  },

  // Отзывы
  initReviews() {
    const el = $(".reviews-swiper");
    if (!el) return;

    this.instances.reviews = new Swiper(".reviews-swiper", {
      slidesPerView: 1,
      speed: CONFIG.swiper.speed,
      spaceBetween: 30,
      effect: "fade",
      loop: true,
      fadeEffect: { crossFade: true },
      navigation: {
        nextEl: ".reviews-arrow--next",
      },
    });
  },

  // Recalls с thumbs
  initRecalls() {
    const thumbsEl = $(".recalls-thumbs");
    const mainEl = $(".recalls-swiper");

    if (!thumbsEl || !mainEl) return;

    // Thumbs
    this.instances.recallsThumbs = new Swiper(".recalls-thumbs", {
      slidesPerView: 5,
      loop: true,
      centeredSlides: true,
      speed: CONFIG.swiper.speed,
      watchSlidesProgress: true,
      slideToClickedSlide: true,
      breakpoints: {
        301: { slidesPerView: 1.75 },
        551: { slidesPerView: 2 },
        769: { slidesPerView: 3.5 },
        1201: { slidesPerView: 5 },
      },
    });

    // Main
    this.instances.recalls = new Swiper(".recalls-swiper", {
      slidesPerView: 1,
      loop: true,
      speed: CONFIG.swiper.speed,
      effect: "fade",
      fadeEffect: { crossFade: true },
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      thumbs: {
        swiper: this.instances.recallsThumbs,
      },
    });

    // Синхронизация с защитой от рекурсии
    let isSyncing = false;

    this.instances.recallsThumbs.on("slideChange", () => {
      if (isSyncing) return;
      isSyncing = true;
      this.instances.recalls.slideToLoop(
        this.instances.recallsThumbs.realIndex,
        CONFIG.swiper.speed
      );
      setTimeout(() => (isSyncing = false), 100);
    });

    this.instances.recalls.on("slideChange", () => {
      if (isSyncing) return;
      isSyncing = true;
      this.instances.recallsThumbs.slideToLoop(
        this.instances.recalls.realIndex,
        CONFIG.swiper.speed
      );
      setTimeout(() => (isSyncing = false), 100);
    });
  },

  // Уничтожение всех
  destroy() {
    Object.values(this.instances).forEach((swiper) => {
      if (swiper?.destroy) swiper.destroy(true, true);
    });
    this.instances = {};
  },
};
