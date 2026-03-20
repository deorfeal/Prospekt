// document.addEventListener("DOMContentLoaded", function () {
//   function initBrushStroke() {
//     const path = document.querySelector(".advantages-bg .brush-stroke");
//     if (!path) return;

//     const length = path.getTotalLength();
//     path.style.strokeDasharray = length;
//     path.style.strokeDashoffset = length;

//     const trigger =
//       document.querySelector(".advantages__bg").closest("section") ||
//       document.querySelector(".advantages__bg").parentElement;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             path.style.transition = "stroke-dashoffset 3s ease-out";
//             path.style.strokeDashoffset = "0";
//             observer.disconnect();
//           }
//         });
//       },
//       {
//         rootMargin: "0px 0px -10% 0px",
//         threshold: 0,
//       },
//     );

//     observer.observe(trigger);
//   }

//   // ── AOS + StrokeText ─────────────────────────────────────────────────────
//   if (document.querySelector(".preloader")) {
//     const preloader = document.querySelector(".preloader");
//     const animationTime = 4000;

//     setTimeout(() => {
//       preloader.classList.add("hide");

//       setTimeout(() => {
//         preloader.style.display = "none";

//         AOS.init({
//           duration: 1500,
//           offset: 0,
//           anchorPlacement: "top-bottom",
//         });

//         StrokeText.init();
//         initBrushStroke(); // ← запускаем вместе с AOS, после прелоадера
//         initScrollLayers();
//       }, 600);
//     }, animationTime);
//   } else {
//     jQuery(document).ready(function () {
//       (function () {
//         AOS.init({
//           duration: 1500,
//           offset: 0,
//           anchorPlacement: "top-bottom",
//         });

//         StrokeText.init();
//         initBrushStroke(); // ← и здесь, если прелоадера нет
//       })();
//     });

//     setTimeout(initScrollLayers, 100);
//   }

//   // ── GSAP ScrollTrigger ────────────────────────────────────────────────────
//   function initScrollLayers() {
//     if (!document.querySelector("#last")) return;

//     const banner = document.getElementById("banner");
//     const contact = document.getElementById("contact");
//     // const footer = document.getElementById("footer");

//     const bannerInner = banner.querySelector(".banner__inner");
//     const contactInner = contact.querySelector(".contact__inner");

//     const bannerScrollMax = Math.max(
//       0,
//       bannerInner.scrollHeight - banner.offsetHeight,
//     );
//     const contactScrollMax = Math.max(
//       0,
//       contactInner.scrollHeight - contact.offsetHeight,
//     );

//     gsap.set(contact, {
//       position: "absolute",
//       top: 0,
//       left: "100%",
//       width: "100%",
//       zIndex: 2,
//     });

//     gsap.set([banner, contact], {
//       overflow: "hidden",
//     });

//     gsap.set("#last", {
//       position: "relative",
//       overflow: "hidden",
//     });

//     gsap.set(footer, {
//       yPercent: -100,
//     });

//     const tl = gsap.timeline({
//       scrollTrigger: {
//         trigger: "#last",
//         start: "top top",
//         end: "+=500%",
//         pin: true,
//         pinSpacing: true,
//         scrub: 1,
//         anticipatePin: 1,
//         invalidateOnRefresh: true,
//       },
//     });

//     // Фаза 1 — contact налезает справа, banner уходит влево
//     tl.to(contact, { left: "0%", ease: "none", duration: 1 });
//     tl.to(
//       banner,
//       { xPercent: -10, opacity: 0.2, ease: "none", duration: 1 },
//       0,
//     );

//     // Фаза 2 — внутренний скролл banner
//     tl.to(bannerInner, { y: -bannerScrollMax, ease: "none", duration: 1 });

//     // Фаза 3 — внутренний скролл contact
//     tl.to(contactInner, { y: -contactScrollMax, ease: "none", duration: 1 });

//     // Фаза 4 — футер выезжает снизу
//     // Фаза 4 — футер выезжает снизу на свою высоту
//     tl.to(footer, {
//       yPercent: 0,
//       y: footer.offsetHeight,
//     });

//     tl.to(footer, { y: 0, ease: "none", duration: 1 });
//   }
// });

// // ── UTILS ──────────────────────────────────────────────────────────────────
// function closeAll(except) {
//   document.querySelectorAll(".custom-select--open").forEach((el) => {
//     if (el !== except) el.classList.remove("custom-select--open");
//   });
// }

// // ── SERVICES SELECT ────────────────────────────────────────────────────────
// document.querySelectorAll(".custom-select--services").forEach((select) => {
//   const trigger = select.querySelector(".custom-select__trigger");
//   const dropdown = select.querySelector(".custom-select__dropdown");
//   const valueEl = select.querySelector(".custom-select__value");
//   if (!trigger || !dropdown || !valueEl) return;

//   trigger.addEventListener("click", (e) => {
//     e.stopPropagation();
//     const isOpen = select.classList.contains("custom-select--open");
//     closeAll();
//     if (!isOpen) select.classList.add("custom-select--open");
//   });

//   dropdown.querySelectorAll(".custom-select__option").forEach((opt) => {
//     opt.addEventListener("click", () => {
//       dropdown
//         .querySelectorAll(".custom-select__option")
//         .forEach((o) => o.classList.remove("selected"));
//       opt.classList.add("selected");
//       valueEl.textContent = opt.textContent;
//       trigger.classList.add("has-value");
//       select.classList.remove("custom-select--open");
//       select.closest(".form-box").classList.remove("form-box--error");
//     });
//   });
// });

// // ── DATEPICKER ─────────────────────────────────────────────────────────────
// document.querySelectorAll(".custom-select--datepicker").forEach((wrap) => {
//   const trigger = wrap.querySelector(".custom-select__trigger");
//   const valueEl = wrap.querySelector(".custom-select__value");
//   const monthLabel = wrap.querySelector(".datepicker__month");
//   const grid = wrap.querySelector(".datepicker__grid");
//   const prevBtn = wrap.querySelector(".datepicker__nav--prev");
//   const nextBtn = wrap.querySelector(".datepicker__nav--next");
//   const dropdown = wrap.querySelector(".datepicker__dropdown");
//   if (
//     !trigger ||
//     !valueEl ||
//     !monthLabel ||
//     !grid ||
//     !prevBtn ||
//     !nextBtn ||
//     !dropdown
//   )
//     return;

//   const today = new Date();
//   let current = new Date(today.getFullYear(), today.getMonth(), 1);
//   let selectedDate = null;

//   const MONTHS = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];
//   const DAYS = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

//   function renderCalendar() {
//     monthLabel.textContent = `${MONTHS[current.getMonth()]} ${current.getFullYear()}`;
//     grid.innerHTML = "";

//     DAYS.forEach((d) => {
//       const el = document.createElement("div");
//       el.className = "datepicker__day-name";
//       el.textContent = d;
//       grid.appendChild(el);
//     });

//     const firstDay = new Date(
//       current.getFullYear(),
//       current.getMonth(),
//       1,
//     ).getDay();
//     const daysInMonth = new Date(
//       current.getFullYear(),
//       current.getMonth() + 1,
//       0,
//     ).getDate();
//     const daysInPrev = new Date(
//       current.getFullYear(),
//       current.getMonth(),
//       0,
//     ).getDate();

//     for (let i = firstDay - 1; i >= 0; i--) {
//       const el = document.createElement("div");
//       el.className = "datepicker__day other-month";
//       el.textContent = daysInPrev - i;
//       grid.appendChild(el);
//     }

//     for (let d = 1; d <= daysInMonth; d++) {
//       const el = document.createElement("div");
//       el.className = "datepicker__day";
//       el.textContent = d;

//       const thisDate = new Date(current.getFullYear(), current.getMonth(), d);
//       if (thisDate.toDateString() === today.toDateString())
//         el.classList.add("today");
//       if (
//         selectedDate &&
//         thisDate.toDateString() === selectedDate.toDateString()
//       )
//         el.classList.add("selected");

//       el.addEventListener("click", () => {
//         selectedDate = thisDate;
//         valueEl.textContent = `${MONTHS[thisDate.getMonth()].slice(0, 3)} ${thisDate.getDate()}, ${thisDate.getFullYear()}`;
//         trigger.classList.add("has-value");
//         renderCalendar();
//         wrap.classList.remove("custom-select--open");
//         wrap.closest(".form-box").classList.remove("form-box--error");
//       });

//       grid.appendChild(el);
//     }

//     const total = firstDay + daysInMonth;
//     const remainder = total % 7 === 0 ? 0 : 7 - (total % 7);
//     for (let d = 1; d <= remainder; d++) {
//       const el = document.createElement("div");
//       el.className = "datepicker__day other-month";
//       el.textContent = d;
//       grid.appendChild(el);
//     }
//   }

//   trigger.addEventListener("click", (e) => {
//     e.stopPropagation();
//     const isOpen = wrap.classList.contains("custom-select--open");
//     closeAll();
//     if (!isOpen) {
//       wrap.classList.add("custom-select--open");
//       renderCalendar();
//     }
//   });

//   prevBtn.addEventListener("click", (e) => {
//     e.stopPropagation();
//     current.setMonth(current.getMonth() - 1);
//     renderCalendar();
//   });

//   nextBtn.addEventListener("click", (e) => {
//     e.stopPropagation();
//     current.setMonth(current.getMonth() + 1);
//     renderCalendar();
//   });

//   dropdown.addEventListener("click", (e) => e.stopPropagation());
// });

// // ── TIMEPICKER ─────────────────────────────────────────────────────────────
// document.querySelectorAll(".custom-select--timepicker").forEach((wrap) => {
//   const trigger = wrap.querySelector(".custom-select__trigger");
//   const valueEl = wrap.querySelector(".custom-select__value");
//   const hoursEl = wrap.querySelector(".timepicker__field--hours");
//   const minutesEl = wrap.querySelector(".timepicker__field--minutes");
//   const amBtn = wrap.querySelector(".timepicker__ampm-btn--am");
//   const pmBtn = wrap.querySelector(".timepicker__ampm-btn--pm");
//   const dropdown = wrap.querySelector(".timepicker__dropdown");
//   if (
//     !trigger ||
//     !valueEl ||
//     !hoursEl ||
//     !minutesEl ||
//     !amBtn ||
//     !pmBtn ||
//     !dropdown
//   )
//     return;

//   let ampm = "PM";

//   function updateValue() {
//     valueEl.textContent = `${hoursEl.value.padStart(2, "0")}:${minutesEl.value.padStart(2, "0")} ${ampm}`;
//     trigger.classList.add("has-value");
//   }

//   function sanitizeTime(el, max) {
//     el.addEventListener("input", () => {
//       el.value = el.value.replace(/\D/g, "");
//       if (parseInt(el.value) > max) el.value = String(max);
//       updateValue();
//     });
//     el.addEventListener("blur", () => {
//       el.value = el.value.padStart(2, "0");
//     });
//   }

//   sanitizeTime(hoursEl, 12);
//   sanitizeTime(minutesEl, 59);

//   amBtn.addEventListener("click", () => {
//     ampm = "AM";
//     amBtn.classList.add("active");
//     pmBtn.classList.remove("active");
//     updateValue();
//   });

//   pmBtn.addEventListener("click", () => {
//     ampm = "PM";
//     pmBtn.classList.add("active");
//     amBtn.classList.remove("active");
//     updateValue();
//   });

//   trigger.addEventListener("click", (e) => {
//     e.stopPropagation();
//     const isOpen = wrap.classList.contains("custom-select--open");
//     closeAll();
//     if (!isOpen) wrap.classList.add("custom-select--open");
//   });

//   dropdown.addEventListener("click", (e) => e.stopPropagation());
// });

// // ── CLOSE ON OUTSIDE CLICK ─────────────────────────────────────────────────
// document.addEventListener("click", () => closeAll());
// //

// document
//   .querySelector(".contact__form")
//   .addEventListener("submit", function (e) {
//     e.preventDefault();

//     const formBoxes = this.querySelectorAll(".form-box");
//     let isValid = true;

//     formBoxes.forEach((box) => {
//       const input = box.querySelector('input:not([type="file"]), textarea');
//       const select = box.querySelector(
//         ".custom-select__value, #datepicker-value, #timepicker-value",
//       );
//       const fileInput = box.querySelector('input[type="file"]');

//       let filled = false;

//       if (input) {
//         filled = input.value.trim() !== "";
//       } else if (select) {
//         const placeholder = ["Select a Service", "Select date", "Select time"];
//         filled = !placeholder.includes(select.textContent.trim());
//       } else if (fileInput) {
//         // upload optional — пропускаем
//         filled = true;
//       } else {
//         filled = true;
//       }

//       if (!filled) {
//         box.classList.add("form-box--error");
//         isValid = false;
//       } else {
//         box.classList.remove("form-box--error");
//       }
//     });

//     if (isValid) {
//       // отправка формы
//       console.log("Form submitted");
//     }
//   });

// // Снимаем ошибку при вводе
// document.querySelectorAll(".form-box").forEach((box) => {
//   // Инпуты и textarea
//   box
//     .querySelectorAll('input:not([type="file"]), textarea')
//     .forEach((input) => {
//       input.addEventListener("input", () => {
//         if (input.value.trim() !== "") box.classList.remove("form-box--error");
//       });
//     });
// });

// //

// const pageBg = document.querySelector(".page-bg");
// const menuItems = document.querySelectorAll(".menu-item");

// menuItems.forEach((item) => {
//   item.addEventListener("mouseenter", () => {
//     pageBg.classList.add("page-bg--active");
//   });

//   item.addEventListener("mouseleave", () => {
//     pageBg.classList.remove("page-bg--active");
//   });
// });

// //

// // Находим все переключатели на странице
// const toggles = document.querySelectorAll(".language-toggle");

// // Флаг для предотвращения рекурсивных вызовов
// let isUpdating = false;

// toggles.forEach((toggleWrapper) => {
//   const toggle = toggleWrapper.querySelector("input[type='checkbox']");

//   toggle.addEventListener("change", function () {
//     // Если уже идёт обновление, выходим
//     if (isUpdating) return;

//     // Устанавливаем флаг
//     isUpdating = true;

//     // Берём текущее состояние чекбокса
//     const isChecked = this.checked;

//     // Обновляем все переключатели одновременно
//     toggles.forEach((otherWrapper) => {
//       const otherToggle = otherWrapper.querySelector("input[type='checkbox']");
//       const otherSlider = otherWrapper.querySelector(
//         ".language-toggle__slider",
//       );
//       const otherEn = otherWrapper.querySelector(".language-toggle__label--en");
//       const otherDe = otherWrapper.querySelector(".language-toggle__label--de");

//       // Меняем состояние чекбокса
//       otherToggle.checked = isChecked;

//       // Анимация слайдера
//       otherSlider.classList.remove(
//         "language-toggle__slider--animating",
//         "language-toggle__slider--animating-reverse",
//       );
//       otherSlider.classList.add(
//         isChecked
//           ? "language-toggle__slider--animating"
//           : "language-toggle__slider--animating-reverse",
//       );

//       // Меняем метки
//       if (isChecked) {
//         otherEn.classList.add("language-toggle__label--inactive");
//         otherDe.classList.remove("language-toggle__label--inactive");
//       } else {
//         otherEn.classList.remove("language-toggle__label--inactive");
//         otherDe.classList.add("language-toggle__label--inactive");
//       }

//       // Убираем класс анимации после завершения
//       setTimeout(() => {
//         otherSlider.classList.remove(
//           "language-toggle__slider--animating",
//           "language-toggle__slider--animating-reverse",
//         );
//       }, 400);
//     });

//     // Снимаем флаг после завершения всех обновлений
//     isUpdating = false;
//   });
// });

// //

// document.querySelectorAll(".tub[data-tubs]").forEach((tab, index, tabList) => {
//   tab.addEventListener("click", () => {
//     const group = tab.dataset.tubs;

//     // Найдём все табы и элементы контента с тем же data-tubs
//     const tabs = Array.from(
//       document.querySelectorAll(`.tub[data-tubs="${group}"]`),
//     );
//     const contents = Array.from(
//       document.querySelectorAll(`.tub-element[data-tubs="${group}"]`),
//     );

//     const tabIndex = tabs.indexOf(tab);

//     // Сброс классов у всех табов этой группы
//     tabs.forEach((t) => t.classList.remove("tub--active"));
//     tab.classList.add("tub--active");

//     // Сброс классов у всех элементов этой группы
//     contents.forEach((el) => el.classList.remove("tub-element--active"));
//     if (contents[tabIndex]) {
//       contents[tabIndex].classList.add("tub-element--active");
//     }
//   });
// });

// //

// $(function () {
//   $(".burger").on("click", function (event) {
//     $("body").toggleClass("body--active");
//   });

//   $(".menu-item__link").on("click", function (event) {
//     $("body").toggleClass("body--active");
//   });
// });

// // Делаем попап и скрываем по клику вне его
// $(document).ready(function () {
//   var $popup = $(".popup");
//   var $popups = {
//     connect: $(".popup--connect"),
//     request: $(".popup--request"),
//   };

//   // Функция для показа попапа
//   function showPopup($popupToShow) {
//     $popupToShow.addClass("popup--active").fadeIn(250, function () {
//       $(this).animate({ opacity: 1 }, 250);
//     });
//     $("body").addClass("body--popup");
//   }

//   // Функция для скрытия попапа
//   function hidePopup($popupToHide) {
//     $popupToHide.removeClass("popup--active").fadeOut(250, function () {
//       $(this).animate({ opacity: 1 }, 250);
//     });
//     $("body").removeClass("body--popup");
//   }

//   // Обработчики кликов для показа попапов
//   $(".header__link, .navigation__link").click(function (event) {
//     event.stopPropagation();
//     event.preventDefault();
//     showPopup($popups.connect);
//   });

//   $(".form__button").click(function (event) {
//     event.stopPropagation();
//     event.preventDefault();
//     showPopup($popups.request);
//   });

//   // Обработчик кликов для скрытия попапов
//   $(".cls").click(function (event) {
//     event.stopPropagation();
//     event.preventDefault();
//     hidePopup($popup);
//   });

//   // Скрываем попап при клике вне его области
//   $(document).click(function (event) {
//     $.each($popups, function (key, $popupToCheck) {
//       if ($popupToCheck.hasClass("popup--active")) {
//         var $popupInner = $popupToCheck.find(".popup__inner");
//         if (
//           !$popupInner.is(event.target) &&
//           $popupInner.has(event.target).length === 0
//         ) {
//           hidePopup($popupToCheck);
//         }
//       }
//     });
//   });
// });
// //

// //

// new Swiper(".projectpages-swiper", {
//   slidesPerView: 1,
//   speed: 750,
//   effect: "fade",
//   loop: true,
//   fadeEffect: { crossFade: true },
//   navigation: {
//     prevEl: ".projectpages-arrow--prev",
//     nextEl: ".projectpages-arrow--next",
//   },
//   // breakpoints: {
//   //     301: {
//   //         slidesPerView: 2.2,
//   //         centeredSlides: true,
//   //         initialSlide: 1,
//   //         slidesPerGroup: 1,
//   //         loopedSlides: 6,
//   //     },
//   //     501: {
//   //         slidesPerView: 2.5,
//   //         centeredSlides: true,
//   //         initialSlide: 1,
//   //         slidesPerGroup: 1,
//   //         loopedSlides: 6,
//   //     },
//   // }
// });

// new Swiper(".projectmobile-swiper", {
//   slidesPerView: 3,
//   speed: 750,
//   spaceBetween: 55,
//   loop: true,
//   navigation: {
//     prevEl: ".projectmobile-arrow--prev",
//     nextEl: ".projectmobile-arrow--next",
//   },
//   breakpoints: {
//     301: {
//       slidesPerView: 1,
//       speed: 750,
//       spaceBetween: 30,
//       loop: true,
//     },
//     769: {
//       slidesPerView: 2,
//       speed: 750,
//       spaceBetween: 30,
//       loop: true,
//     },
//     1201: {
//       slidesPerView: 3,
//       speed: 750,
//       spaceBetween: 55,
//       loop: true,
//     },
//   },
// });

// new Swiper(".reviews-swiper", {
//   slidesPerView: 1,
//   speed: 750,
//   spaceBetween: 30,
//   effect: "fade",
//   loop: true,
//   fadeEffect: { crossFade: true },
//   navigation: {
//     nextEl: ".reviews-arrow--next",
//   },
//   // breakpoints: {
//   //     301: {
//   //         slidesPerView: 2.2,
//   //         centeredSlides: true,
//   //         initialSlide: 1,
//   //         slidesPerGroup: 1,
//   //         loopedSlides: 6,
//   //     },
//   //     501: {
//   //         slidesPerView: 2.5,
//   //         centeredSlides: true,
//   //         initialSlide: 1,
//   //         slidesPerGroup: 1,
//   //         loopedSlides: 6,
//   //     },
//   // }
// });

// //

// const recallsThumbs = new Swiper(".recalls-thumbs", {
//   slidesPerView: 5,
//   loop: true,
//   centeredSlides: true,
//   speed: 750,
//   watchSlidesProgress: true,
//   slideToClickedSlide: true,
//   breakpoints: {
//     301: {
//       slidesPerView: 1.75,
//       loop: true,
//       centeredSlides: true,
//       speed: 750,
//       watchSlidesProgress: true,
//       slideToClickedSlide: true,
//     },
//     551: {
//       slidesPerView: 2,
//       loop: true,
//       centeredSlides: true,
//       speed: 750,
//       watchSlidesProgress: true,
//       slideToClickedSlide: true,
//     },
//     769: {
//       slidesPerView: 3.5,
//       loop: true,
//       centeredSlides: true,
//       speed: 750,
//       watchSlidesProgress: true,
//       slideToClickedSlide: true,
//     },
//     1201: {
//       slidesPerView: 5,
//       loop: true,
//       centeredSlides: true,
//       speed: 750,
//       watchSlidesProgress: true,
//       slideToClickedSlide: true,
//     },
//   },
// });

// const contentSwiper = new Swiper(".recalls-swiper", {
//   slidesPerView: 1,
//   loop: true,
//   speed: 750,
//   effect: "fade",
//   fadeEffect: { crossFade: true },
//   autoplay: {
//     delay: 5000,
//     disableOnInteraction: false,
//   },
//   thumbs: {
//     swiper: recallsThumbs,
//   },
// });

// // Флаг для предотвращения рекурсии
// let isSyncing = false;

// // Синхронизация при свайпе превью
// recallsThumbs.on("slideChange", function () {
//   if (isSyncing) return;
//   isSyncing = true;
//   contentSwiper.slideToLoop(this.realIndex, 750);
//   setTimeout(() => (isSyncing = false), 100);
// });

// // Синхронизация при изменении основного слайдера
// contentSwiper.on("slideChange", function () {
//   if (isSyncing) return;
//   isSyncing = true;
//   recallsThumbs.slideToLoop(this.realIndex, 750);
//   setTimeout(() => (isSyncing = false), 100);
// });
