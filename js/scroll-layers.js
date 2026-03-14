/**
 * scroll-layers.js
 * Горизонтальный скролл и слои banner/contact/footer
 */

const ScrollLayers = {
  init() {
    if (!$("#last")) return;
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      console.warn("GSAP или ScrollTrigger не загружены");
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const banner = $("#banner");
    const contact = $("#contact");
    const footer = $("#footer");

    if (!banner || !contact || !footer) {
      console.warn("Не найдены необходимые элементы для scroll layers");
      return;
    }

    const bannerInner = $(".banner__inner", banner);
    const contactInner = $(".contact__inner", contact);

    // Расчёт максимальной прокрутки (как в оригинале)
    const bannerScrollMax = Math.max(
      0,
      bannerInner.scrollHeight - banner.offsetHeight,
    );
    const contactScrollMax = Math.max(
      0,
      contactInner.scrollHeight - contact.offsetHeight,
    );

    // Начальные позиции (как в оригинале)
    gsap.set(contact, {
      position: "absolute",
      top: 0,
      left: "100%",
      width: "100%",
      zIndex: 2,
    });

    gsap.set([banner, contact], {
      overflow: "hidden",
    });

    gsap.set("#last", {
      position: "relative",
      overflow: "hidden",
    });

    gsap.set(footer, {
      yPercent: -100,
    });

    // Таймлайн (как в оригинале)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#last",
        start: "top top",
        end: "+=500%",
        pin: true,
        pinSpacing: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // Фаза 1 — contact налезает справа, banner уходит влево
    tl.to(contact, { left: "0%", ease: "none", duration: 1 });
    tl.to(
      banner,
      { xPercent: -10, opacity: 0.2, ease: "none", duration: 1 },
      0,
    );

    // Фаза 2 — внутренний скролл banner
    tl.to(bannerInner, { y: -bannerScrollMax, ease: "none", duration: 1 });

    // Фаза 3 — внутренний скролл contact
    tl.to(contactInner, { y: -contactScrollMax, ease: "none", duration: 1 });

    // Фаза 4 — футер выезжает снизу на свою высоту
    tl.to(footer, {
      yPercent: 0,
      y: footer.offsetHeight,
    });

    tl.to(footer, { y: 0, ease: "none", duration: 1 });
  },

  // Уничтожение (для cleanup)
  destroy() {
    ScrollTrigger.getAll().forEach((st) => st.kill());
  },
};