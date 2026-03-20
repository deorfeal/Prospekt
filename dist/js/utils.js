/**
 * utils.js
 * Вспомогательные функции
 */

// Закрыть все кастомные селекты кроме указанного
function closeAll(except) {
  document.querySelectorAll(".custom-select--open").forEach((el) => {
    if (el !== except) el.classList.remove("custom-select--open");
  });
}

// Проверка видимости элемента
function isElementVisible(el) {
  return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
}

// Безопасный querySelector
function $(selector, context = document) {
  return context.querySelector(selector);
}

// Безопасный querySelectorAll — возвращает массив
function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// Debounce
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

// Throttle
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}