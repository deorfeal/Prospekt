/**
 * config.js
 * Глобальные настройки и константы
 */

const CONFIG = {
  // Preloader
  preloader: {
    animationTime: 4000,
    hideDelay: 600,
  },

  // AOS
  aos: {
    duration: 1500,
    offset: 0,
    anchorPlacement: "top-bottom",
  },

  // ScrollTrigger
  scrollTrigger: {
    end: "+=500%",
    scrub: 1,
    anticipatePin: 1,
  },

  // Swiper defaults
  swiper: {
    speed: 750,
    loop: true,
  },

  // Datepicker
  months: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ],
  days: ["SU", "MO", "TU", "WE", "TH", "FR", "SA"],
};

// Утилита для debounce
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}