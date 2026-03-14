/**
 * app.js
 * Точка входа, инициализация всех модулей
 */

document.addEventListener("DOMContentLoaded", () => {
  // Проверяем наличие прелоадера
  const hasPreloader = $(".preloader");

  const initApp = () => {
    // Инициализация анимаций
    Animations.initAll();

    // Инициализация слоёв скролла
    ScrollLayers.init();

    // Инициализация компонентов (попапы)
    Components.init();

    // Инициализация форм с callback на успех
    Forms.init(() => {
      // Это вызовется когда форма валидна
      Components.showSuccessPopup();
    });

    // Инициализация слайдеров
    Sliders.init();
  };

  if (hasPreloader) {
    // С прелоадером
    Preloader.init(initApp);
  } else {
    // Без прелоадера (или с jQuery fallback)
    if (typeof jQuery !== "undefined") {
      jQuery(document).ready(() => {
        Animations.initAll();
      });
    }
    
    // Небольшая задержка для ScrollLayers
    setTimeout(() => {
      initApp();
    }, 100);
  }
});