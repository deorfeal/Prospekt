/**
 * components.js
 * Табы, бургер-меню, попапы, переключатели
 */

const Components = {
  init() {
    this.initTabs();
    this.initBurger();
    this.initPopups();
    this.initLanguageToggle();
    this.initMenuHover();
  },

  initTabs() {
    $$(".tub[data-tubs]").forEach((tab) => {
      tab.addEventListener("click", () => {
        const group = tab.dataset.tubs;
        const tabs = $$(`.tub[data-tubs="${group}"]`);
        const contents = $$(`.tub-element[data-tubs="${group}"]`);
        const tabIndex = tabs.indexOf(tab);

        tabs.forEach((t) => t.classList.remove("tub--active"));
        tab.classList.add("tub--active");

        contents.forEach((el) => el.classList.remove("tub-element--active"));
        if (contents[tabIndex]) {
          contents[tabIndex].classList.add("tub-element--active");
        }
      });
    });
  },

  initBurger() {
    if (typeof jQuery === "undefined") return;

    jQuery(function () {
      jQuery(".burger").on("click", function (event) {
        jQuery("body").toggleClass("body--active");
      });

      jQuery(".menu-item__link").on("click", function (event) {
        jQuery("body").toggleClass("body--active");
      });
    });
  },

  initPopups() {
    if (typeof jQuery === "undefined") return;

    jQuery(document).ready(function () {
      var $popup = jQuery(".popup");
      var $popups = {
        connect: jQuery(".popup--connect"),
        request: jQuery(".popup--request"),
      };

      window.showPopup = function ($popupToShow) {
        $popupToShow.addClass("popup--active").fadeIn(250, function () {
          jQuery(this).animate({ opacity: 1 }, 250);
        });
        jQuery("body").addClass("body--popup");
      };

      window.hidePopup = function ($popupToHide) {
        $popupToHide.removeClass("popup--active").fadeOut(250, function () {
          jQuery(this).animate({ opacity: 1 }, 250);
        });
        jQuery("body").removeClass("body--popup");
      };

      jQuery(".header__link, .navigation__link").click(function (event) {
        event.stopPropagation();
        event.preventDefault();
        window.showPopup($popups.connect);
      });

      jQuery(".cls").click(function (event) {
        event.stopPropagation();
        event.preventDefault();
        window.hidePopup($popup);
      });

      jQuery(document).click(function (event) {
        jQuery.each($popups, function (key, $popupToCheck) {
          if ($popupToCheck.hasClass("popup--active")) {
            var $popupInner = $popupToCheck.find(".popup__inner");
            if (
              !$popupInner.is(event.target) &&
              $popupInner.has(event.target).length === 0
            ) {
              window.hidePopup($popupToCheck);
            }
          }
        });
      });
    });
  },

  showSuccessPopup(form) {
    if (typeof jQuery === "undefined") return;
    if (typeof window.showPopup === "function") {
      // Определяем какой попап показывать (можно по классу формы)
      const $popup = form?.classList.contains("popup-form") 
        ? jQuery(".popup--request") 
        : jQuery(".popup--request");
      window.showPopup($popup);
    }
  },

  initLanguageToggle() {
    const toggles = $$(".language-toggle");
    if (!toggles.length) return;

    let isUpdating = false;

    toggles.forEach((toggleWrapper) => {
      const toggle = $('input[type="checkbox"]', toggleWrapper);

      toggle.addEventListener("change", function () {
        if (isUpdating) return;
        isUpdating = true;

        const isChecked = this.checked;

        toggles.forEach((otherWrapper) => {
          const otherToggle = $('input[type="checkbox"]', otherWrapper);
          const otherSlider = $(".language-toggle__slider", otherWrapper);
          const otherEn = $(".language-toggle__label--en", otherWrapper);
          const otherDe = $(".language-toggle__label--de", otherWrapper);

          otherToggle.checked = isChecked;

          otherSlider.classList.remove(
            "language-toggle__slider--animating",
            "language-toggle__slider--animating-reverse"
          );
          otherSlider.classList.add(
            isChecked
              ? "language-toggle__slider--animating"
              : "language-toggle__slider--animating-reverse"
          );

          if (isChecked) {
            otherEn?.classList.add("language-toggle__label--inactive");
            otherDe?.classList.remove("language-toggle__label--inactive");
          } else {
            otherEn?.classList.remove("language-toggle__label--inactive");
            otherDe?.classList.add("language-toggle__label--inactive");
          }

          setTimeout(() => {
            otherSlider.classList.remove(
              "language-toggle__slider--animating",
              "language-toggle__slider--animating-reverse"
            );
          }, 400);
        });

        isUpdating = false;
      });
    });
  },

  initMenuHover() {
    const pageBg = $(".page-bg");
    if (!pageBg) return;

    $$(".menu-item").forEach((item) => {
      item.addEventListener("mouseenter", () => {
        pageBg.classList.add("page-bg--active");
      });
      item.addEventListener("mouseleave", () => {
        pageBg.classList.remove("page-bg--active");
      });
    });
  },
};