// Aos - the right initialisation
document.addEventListener("DOMContentLoaded", function () {
  if (document.querySelector(".preloader")) {
    const preloader = document.querySelector(".preloader");

    // время анимации SVG (3s) + небольшая пауза
    const animationTime = 3000;

    setTimeout(() => {
      // добавляем класс для плавного исчезновения
      preloader.classList.add("hide");

      // ждём пока opacity-анимация закончится
      setTimeout(() => {
        preloader.style.display = "none";

        // запуск AOS после полного скрытия
        AOS.init({
          duration: 750,
          offset: 0,
          anchorPlacement: "top-bottom",
        });
      }, 600); // должно совпадать с transition в CSS
    }, animationTime);
  } else {
    // // Aos - the right initialisation
    jQuery(document).ready(function () {
      (function () {
        // your page initialization code here
        // the DOM will be available here
        AOS.init({
          duration: 750,
          offset: 0, // offset (in px) from the original trigger point
          anchorPlacement: "top-bottom", // define where the AOS animations will be triggered
        });
      })();
    });
    // // //
  }
});
// //

const pageBg = document.querySelector(".page-bg");
const menuItems = document.querySelectorAll(".menu-item");

menuItems.forEach((item) => {
  item.addEventListener("mouseenter", () => {
    pageBg.classList.add("page-bg--active");
  });

  item.addEventListener("mouseleave", () => {
    pageBg.classList.remove("page-bg--active");
  });
});

//

// Находим все переключатели на странице
const toggles = document.querySelectorAll(".language-toggle");

// Флаг для предотвращения рекурсивных вызовов
let isUpdating = false;

toggles.forEach((toggleWrapper) => {
  const toggle = toggleWrapper.querySelector("input[type='checkbox']");

  toggle.addEventListener("change", function () {
    // Если уже идёт обновление, выходим
    if (isUpdating) return;

    // Устанавливаем флаг
    isUpdating = true;

    // Берём текущее состояние чекбокса
    const isChecked = this.checked;

    // Обновляем все переключатели одновременно
    toggles.forEach((otherWrapper) => {
      const otherToggle = otherWrapper.querySelector("input[type='checkbox']");
      const otherSlider = otherWrapper.querySelector(
        ".language-toggle__slider",
      );
      const otherEn = otherWrapper.querySelector(".language-toggle__label--en");
      const otherDe = otherWrapper.querySelector(".language-toggle__label--de");

      // Меняем состояние чекбокса
      otherToggle.checked = isChecked;

      // Анимация слайдера
      otherSlider.classList.remove(
        "language-toggle__slider--animating",
        "language-toggle__slider--animating-reverse",
      );
      otherSlider.classList.add(
        isChecked
          ? "language-toggle__slider--animating"
          : "language-toggle__slider--animating-reverse",
      );

      // Меняем метки
      if (isChecked) {
        otherEn.classList.add("language-toggle__label--inactive");
        otherDe.classList.remove("language-toggle__label--inactive");
      } else {
        otherEn.classList.remove("language-toggle__label--inactive");
        otherDe.classList.add("language-toggle__label--inactive");
      }

      // Убираем класс анимации после завершения
      setTimeout(() => {
        otherSlider.classList.remove(
          "language-toggle__slider--animating",
          "language-toggle__slider--animating-reverse",
        );
      }, 400);
    });

    // Снимаем флаг после завершения всех обновлений
    isUpdating = false;
  });
});

//

document.querySelectorAll(".tub[data-tubs]").forEach((tab, index, tabList) => {
  tab.addEventListener("click", () => {
    const group = tab.dataset.tubs;

    // Найдём все табы и элементы контента с тем же data-tubs
    const tabs = Array.from(
      document.querySelectorAll(`.tub[data-tubs="${group}"]`),
    );
    const contents = Array.from(
      document.querySelectorAll(`.tub-element[data-tubs="${group}"]`),
    );

    const tabIndex = tabs.indexOf(tab);

    // Сброс классов у всех табов этой группы
    tabs.forEach((t) => t.classList.remove("tub--active"));
    tab.classList.add("tub--active");

    // Сброс классов у всех элементов этой группы
    contents.forEach((el) => el.classList.remove("tub-element--active"));
    if (contents[tabIndex]) {
      contents[tabIndex].classList.add("tub-element--active");
    }
  });
});

//

new Swiper(".projectpages-swiper", {
  slidesPerView: 1,
  speed: 750,
  effect: "fade",
  loop: true,
  fadeEffect: { crossFade: true },
  navigation: {
    prevEl: ".projectpages-arrow--prev",
    nextEl: ".projectpages-arrow--next",
  },
  // breakpoints: {
  //     301: {
  //         slidesPerView: 2.2,
  //         centeredSlides: true,
  //         initialSlide: 1,
  //         slidesPerGroup: 1,
  //         loopedSlides: 6,
  //     },
  //     501: {
  //         slidesPerView: 2.5,
  //         centeredSlides: true,
  //         initialSlide: 1,
  //         slidesPerGroup: 1,
  //         loopedSlides: 6,
  //     },
  // }
});

new Swiper(".projectmobile-swiper", {
  slidesPerView: 3,
  speed: 750,
  spaceBetween: 55,
  loop: true,
  navigation: {
    prevEl: ".projectmobile-arrow--prev",
    nextEl: ".projectmobile-arrow--next",
  },
  breakpoints: {
    301: {
      slidesPerView: 1,
      speed: 750,
      spaceBetween: 30,
      loop: true,
    },
    769: {
      slidesPerView: 2,
      speed: 750,
      spaceBetween: 30,
      loop: true,
    },
    1201: {
      slidesPerView: 3,
      speed: 750,
      spaceBetween: 55,
      loop: true,
    },
  },
});

new Swiper(".reviews-swiper", {
  slidesPerView: 1,
  speed: 750,
  spaceBetween: 30,
  effect: "fade",
  loop: true,
  fadeEffect: { crossFade: true },
  navigation: {
    nextEl: ".reviews-arrow--next",
  },
  // breakpoints: {
  //     301: {
  //         slidesPerView: 2.2,
  //         centeredSlides: true,
  //         initialSlide: 1,
  //         slidesPerGroup: 1,
  //         loopedSlides: 6,
  //     },
  //     501: {
  //         slidesPerView: 2.5,
  //         centeredSlides: true,
  //         initialSlide: 1,
  //         slidesPerGroup: 1,
  //         loopedSlides: 6,
  //     },
  // }
});

//

const recallsThumbs = new Swiper(".recalls-thumbs", {
  slidesPerView: 5,
  loop: true,
  centeredSlides: true,
  speed: 750,
  watchSlidesProgress: true,
  slideToClickedSlide: true,
});

const contentSwiper = new Swiper(".recalls-swiper", {
  slidesPerView: 1,
  loop: true,
  speed: 750,
  effect: "fade",
  fadeEffect: { crossFade: true },
  // autoplay: {
  //   delay: 5000,
  //   disableOnInteraction: false,
  // },
  thumbs: {
    swiper: recallsThumbs,
  },
});

// Флаг для предотвращения рекурсии
let isSyncing = false;

// Синхронизация при свайпе превью
recallsThumbs.on("slideChange", function () {
  if (isSyncing) return;
  isSyncing = true;
  contentSwiper.slideToLoop(this.realIndex, 750);
  setTimeout(() => (isSyncing = false), 100);
});

// Синхронизация при изменении основного слайдера
contentSwiper.on("slideChange", function () {
  if (isSyncing) return;
  isSyncing = true;
  recallsThumbs.slideToLoop(this.realIndex, 750);
  setTimeout(() => (isSyncing = false), 100);
});

// document.addEventListener("DOMContentLoaded", () => {
//   // gsap.registerPlugin(ScrollTrigger);

//   // /*
//   //   =========================================
//   //   1️⃣ HERO - Появление элементов
//   //   =========================================
//   // */

//   // const heroIntro = gsap.timeline({
//   //   scrollTrigger: {
//   //     trigger: ".heading",
//   //     start: "top 100%",
//   //     toggleActions: "play none none reverse",
//   //   },
//   // });

//   // // Линии растут снизу вверх
//   // heroIntro.from(".heading .lines__line", {
//   //   scaleY: 0,
//   //   transformOrigin: "bottom",
//   //   stagger: 0.1,
//   //   duration: 0.9,
//   //   ease: "power2.out",
//   // });

//   // // Картинка появляется с масштабированием
//   // heroIntro.from(
//   //   ".heading__img",
//   //   {
//   //     scale: 0.8,
//   //     y: 250,
//   //     opacity: 0,
//   //     duration: 0.9,
//   //     ease: "back.out(1.2)",
//   //   },
//   //   "-=0.6",
//   // );

//   // // Текст появляется по буквам
//   // heroIntro.from(
//   //   ".heading__title span",
//   //   {
//   //     y: 60,
//   //     opacity: 0,
//   //     rotationX: -90,
//   //     transformOrigin: "center bottom",
//   //     stagger: 0.15,
//   //     duration: 0.8,
//   //     ease: "back.out(1.5)",
//   //   },
//   //   "-=0.7",
//   // );

//   // //

//   // // Таймлайн для анимации выхода при скролле
//   // gsap
//   //   .timeline({
//   //     scrollTrigger: {
//   //       trigger: ".heading", // блок, который анимируем
//   //       start: "top top", // когда верх блока достигает верха экрана
//   //       end: "bottom top", // когда низ блока достигнет верха экрана
//   //       scrub: true, // привязка анимации к скроллу
//   //     },
//   //   })
//   //   .to(".heading__img", {
//   //     scale: 0, // сжимается до 0
//   //     opacity: 0, // исчезает
//   //     duration: 1, // длительность по скроллу (не критично, scrub контролирует)
//   //     ease: "power1.out",
//   //   })
//   //   .to(
//   //     ".heading__title span",
//   //     {
//   //       y: -100, // текст поднимается вверх
//   //       opacity: 0, // можно сделать постепенное исчезновение
//   //       stagger: 0.05,
//   //       ease: "power1.out",
//   //     },
//   //     0,
//   //   ); // "0" значит анимации стартуют одновременно

//   // /*
//   //   =========================================
//   //   2️⃣ HERO - Скролл-анимация
//   //   =========================================
//   // */

//   // const heroScroll = gsap.timeline({
//   //   scrollTrigger: {
//   //     trigger: ".heading",
//   //     start: "top top",
//   //     end: "+=150%",
//   //     scrub: 0.8,
//   //     pin: true
//   //   }
//   // });

//   // heroScroll.to(".heading__title", {
//   //   y: -180,
//   //   opacity: 0,
//   //   scale: 0.9,
//   //   ease: "power2.in"
//   // });

//   // heroScroll.to(".heading__img", {
//   //   scale: 0.4,
//   //   y: -100,
//   //   opacity: 0,
//   //   ease: "power2.in"
//   // }, "<");

//   // heroScroll.to(".heading .lines__line", {
//   //   scaleY: 0.5,
//   //   opacity: 0.3,
//   //   ease: "power1.in"
//   // }, "<");

//   // /*
//   //   =========================================
//   //   3️⃣ ABOUT - Появление секции
//   //   =========================================
//   // */

//   // const aboutIntro = gsap.timeline({
//   //   scrollTrigger: {
//   //     trigger: ".about",
//   //     start: "top 80%",
//   //     toggleActions: "play none none reverse"
//   //   }
//   // });

//   // // Линии появляются
//   // aboutIntro.from(".about .lines__line", {
//   //   scaleY: 0,
//   //   transformOrigin: "bottom",
//   //   stagger: 0.12,
//   //   duration: 0.8,
//   //   ease: "power2.out"
//   // });

//   // // Изображение телефона слева
//   // aboutIntro.from(".about-view", {
//   //   x: -100,
//   //   opacity: 0,
//   //   duration: 1,
//   //   ease: "power3.out"
//   // }, "-=0.5");

//   // // Декоративные изображения появляются с вращением
//   // aboutIntro.from(".about-images img", {
//   //   scale: 0,
//   //   rotation: 180,
//   //   opacity: 0,
//   //   stagger: 0.1,
//   //   duration: 0.7,
//   //   ease: "back.out(2)"
//   // }, "-=0.6");

//   // // Контент справа
//   // aboutIntro.from(".about-body__title", {
//   //   x: 80,
//   //   opacity: 0,
//   //   duration: 0.9,
//   //   ease: "power3.out"
//   // }, "-=0.8");

//   // aboutIntro.from(".about-body__subtext", {
//   //   x: 80,
//   //   opacity: 0,
//   //   duration: 0.8,
//   //   ease: "power3.out"
//   // }, "-=0.6");

//   // aboutIntro.from(".about-body__subtitle", {
//   //   x: 60,
//   //   opacity: 0,
//   //   duration: 0.8,
//   //   ease: "power3.out"
//   // }, "-=0.5");

//   // aboutIntro.from(".about-body__text", {
//   //   y: 30,
//   //   opacity: 0,
//   //   stagger: 0.15,
//   //   duration: 0.7,
//   //   ease: "power2.out"
//   // }, "-=0.4");

//   // aboutIntro.from(".about-body__caption", {
//   //   y: 30,
//   //   opacity: 0,
//   //   duration: 0.7,
//   //   ease: "power2.out"
//   // }, "-=0.3");

//   // /*
//   //   =========================================
//   //   4️⃣ ADVANTAGES - Преимущества
//   //   =========================================
//   // */

//   // const advantagesIntro = gsap.timeline({
//   //   scrollTrigger: {
//   //     trigger: ".advantages",
//   //     start: "top 75%",
//   //     toggleActions: "play none none reverse"
//   //   }
//   // });

//   // // Линии
//   // advantagesIntro.from(".advantages .lines__line", {
//   //   scaleY: 0,
//   //   transformOrigin: "bottom",
//   //   stagger: 0.1,
//   //   duration: 0.8,
//   //   ease: "power2.out"
//   // });

//   // // Фоновые круги вращаются и появляются
//   // advantagesIntro.from(".advantages-bg__img", {
//   //   scale: 0,
//   //   rotation: -360,
//   //   opacity: 0,
//   //   stagger: 0.2,
//   //   duration: 1.2,
//   //   ease: "power2.out"
//   // }, "-=0.6");

//   // // Каждый элемент преимуществ появляется с эффектом
//   // advantagesIntro.from(".advantages-item", {
//   //   x: -80,
//   //   opacity: 0,
//   //   stagger: 0.2,
//   //   duration: 0.9,
//   //   ease: "power3.out"
//   // }, "-=0.8");

//   // advantagesIntro.from(".advantages-item__title", {
//   //   scaleX: 0,
//   //   transformOrigin: "left",
//   //   stagger: 0.2,
//   //   duration: 0.7,
//   //   ease: "power2.out"
//   // }, "-=1.2");

//   // /*
//   //   =========================================
//   //   5️⃣ SLOGAN - Слоган
//   //   =========================================
//   // */

//   // const sloganIntro = gsap.timeline({
//   //   scrollTrigger: {
//   //     trigger: ".slogan",
//   //     start: "top 75%",
//   //     toggleActions: "play none none reverse"
//   //   }
//   // });

//   // sloganIntro.from(".slogan .lines__line", {
//   //   scaleY: 0,
//   //   transformOrigin: "bottom",
//   //   stagger: 0.12,
//   //   duration: 0.8,
//   //   ease: "power2.out"
//   // });

//   // // Изображение справа появляется
//   // sloganIntro.from(".slogan-view", {
//   //   x: 100,
//   //   opacity: 0,
//   //   duration: 1,
//   //   ease: "power3.out"
//   // }, "-=0.5");

//   // sloganIntro.from(".slogan-images img", {
//   //   scale: 0,
//   //   rotation: -180,
//   //   opacity: 0,
//   //   stagger: 0.15,
//   //   duration: 0.8,
//   //   ease: "back.out(2)"
//   // }, "-=0.7");

//   // sloganIntro.from(".slogan-body", {
//   //   x: -80,
//   //   opacity: 0,
//   //   duration: 0.9,
//   //   ease: "power3.out"
//   // }, "-=0.8");

//   // /*
//   //   =========================================
//   //   6️⃣ points - Этапы работы
//   //   =========================================
//   // */

//   // const pointsIntro = gsap.timeline({
//   //   scrollTrigger: {
//   //     trigger: ".points",
//   //     start: "top 70%",
//   //     toggleActions: "play none none reverse"
//   //   }
//   // });

//   // pointsIntro.from(".points .lines__line", {
//   //   scaleY: 0,
//   //   transformOrigin: "bottom",
//   //   stagger: 0.1,
//   //   duration: 0.8,
//   //   ease: "power2.out"
//   // });

//   // // Левая синяя панель появляется
//   // pointsIntro.from(".points-body", {
//   //   x: -200,
//   //   opacity: 0,
//   //   duration: 1,
//   //   ease: "power3.out"
//   // }, "-=0.5");

//   // // Каждый шаг появляется последовательно
//   // pointsIntro.from(".points-item", {
//   //   x: -60,
//   //   opacity: 0,
//   //   stagger: 0.15,
//   //   duration: 0.8,
//   //   ease: "power2.out"
//   // }, "-=0.6");

//   // // Контент справа появляется с задержкой
//   // pointsIntro.from(".points-content", {
//   //   x: 80,
//   //   opacity: 0,
//   //   duration: 0.9,
//   //   ease: "power3.out"
//   // }, "-=1");

//   // /*
//   //   =========================================
//   //   7️⃣ CASES - Кейсы
//   //   =========================================
//   // */

//   // const casesHeadIntro = gsap.timeline({
//   //   scrollTrigger: {
//   //     trigger: ".cases-head",
//   //     start: "top 75%",
//   //     toggleActions: "play none none reverse"
//   //   }
//   // });

//   // casesHeadIntro.from(".cases-head .lines__line", {
//   //   scaleY: 0,
//   //   transformOrigin: "bottom",
//   //   stagger: 0.1,
//   //   duration: 0.8,
//   //   ease: "power2.out"
//   // });

//   // casesHeadIntro.from(".cases-view", {
//   //   x: -100,
//   //   opacity: 0,
//   //   duration: 1,
//   //   ease: "power3.out"
//   // }, "-=0.5");

//   // casesHeadIntro.from(".cases-images img", {
//   //   scale: 0,
//   //   rotation: 360,
//   //   opacity: 0,
//   //   stagger: 0.08,
//   //   duration: 0.7,
//   //   ease: "back.out(1.5)"
//   // }, "-=0.7");

//   // casesHeadIntro.from(".cases-body", {
//   //   x: 80,
//   //   opacity: 0,
//   //   duration: 0.9,
//   //   ease: "power3.out"
//   // }, "-=1");

//   // // Анимация каждого кейса при скролле
//   // gsap.utils.toArray(".cases-item").forEach((item, index) => {
//   //   const tl = gsap.timeline({
//   //     scrollTrigger: {
//   //       trigger: item,
//   //       start: "top 80%",
//   //       toggleActions: "play none none reverse"
//   //     }
//   //   });

//   //   tl.from(item.querySelector(".cases-titling__line"), {
//   //     scaleX: 0,
//   //     transformOrigin: "left",
//   //     duration: 0.6,
//   //     ease: "power2.out"
//   //   });

//   //   tl.from(item.querySelector(".cases-titling__title"), {
//   //     x: -50,
//   //     opacity: 0,
//   //     duration: 0.7,
//   //     ease: "power3.out"
//   //   }, "-=0.4");

//   //   tl.from(item.querySelector(".cases-titling__text"), {
//   //     y: 30,
//   //     opacity: 0,
//   //     duration: 0.6,
//   //     ease: "power2.out"
//   //   }, "-=0.4");

//   //   tl.from(item.querySelector(".cases-preview"), {
//   //     scale: 0.9,
//   //     opacity: 0,
//   //     duration: 0.8,
//   //     ease: "power3.out"
//   //   }, "-=0.5");

//   //   if (item.querySelector(".cases-titling__subline")) {
//   //     tl.from(item.querySelector(".cases-titling__subline"), {
//   //       scaleY: 0,
//   //       transformOrigin: "top",
//   //       duration: 0.8,
//   //       ease: "power2.out"
//   //     }, "-=0.6");
//   //   }
//   // });

//   // /*
//   //   =========================================
//   //   8️⃣ MAP - Карта
//   //   =========================================
//   // */

//   // const mapIntro = gsap.timeline({
//   //   scrollTrigger: {
//   //     trigger: ".map",
//   //     start: "top 75%",
//   //     toggleActions: "play none none reverse"
//   //   }
//   // });

//   // mapIntro.from(".map .lines__line", {
//   //   scaleY: 0,
//   //   transformOrigin: "bottom",
//   //   stagger: 0.1,
//   //   duration: 0.8,
//   //   ease: "power2.out"
//   // });

//   // mapIntro.from(".map__title", {
//   //   y: 60,
//   //   opacity: 0,
//   //   duration: 0.8,
//   //   ease: "power3.out"
//   // }, "-=0.5");

//   // mapIntro.from(".map-images", {
//   //   scale: 0.8,
//   //   opacity: 0,
//   //   duration: 1,
//   //   ease: "back.out(1.2)"
//   // }, "-=0.4");

//   // /*
//   //   =========================================
//   //   9️⃣ FOOTER - Подвал
//   //   =========================================
//   // */

//   // const footerIntro = gsap.timeline({
//   //   scrollTrigger: {
//   //     trigger: ".footer",
//   //     start: "top 75%",
//   //     toggleActions: "play none none reverse"
//   //   }
//   // });

//   // footerIntro.from(".footer .lines__line", {
//   //   scaleY: 0,
//   //   transformOrigin: "bottom",
//   //   stagger: 0.08,
//   //   duration: 0.8,
//   //   ease: "power2.out"
//   // });

//   // // Большое изображение появляется с вращением
//   // footerIntro.from(".footer-img", {
//   //   scale: 0,
//   //   rotation: 180,
//   //   opacity: 0,
//   //   duration: 1.2,
//   //   ease: "back.out(1.5)"
//   // }, "-=0.5");

//   // // Заголовок с эффектом
//   // footerIntro.from(".footer-top__title", {
//   //   scale: 0.5,
//   //   opacity: 0,
//   //   duration: 1,
//   //   ease: "back.out(1.5)"
//   // }, "-=0.8");

//   // // Контент футера появляется снизу
//   // footerIntro.from(".footer-box", {
//   //   y: 60,
//   //   opacity: 0,
//   //   stagger: 0.15,
//   //   duration: 0.8,
//   //   ease: "power3.out"
//   // }, "-=0.6");

//   // /*
//   //   =========================================
//   //   🎯 PARALLAX эффекты для изображений
//   //   =========================================
//   // */

//   // // Параллакс для about-images
//   // gsap.to(".about-images img", {
//   //   y: (i, target) => -50 * (i + 1),
//   //   ease: "none",
//   //   scrollTrigger: {
//   //     trigger: ".about",
//   //     start: "top bottom",
//   //     end: "bottom top",
//   //     scrub: 1
//   //   }
//   // });

//   // // Параллакс для slogan-images
//   // gsap.to(".slogan-images img", {
//   //   y: (i, target) => -40 * (i + 1),
//   //   rotation: (i, target) => 20 * (i + 1),
//   //   ease: "none",
//   //   scrollTrigger: {
//   //     trigger: ".slogan",
//   //     start: "top bottom",
//   //     end: "bottom top",
//   //     scrub: 1
//   //   }
//   // });

//   // // Параллакс для cases-images
//   // gsap.to(".cases-images img", {
//   //   y: (i, target) => -30 * (i % 5 + 1),
//   //   ease: "none",
//   //   scrollTrigger: {
//   //     trigger: ".cases-head",
//   //     start: "top bottom",
//   //     end: "bottom top",
//   //     scrub: 1
//   //   }
//   // });

//   // // Параллакс для advantages-bg
//   // gsap.to(".advantages-bg__img", {
//   //   rotation: 360,
//   //   ease: "none",
//   //   scrollTrigger: {
//   //     trigger: ".advantages",
//   //     start: "top bottom",
//   //     end: "bottom top",
//   //     scrub: 2
//   //   }
//   // });

//   // // Параллакс для footer-img
//   // gsap.to(".footer-img", {
//   //   y: -100,
//   //   rotation: 45,
//   //   scale: 1.1,
//   //   ease: "none",
//   //   scrollTrigger: {
//   //     trigger: ".footer",
//   //     start: "top bottom",
//   //     end: "bottom top",
//   //     scrub: 1
//   //   }
//   // });
// });

// document.querySelectorAll('.faq-list__item').forEach(item => {
//     item.addEventListener('click', () => {
//         // Если элемент уже активен, убрать активный класс
//         if (item.classList.contains('faq-list__item--active')) {
//             item.classList.remove('faq-list__item--active');
//         } else {
//             // Убираем класс у всех элементов
//             document.querySelectorAll('.faq-list__item').forEach(el => el.classList.remove('faq-list__item--active'));
//             // Добавляем класс текущему элементу
//             item.classList.add('faq-list__item--active');
//         }
//     });
// });

// document.addEventListener("DOMContentLoaded", function () {
//   var x, i, j, l, ll, selElmnt, a, b, c;
//   /* Look for any elements with the class "custom-select": */
//   x = document.getElementsByClassName("custom-select");
//   l = x.length;
//   for (i = 0; i < l; i++) {
//     selElmnt = x[i].getElementsByTagName("select")[0];
//     ll = selElmnt.length;
//     /* For each element, create a new DIV that will act as the selected item: */
//     a = document.createElement("DIV");
//     a.setAttribute("class", "select-selected");
//     a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
//     x[i].appendChild(a);
//     /* For each element, create a new DIV that will contain the option list: */
//     b = document.createElement("DIV");
//     b.setAttribute("class", "select-items select-hide");
//     for (j = 1; j < ll; j++) {
//       /* For each option in the original select element,
//           create a new DIV that will act as an option item: */
//       c = document.createElement("DIV");
//       c.innerHTML = selElmnt.options[j].innerHTML;
//       c.addEventListener("click", function (e) {
//         /* When an item is clicked, update the original select box,
//               and the selected item: */
//         var y, i, k, s, h, sl, yl;
//         s = this.parentNode.parentNode.getElementsByTagName("select")[0];
//         sl = s.length;
//         h = this.parentNode.previousSibling;
//         for (i = 0; i < sl; i++) {
//           if (s.options[i].innerHTML == this.innerHTML) {
//             s.selectedIndex = i;
//             h.innerHTML = this.innerHTML;
//             y = this.parentNode.getElementsByClassName("same-as-selected");
//             yl = y.length;
//             for (k = 0; k < yl; k++) {
//               y[k].removeAttribute("class");
//             }
//             this.setAttribute("class", "same-as-selected");
//             break;
//           }
//         }
//         h.click();
//       });
//       b.appendChild(c);
//     }
//     x[i].appendChild(b);
//     a.addEventListener("click", function (e) {
//       /* When the select box is clicked, close any other select boxes,
//           and open/close the current select box: */
//       e.stopPropagation();
//       closeAllSelect(this);
//       this.nextSibling.classList.toggle("select-hide");
//       this.classList.toggle("select-arrow-active");
//     });
//   }

//   function closeAllSelect(elmnt) {
//     /* A function that will close all select boxes in the document,
//       except the current select box: */
//     var x,
//       y,
//       i,
//       xl,
//       yl,
//       arrNo = [];
//     x = document.getElementsByClassName("select-items");
//     y = document.getElementsByClassName("select-selected");
//     xl = x.length;
//     yl = y.length;
//     for (i = 0; i < yl; i++) {
//       if (elmnt == y[i]) {
//         arrNo.push(i);
//       } else {
//         y[i].classList.remove("select-arrow-active");
//       }
//     }
//     for (i = 0; i < xl; i++) {
//       if (arrNo.indexOf(i)) {
//         x[i].classList.add("select-hide");
//       }
//     }
//   }

//   /* If the user clicks anywhere outside the select box,
//   then close all select boxes: */
//   document.addEventListener("click", closeAllSelect);
// });

// Чек боксы и их родители

// document.querySelectorAll('.method-item__input').forEach(function (checkbox) {
//     checkbox.addEventListener('click', function () {
//         // Убираем checked у всех элементов
//         document.querySelectorAll('.method-item__input').forEach(function (otherCheckbox) {
//             otherCheckbox.checked = false;
//             otherCheckbox.closest('.method-item').classList.remove('method-item--active');
//         });

//         // Ставим checked только на выбранный элемент
//         this.checked = true;

//         // Добавляем активный класс родителю выбранного элемента
//         this.closest('.method-item').classList.add('method-item--active');
//     });
// });

//

// Получаем все элементы с классом tub
// if ( document.querySelector('.tub') ) {
//     const tabs = document.querySelectorAll('.tub');
//     const tubElement = document.querySelectorAll('.tub-element');

//     tabs.forEach(tab => {
//         tab.addEventListener('click', function () {
//             tabs.forEach(t => t.classList.remove('tub--active'));

//             this.classList.add('tub--active');

//             tubElement.forEach(tub => tub.classList.remove('tub-element--active'));

//             const tubElementToActivate = document.querySelector(`.tub-element[id="${this.id}"]`);

//             if (tubElementToActivate) {
//                 tubElementToActivate.classList.add('tub-element--active');
//             }
//         });
//     });
// }
//

$(function () {
  $(".burger").on("click", function (event) {
    $("body").toggleClass("body--active");
  });

  $(".menu__link").on("click", function (event) {
    $("body").toggleClass("body--active");
  });
  // $('.header-top-lang').on('click', function (event) {
  //     $('.header-top-lang-content').toggleClass('header-top-lang-content--active');
  //     $(this).toggleClass('header-top-lang--active');
  // });

  // Делаем попап и скрываем по клику вне его
  // $(document).ready(function () {
  //     var $popup = $('.popup');
  //     var $popups = {
  //         call: $('.popup--call'),
  //         application: $('.popup--application'),
  //     };

  //     // Функция для показа попапа
  //     function showPopup($popupToShow) {
  //         $popupToShow.addClass('popup--active').fadeIn(250, function () {
  //             $(this).animate({ opacity: 1 }, 250);
  //         });
  //         $('body').addClass('body--popup');
  //     }

  //     // Функция для скрытия попапа
  //     function hidePopup($popupToHide) {
  //         $popupToHide.removeClass('popup--active').fadeOut(250, function () {
  //             $(this).animate({ opacity: 1 }, 250);
  //         });
  //         $('body').removeClass('body--popup');
  //     }

  //     // Обработчики кликов для показа попапов
  //     $('.heading-body__link').click(function (event) {
  //         event.stopPropagation();
  //         event.preventDefault();
  //         showPopup($popups.application);
  //     });

  //     // Обработчик кликов для скрытия попапов
  //     $('.cls').click(function (event) {
  //         event.stopPropagation();
  //         event.preventDefault();
  //         hidePopup($popup);
  //     });

  //     // Скрываем попап при клике вне его области
  //     $(document).click(function (event) {
  //         $.each($popups, function (key, $popupToCheck) {
  //             if ($popupToCheck.hasClass('popup--active')) {
  //                 var $popupInner = $popupToCheck.find('.popup__inner');
  //                 if (!$popupInner.is(event.target) && $popupInner.has(event.target).length === 0) {
  //                     hidePopup($popupToCheck);
  //                 }
  //             }
  //         });
  //     });
  // });
  //

  // Копировать значение с инпута
  // if (document.querySelector('.transfer-body__wallet-copy')) {
  //     document.querySelector('.transfer-body__wallet-copy').addEventListener('click', function () {
  //         // Находим элемент <input> по его id
  //         var inputElement = document.querySelector('.transfer-body__wallet-input');

  //         // Вызываем метод select() для выбора текста внутри элемента <input>
  //         inputElement.select();

  //         // Выполняем команду копирования выбранного текста в буфер обмена
  //         document.execCommand('copy');

  //         // Снимаем фокус с элемента, чтобы выделение текста не оставалось
  //         inputElement.blur();

  //         // Подсветка кнопки для обратной связи
  //         this.classList.add('copied');

  //         // Через какое-то время убираем подсветку кнопки
  //         setTimeout(function () {
  //             document.querySelector('.transfer-body__wallet-copy').classList.remove('copied');
  //         }, 500);
  //     });
  // }
});

// Делаем высоту слайдов одинаковой
// function setMaxHeightForProjects() {
//     setTimeout(() => {
//         let heights = [];

//         // Получаем высоту каждого элемента и добавляем в массив
//         document.querySelectorAll('.projects-swiper__slide').forEach(function (slide) {
//             heights.push(slide.getBoundingClientRect().height);
//         });

//         let maxHeight = Math.max(...heights);

//         // Устанавливаем высоту каждого элемента в самую большую высоту
//         document.querySelectorAll('.projects-swiper__slide').forEach(function (slide) {
//             slide.style.minHeight = maxHeight + 'px';
//         });
//     }, 200)
// }

// $(function () {
//     // Получаем нужный элемент
//     if (document.querySelector('.projects')) {
//         var element = document.querySelector('.projects');

//         var newsVisible = function (target) {
//             // let headerBottom = document.querySelectorAll('.header-bottom')[0]
//             // var menuBtn = document.querySelectorAll('.menu-btn')[0]
//             // var footerTop = document.querySelectorAll('.footer-top')[0]
//             // Все позиции элемента
//             var targetPosition = {
//                     top: window.pageYOffset + target.getBoundingClientRect().top,
//                     left: window.pageXOffset + target.getBoundingClientRect().left,
//                     right: window.pageXOffset + target.getBoundingClientRect().right,
//                     bottom: window.pageYOffset + target.getBoundingClientRect().bottom
//                 },
//                 // Получаем позиции окна
//                 windowPosition = {
//                     top: window.pageYOffset,
//                     left: window.pageXOffset,
//                     right: window.pageXOffset + document.documentElement.clientWidth,
//                     bottom: window.pageYOffset + document.documentElement.clientHeight
//                 };

//             if (targetPosition.bottom > windowPosition.top && // Если позиция нижней части элемента больше позиции верхней чайти окна, то элемент виден сверху
//                 targetPosition.top < windowPosition.bottom && // Если позиция верхней части элемента меньше позиции нижней чайти окна, то элемент виден снизу
//                 targetPosition.right > windowPosition.left && // Если позиция правой стороны элемента больше позиции левой части окна, то элемент виден слева
//                 targetPosition.left < windowPosition.right) { // Если позиция левой стороны элемента меньше позиции правой чайти окна, то элемент виден справа
//                 // Если элемент полностью видно, то запускаем следующий код
//                 setTimeout(() => {
//                     setMaxHeightForProjects()
//                 }, 1000)
//             } else {};
//         };

//         // Запускаем функцию при прокрутке страницы
//         window.addEventListener('scroll', function () {
//             newsVisible(element);
//         });

//         // А также запустим функцию сразу. А то вдруг, элемент изначально видно
//         newsVisible(element);
//     }
// })
//

// new Swiper('.catalog-first-swiper', {
//     slidesPerView: 6,
//     loop: true,
//     initialSlide: 0,
//     centeredSlides: true,
//     speed: 1000,
//     navigation: {
//         prevEl: '.catalog-first-swiper-button-prev',
//         nextEl: '.catalog-first-swiper-button-next',
//     },
//     pagination: {
//         el: '.recalls-swiper__pagination',
//         type: 'bullets',
//     },
//     autoplay: {
//         delay: 5000, // задержка между слайдами в миллисекундах
//         disableOnInteraction: false, // если true, автопрокрутка остановится при взаимодействии пользователя с swiper
//     },
//     breakpoints: {
//         301: {
//             slidesPerView: 2.2,
//             centeredSlides: true,
//             initialSlide: 1,
//             slidesPerGroup: 1,
//             loopedSlides: 6,
//         },
//         501: {
//             slidesPerView: 2.5,
//             centeredSlides: true,
//             initialSlide: 1,
//             slidesPerGroup: 1,
//             loopedSlides: 6,
//         },
//     }
// });

// timer
// setInterval(() => {
//     let timeNow = new Date() // Время сейчас
//     let timeNowTimeStamp = timeNow.getTime() // сколько прошоло с 1970 до теперешнего момената
//     // console.log(timeNowTimeStamp)

//     let ourDate = new Date('2023-03-19T23:14:00') // Время нашего знакомства
//     let ourDateTimeStamp = ourDate.getTime() // сколько прошоло с 1970 до теперешнего момената
//     // console.log(ourDateTimeStamp)

//     let timeStampMilliseconds = ourDateTimeStamp - timeNowTimeStamp // Миллисекунды ( разница между временем теперь и временем нашей встречи )

//     let secondsOfTimeStamp = timeStampMilliseconds / 1000 // Секунды - разницы
//     let minutesOfTimeStamp = secondsOfTimeStamp / 60 // минуты - разницы
//     let hoursOfTimeStamp = minutesOfTimeStamp / 60 // часы - разницы
//     let daysOfTimeStamp = hoursOfTimeStamp / 24 // Дни - разницы

//     let secondsOfTimeStampFloor = Math.floor(timeStampMilliseconds / 1000) // Секунды - разницы
//     let minutesOfTimeStampFloor = Math.floor(secondsOfTimeStamp / 60) // минуты - разницы
//     let secondsRamnant = secondsOfTimeStampFloor - (minutesOfTimeStampFloor * 60) // Остаток секунд - то есть наши секунды в Html
//     let hoursOfTimeStampFloor = Math.floor(minutesOfTimeStamp / 60) // часы - разницы
//     let minutesRamnant = minutesOfTimeStampFloor - (hoursOfTimeStampFloor * 60) // Остаток минут - то есть наши минуты в Html
//     let daysOfTimeStampFloor = Math.floor(hoursOfTimeStamp / 24) // Дни - разницы
//     let hoursRamnant = hoursOfTimeStampFloor - (daysOfTimeStampFloor * 24) // Остаток часов - то есть наши часы в Html

//     let hours = document.querySelector('.header-bottom-body-row__item-text--hours')

//     let minutes = document.querySelector('.header-bottom-body-row__item-text--minutes')

//     let seconds = document.querySelector('.header-bottom-body-row__item-text--seconds')

//     // // //

//     seconds.innerHTML = secondsRamnant

//     if (hoursRamnant < 10) {
//         console.log(String(hoursRamnant)[0])
//         hours.innerHTML = '0' + String(hoursRamnant) + '<span>:</span>'
//     } else {
//         hours.innerHTML = String(hoursRamnant) + '<span>:</span>'
//     }

//     if (minutesRamnant < 10) {
//         minutes.innerHTML = '0' + String(minutesRamnant) + '<span>:</span>'
//     } else {
//         minutes.innerHTML = String(minutesRamnant) + '<span>:</span>'
//     }

//     if (secondsRamnant < 10) {
//         seconds.innerHTML = '0' + String(secondsRamnant)
//     } else {
//         seconds.innerHTML = String(secondsRamnant)
//     }
// }, 1000)
// //

// typed js

// $(".typed").typed({
//     strings: ["Графічним дизайнерам", "Початковим веб-дизайнерам", "Студентам/школярам", "Офісним працівникам"],
//     // Optionally use an HTML element to grab strings from (must wrap each string in a <p>)
//     stringsElement: null,
//     // typing speed
//     typeSpeed: 30,
//     // time before typing starts
//     startDelay: 1200,
//     // backspacing speed
//     backSpeed: 20,
//     // time before backspacing
//     backDelay: 500,
//     // loop
//     loop: true,
//     // false = infinite
//     loopCount: 5,
//     // show cursor
//     showCursor: false,
//     // character for cursor
//     cursorChar: "|",
//     // attribute to type (null == text)
//     attr: null,
//     // either html or text
//     contentType: 'html',
//     // call when done callback function
//     callback: function () {},
//     // starting callback function before each string
//     preStringTyped: function () {},
//     //callback for every typed string
//     onStringTyped: function () {},
//     // callback for reset
//     resetCallback: function () {}
// });
// //

// Phone mask

// window.addEventListener("DOMContentLoaded", function () {
//     [].forEach.call(document.querySelectorAll('.tel'), function (input) {
//         var keyCode;

//         function mask(event) {
//             event.keyCode && (keyCode = event.keyCode);
//             var pos = this.selectionStart;
//             if (pos < 3) event.preventDefault();
//             var matrix = "+7 (___) ___-____",
//                 i = 0,
//                 def = matrix.replace(/\D/g, ""),
//                 val = this.value.replace(/\D/g, ""),
//                 new_value = matrix.replace(/[_\d]/g, function (a) {
//                     return i < val.length ? val.charAt(i++) || def.charAt(i) : a
//                 });
//             i = new_value.indexOf("_");
//             if (i != -1) {
//                 i < 5 && (i = 3);
//                 new_value = new_value.slice(0, i)
//             }
//             var reg = matrix.substr(0, this.value.length).replace(/_+/g,
//                 function (a) {
//                     return "\\d{1," + a.length + "}"
//                 }).replace(/[+()]/g, "\\$&");
//             reg = new RegExp("^" + reg + "$");
//             if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
//             if (event.type == "blur" && this.value.length < 5) this.value = ""
//         }

//         input.addEventListener("input", mask, false);
//         input.addEventListener("focus", mask, false);
//         input.addEventListener("blur", mask, false);
//         input.addEventListener("keydown", mask, false)

//     });

// });

// //

// Visibilyto of element on scroll or not
// $(function () {
//     // Получаем нужный элемент
//     var element = document.querySelector('footer');

//     var Visible = function (target) {
//         // let headerBottom = document.querySelectorAll('.header-bottom')[0]
//         // var menuBtn = document.querySelectorAll('.menu-btn')[0]
//         // var footerTop = document.querySelectorAll('.footer-top')[0]
//         // Все позиции элемента
//         var targetPosition = {
//                 top: window.pageYOffset + target.getBoundingClientRect().top,
//                 left: window.pageXOffset + target.getBoundingClientRect().left,
//                 right: window.pageXOffset + target.getBoundingClientRect().right,
//                 bottom: window.pageYOffset + target.getBoundingClientRect().bottom
//             },
//             // Получаем позиции окна
//             windowPosition = {
//                 top: window.pageYOffset,
//                 left: window.pageXOffset,
//                 right: window.pageXOffset + document.documentElement.clientWidth,
//                 bottom: window.pageYOffset + document.documentElement.clientHeight
//             };

//         if (targetPosition.bottom > windowPosition.top && // Если позиция нижней части элемента больше позиции верхней чайти окна, то элемент виден сверху
//             targetPosition.top < windowPosition.bottom && // Если позиция верхней части элемента меньше позиции нижней чайти окна, то элемент виден снизу
//             targetPosition.right > windowPosition.left && // Если позиция правой стороны элемента больше позиции левой части окна, то элемент виден слева
//             targetPosition.left < windowPosition.right) { // Если позиция левой стороны элемента меньше позиции правой чайти окна, то элемент виден справа
//             // Если элемент полностью видно, то запускаем следующий код
//             $('.connection__bottom-btn').addClass('connection__bottom-btn--none')
//             $('.connection').addClass('connection-margin')

//         } else {
//             $('.connection__bottom-btn').removeClass('connection__bottom-btn--none')
//             $('.connection').removeClass('connection-margin')
//         };
//     };

//     // Запускаем функцию при прокрутке страницы
//     window.addEventListener('scroll', function () {
//         Visible(element);
//     });

//     // А также запустим функцию сразу. А то вдруг, элемент изначально видно
//     Visible(element);
// })
// //
