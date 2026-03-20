/**
 * scroll-layers.js
 * Горизонтальный скролл и слои banner/contact/footer
 */

const ScrollLayers = {
  timeline: null,
  elements: null,
  refreshHandler: null,
  refreshRaf: null,

  init() {
    const last = $("#last");
    if (!last) return;

    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      console.warn("GSAP или ScrollTrigger не загружены");
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    this.destroy();

    const banner = $("#banner");
    const contact = $("#contact");
    const footer = $("#footer");

    if (!banner || !contact || !footer) {
      console.warn("Не найдены необходимые элементы для scroll layers");
      return;
    }

    const bannerInner = $(".banner__inner", banner);
    const contactInner = $(".contact__inner", contact);

    if (!bannerInner || !contactInner) {
      console.warn("Не найдены внутренние элементы для scroll layers");
      return;
    }

    this.elements = {
      last,
      banner,
      contact,
      footer,
      bannerInner,
      contactInner,
    };

    const getBannerScrollMax = () =>
      Math.max(0, bannerInner.scrollHeight - banner.offsetHeight);

    const getContactScrollMax = () =>
      Math.max(0, contactInner.scrollHeight - contact.offsetHeight);

    const getIntroDistance = () =>
      Math.max(window.innerHeight, Math.round(window.innerWidth * 0.35));

    const getFooterDistance = () =>
      Math.max(footer.offsetHeight, Math.round(window.innerHeight * 0.6));

    const getTotalScroll = () =>
      getIntroDistance() + getContactScrollMax() + getFooterDistance();

    const applyBaseState = () => {
      gsap.set([banner, contact, footer, bannerInner, contactInner], {
        clearProps: "transform,opacity",
      });

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

      gsap.set(last, {
        position: "relative",
        overflow: "hidden",
      });

      gsap.set(banner, {
        xPercent: 0,
        opacity: 1,
      });

      gsap.set([bannerInner, contactInner], {
        y: 0,
      });

      // Футер стартует снизу и выезжает одной фазой без лишнего холостого скролла.
      gsap.set(footer, {
        yPercent: 0,
        y: getFooterDistance(),
      });
    };

    applyBaseState();

    const tl = gsap.timeline({
      defaults: {
        ease: "none",
      },
      scrollTrigger: {
        id: "scroll-layers",
        trigger: last,
        start: "top top",
        end: () => `+=${getTotalScroll()}`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefreshInit: applyBaseState,
      },
    });

    // Фаза 1 — contact налезает справа, banner уходит влево.
    // Внутренний скролл banner идёт параллельно, чтобы не создавать лишнюю "пустую" фазу.
    tl.to(contact, { left: "0%", duration: 1 });
    tl.to(
      banner,
      { xPercent: -10, opacity: 0.2, duration: 1 },
      0,
    );
    tl.to(
      bannerInner,
      { y: () => -getBannerScrollMax(), duration: 1 },
      0,
    );

    // Фаза 2 — внутренний скролл contact только на реальную высоту контента.
    tl.to(contactInner, {
      y: () => -getContactScrollMax(),
      duration: 1,
    });

    // Фаза 3 — футер выезжает снизу одной фазой.
    tl.to(footer, {
      y: 0,
      duration: 1,
    });

    this.timeline = tl;

    this.refreshHandler = () => {
      if (this.refreshRaf) {
        cancelAnimationFrame(this.refreshRaf);
      }

      this.refreshRaf = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    };

    window.addEventListener("load", this.refreshHandler);
    window.addEventListener("resize", this.refreshHandler);

    this.refreshHandler();
  },

  // Уничтожение только собственного инстанса и сброс инлайн-стилей.
  destroy() {
    if (this.refreshHandler) {
      window.removeEventListener("load", this.refreshHandler);
      window.removeEventListener("resize", this.refreshHandler);
      this.refreshHandler = null;
    }

    if (this.refreshRaf) {
      cancelAnimationFrame(this.refreshRaf);
      this.refreshRaf = null;
    }

    if (this.timeline) {
      if (this.timeline.scrollTrigger) {
        this.timeline.scrollTrigger.kill();
      }
      this.timeline.kill();
      this.timeline = null;
    }

    if (this.elements) {
      const { last, banner, contact, footer, bannerInner, contactInner } =
        this.elements;

      gsap.set([last, banner, contact, footer, bannerInner, contactInner], {
        clearProps:
          "position,top,left,width,zIndex,overflow,transform,opacity,y,yPercent",
      });

      this.elements = null;
    }
  },
};
