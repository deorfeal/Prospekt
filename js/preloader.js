/**
 * preloader.js
 * Управление прелоадером
 */

const Preloader = {
  init(callback) {
    const preloader = $(".preloader");
    if (!preloader) {
      callback?.();
      return;
    }

    const { animationTime, hideDelay } = CONFIG.preloader;

    setTimeout(() => {
      preloader.classList.add("hide");

      setTimeout(() => {
        preloader.style.display = "none";
        callback?.();
      }, hideDelay);
    }, animationTime);
  },

  // Быстрый пропуск для разработки
  skip() {
    const preloader = $(".preloader");
    if (preloader) {
      preloader.style.display = "none";
    }
  },
};