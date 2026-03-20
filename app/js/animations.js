/**
 * animations.js
 * Инициализация анимаций
 */

const Animations = {
  // Инициализация AOS
  initAOS() {
    if (typeof AOS === "undefined") return;
    
    AOS.init(CONFIG.aos);
  },

  // Инициализация StrokeText
  initStrokeText() {
    if (typeof StrokeText !== "undefined") {
      StrokeText.init();
    }
  },

  // Анимация мазка кисти
  initBrushStroke() {
    const path = $(".advantages-bg .brush-stroke");
    if (!path) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    const trigger =
      $(".advantages__bg")?.closest("section") ||
      $(".advantages__bg")?.parentElement;

    if (!trigger) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            path.style.transition = "stroke-dashoffset 3s ease-out";
            path.style.strokeDashoffset = "0";
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0,
      }
    );

    observer.observe(trigger);
  },

  // Запуск всех анимаций
  initAll() {
    this.initAOS();
    this.initStrokeText();
    this.initBrushStroke();
  },
};