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
    const bannerWrapper = $(".banner__wrapper", banner);
    const contactInner = $(".contact__inner", contact);
    const contactWrapper = $(".contact__wrapper", contact);
    const lastInner = $(".last__inner", last);

    if (!bannerInner || !bannerWrapper || !contactInner || !contactWrapper || !lastInner) {
      console.warn("Не найдены внутренние элементы для scroll layers");
      return;
    }

    this.elements = {
      last,
      lastInner,
      banner,
      contact,
      footer,
      bannerInner,
      bannerWrapper,
      contactInner,
      contactWrapper,
    };

    const getBannerScrollMax = () =>
      Math.max(0, bannerWrapper.scrollHeight - banner.clientHeight);

    const getContactScrollMax = () =>
      Math.max(0, contactInner.scrollHeight - contact.clientHeight);

    const getIntroDistance = () =>
      Math.max(window.innerHeight, Math.round(window.innerWidth * 0.35));

    const getFooterDistance = () =>
      Math.max(footer.offsetHeight, 1);

    const getTotalScroll = () =>
      getIntroDistance() + getContactScrollMax() + getFooterDistance();

    const applyBaseState = () => {
      gsap.set(
        [
          banner,
          contact,
          footer,
          bannerInner,
          bannerWrapper,
          contactInner,
          contactWrapper,
        ],
        {
          clearProps: "transform,opacity",
        },
      );

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
        backgroundColor: "#ffffff",
      });

      gsap.set(lastInner, {
        position: "relative",
        height: "100%",
      });

      gsap.set(banner, {
        xPercent: 0,
        opacity: 1,
        "--banner-darkness": 0,
      });

      gsap.set(bannerInner, {
        opacity: 1,
      });

      gsap.set(contact, {
        y: 0,
      });

      gsap.set([bannerWrapper, contactInner, contactWrapper], {
        y: 0,
      });

      // Футер стартует снизу и выезжает одной фазой без лишнего холостого скролла.
      gsap.set(footer, {
        position: "absolute",
        top: "100%",
        left: 0,
        width: "100%",
        zIndex: 3,
        force3D: true,
        willChange: "transform",
        yPercent: 0,
        y: 0,
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

    // Каждая фаза использует реальную дистанцию, чтобы скорость анимации не "плавала"
    // при изменении высоты контента и не появлялись холостые участки скролла.
    const getIntroDuration = () => Math.max(1, getIntroDistance());
    const getContactDuration = () => Math.max(1, getContactScrollMax());
    const getFooterDuration = () => Math.max(1, getFooterDistance());
    const introDarkenStartRatio = 0.75;
    const introDuration = getIntroDuration();
    const introDarkenDelay = introDuration * introDarkenStartRatio;
    const introDarkenDuration = Math.max(
      0.01,
      introDuration * (1 - introDarkenStartRatio),
    );
    const contactDuration = getContactDuration();
    const footerDuration = getFooterDuration();
    const contactOverlapRatio = 0.22;
    const getContactLeadDuration = () =>
      Math.max(0, contactDuration * (1 - contactOverlapRatio));
    const getContactTailDuration = () =>
      Math.max(0, contactDuration * contactOverlapRatio);
    const getContactLeadOffset = () =>
      getContactScrollMax() * (1 - contactOverlapRatio);

    // Фаза 1 — contact налезает справа, banner уходит влево.
    // Внутренний скролл banner идёт параллельно, чтобы не создавать лишнюю "пустую" фазу.
    tl.to(contact, { left: "0%", duration: introDuration });
    tl.to(
      banner,
      {
        xPercent: -10,
        duration: introDuration,
      },
      0,
    );
    tl.to(
      banner,
      {
        opacity: 0.2,
        "--banner-darkness": 1,
        duration: introDarkenDuration,
      },
      introDarkenDelay,
    );
    tl.to(
      bannerInner,
      {
        opacity: 0,
        duration: introDarkenDuration,
      },
      introDarkenDelay,
    );
    tl.to(
      last,
      {
        backgroundColor: "#060606",
        duration: introDarkenDuration,
      },
      introDarkenDelay,
    );
    tl.to(
      bannerWrapper,
      { y: () => -getBannerScrollMax(), duration: introDuration },
      0,
    );

    // Фаза 2 — основной внутренний скролл contact.
    tl.to(contactInner, {
      y: () => -getContactLeadOffset(),
      duration: getContactLeadDuration,
    });

    // Фаза 3 — финальная часть contact и появление футера идут внахлёст,
    // чтобы переход был бесшовным, как между banner и contact.
    tl.to(contactInner, {
      y: () => -getContactScrollMax(),
      duration: getContactTailDuration,
    });
    tl.to(contact, {
      y: () => -getFooterDistance(),
      duration: footerDuration,
    }, "<");
    tl.to(footer, {
      y: () => -getFooterDistance(),
      duration: footerDuration,
    }, "<");

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
      const {
        last,
        lastInner,
        banner,
        contact,
        footer,
        bannerInner,
        bannerWrapper,
        contactInner,
        contactWrapper,
      } =
        this.elements;

      gsap.set(
        [
          last,
          lastInner,
          banner,
          contact,
          footer,
          bannerWrapper,
          contactWrapper,
        ],
        {
          clearProps:
            "position,top,left,width,zIndex,overflow,transform,opacity,y,yPercent",
        },
      );

      this.elements = null;
    }
  },
};
