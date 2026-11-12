/**
 * projects-scroll.js
 * Смена проектов: ScrollTrigger на desktop и кнопки на mobile.
 */

const ProjectsScroll = {
  media: null,
  timeline: null,
  mobileTween: null,
  mobileIntro: null,
  mobileLoading: null,
  mobileIndex: 0,
  elements: null,
  imageLoads: null,
  preloadObserver: null,
  skipHandler: null,
  skipTween: null,
  cancelSkipScroll: null,

  init() {
    const section = $(".projects");

    if (!section) return;

    const loadDeferredImages = () => {
      $$("img[data-project-src]", section).forEach((image) => {
        image.src = image.dataset.projectSrc;
        image.removeAttribute("data-project-src");
      });
    };

    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      loadDeferredImages();
      return;
    }

    const items = $$(".projects-item", section);
    if (items.length < 2) {
      loadDeferredImages();
      return;
    }

    this.destroy();
    gsap.registerPlugin(ScrollTrigger);

    this.elements = {
      section,
      items,
      titles: items.map((item) => $(".projects__titling", item)),
      artworks: items.map((item) => $(".projects-item__project", item)),
      current: $("[data-projects-current]", section),
      total: $("[data-projects-total]", section),
      previousButton: $("[data-projects-prev]", section),
      nextButton: $("[data-projects-next]", section),
      skipLink: $(".projects__skip .skip__link", section),
    };

    this.skipHandler = (event) => {
      event.preventDefault();

      // ScrollTrigger оборачивает закреплённую секцию в pin-spacer на desktop.
      const sectionWrapper = section.parentElement?.classList.contains("pin-spacer")
        ? section.parentElement
        : section;
      const nextBlock = sectionWrapper.nextElementSibling;
      if (!nextBlock) return;

      this.cancelSkipScroll?.();

      const targetY = window.scrollY + nextBlock.getBoundingClientRect().top;
      const scrollPosition = { y: window.scrollY };
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) {
        window.scrollTo({ top: targetY, behavior: "instant" });
        return;
      }

      const cancelOnKey = (keyEvent) => {
        if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(keyEvent.key)) {
          this.cancelSkipScroll?.();
        }
      };
      this.cancelSkipScroll = () => {
        this.skipTween?.kill();
        this.skipTween = null;
        window.removeEventListener("wheel", this.cancelSkipScroll);
        window.removeEventListener("touchstart", this.cancelSkipScroll);
        window.removeEventListener("keydown", cancelOnKey);
        this.cancelSkipScroll = null;
      };
      window.addEventListener("wheel", this.cancelSkipScroll, { passive: true });
      window.addEventListener("touchstart", this.cancelSkipScroll, { passive: true });
      window.addEventListener("keydown", cancelOnKey);

      this.skipTween = gsap.to(scrollPosition, {
        y: targetY,
        duration: 1.2,
        ease: "power2.inOut",
        onUpdate: () => window.scrollTo({ top: scrollPosition.y, behavior: "instant" }),
        onComplete: () => this.cancelSkipScroll?.(),
      });
    };
    this.elements.skipLink?.addEventListener("click", this.skipHandler);

    this.elements.artworkLayers = this.elements.artworks.map((artwork) => ({
      artwork,
      stones: $$(".project__stone", artwork),
      desk: $(".project__desk", artwork),
      mob: $(".project__mob", artwork),
      light: $(".project__light", artwork),
    }));
    this.imageLoads = new WeakMap();

    // Первый проект загружается из разметки. Следующие начинаем подгружать,
    // когда пользователь приближается к секции.
    if ("IntersectionObserver" in window) {
      this.preloadObserver = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          this.preloadNearby(0);
          this.preloadObserver?.disconnect();
          this.preloadObserver = null;
        }
      }, { rootMargin: "100% 0px" });
      this.preloadObserver.observe(section);
    } else {
      this.preloadNearby(0);
    }

    // AOS и GSAP не должны одновременно писать transform для тайтлов.
    // У проектов их вход/выход полностью контролирует GSAP.
    this.elements.titles.forEach((title) => {
      title.removeAttribute("data-aos");
      title.removeAttribute("data-aos-delay");
      title.classList.remove("aos-init", "aos-animate");
    });

    this.elements.total.textContent = this.formatNumber(items.length);
    this.setProgress(0);

    this.media = gsap.matchMedia();
    this.media.add("(min-width: 768px)", () => this.initDesktop());
    this.media.add("(max-width: 767px)", () => this.initMobile());
  },

  initDesktop() {
    const { section, items, titles, artworks, artworkLayers } = this.elements;
    const stones = artworkLayers.flatMap((layer) => layer.stones);
    const desks = artworkLayers.map((layer) => layer.desk).filter(Boolean);
    const mobs = artworkLayers.map((layer) => layer.mob).filter(Boolean);
    const lights = artworkLayers.map((layer) => layer.light).filter(Boolean);
    const transitionDuration = 3.35;
    const hoverWindow = transitionDuration * 0.25;
    const sceneReadyTimes = [0];
    const getArtworkScale = () => window.innerWidth <= 1200 ? 0.65 : 1;
    let activeIndex = -1;
    let visibleIndex = -1;
    let preloadedTargetIndex = -1;

    gsap.set(items, { autoAlpha: 1 });
    gsap.set(titles, { yPercent: 185, autoAlpha: 0 });

    // .project центрируется в CSS через translateY(-50%). Сохраняем эту базу,
    // а анимируем уже отдельные слои внутри каждой сцены.
    gsap.set(artworks, { yPercent: -50, autoAlpha: 1, scale: getArtworkScale() });
    gsap.set(stones, {
      yPercent: (stoneIndex) => 70 + ((stoneIndex * 29) % 90),
      autoAlpha: 0,
      scale: 0.88,
    });
    gsap.set(desks, { yPercent: 26, autoAlpha: 0, scale: 0.96 });
    gsap.set(mobs, { yPercent: 38, autoAlpha: 0, scale: 0.94 });
    gsap.set(lights, { autoAlpha: 0, scale: 0.82 });

    gsap.set(titles[0], { yPercent: 0, autoAlpha: 1 });
    gsap.set(artworkLayers[0].stones, { yPercent: 0, autoAlpha: 1, scale: 1 });
    gsap.set(artworkLayers[0].desk, { yPercent: 0, autoAlpha: 1, scale: 1 });
    gsap.set(artworkLayers[0].mob, { yPercent: 0, autoAlpha: 1, scale: 1 });
    gsap.set(artworkLayers[0].light, { autoAlpha: 1, scale: 1 });
    this.setProgress(0);

    const timeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        id: "projects-scroll",
        trigger: section,
        start: "top top",
        end: () => `+=${window.innerHeight * (items.length - 1) * 1.2}`,
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (trigger) => {
          const index = Math.min(
            items.length - 1,
            Math.floor(trigger.progress * (items.length - 1) + 0.000001),
          );
          this.setProgress(index);
          if ((trigger.isActive || trigger.progress > 0) && index !== preloadedTargetIndex) {
            this.preloadNearby(index);
            preloadedTargetIndex = index;
          }
        },
        onRefresh: () => {
          gsap.set(artworks, { scale: getArtworkScale() });
          if (activeIndex >= 0) this.setBurstDirections(artworkLayers[activeIndex]);
        },
      },
    });

    items.slice(0, -1).forEach((_item, index) => {
      const nextIndex = index + 1;
      const currentLayers = artworkLayers[index];
      const nextLayers = artworkLayers[nextIndex];
      const startAt = index * transitionDuration;

      // Переход разбит на четыре фазы без длинной пустой паузы:
      // старые устройства → старый декор → новые устройства → новый декор.
      timeline.to(
        titles[index],
        { yPercent: -185, autoAlpha: 0, duration: 0.9, ease: "power2.in" },
        startAt,
      );

      // Сначала уходит desk/mob. Когда они проходят примерно половину пути,
      // за ними начинают уходить камни — так сцена остаётся плотной и живой.
      timeline.to(
        currentLayers.desk,
        { yPercent: -14, autoAlpha: 0, scale: 0.98, duration: 0.82, ease: "power2.in" },
        startAt,
      );
      timeline.to(
        currentLayers.mob,
        { yPercent: -24, autoAlpha: 0, scale: 0.96, duration: 0.76, ease: "power2.in" },
        startAt + 0.12,
      );
      timeline.to(
        currentLayers.stones,
        {
          yPercent: (stoneIndex) => -70 - ((stoneIndex * 23) % 80),
          autoAlpha: 0,
          scale: (stoneIndex) => 0.86 + (stoneIndex % 3) * 0.035,
          duration: (stoneIndex) => 0.58 + (stoneIndex % 4) * 0.12,
          ease: "power2.in",
          stagger: { each: 0.035, from: "end" },
        },
        startAt + 0.48,
      );
      timeline.to(
        currentLayers.light,
        { autoAlpha: 0, scale: 0.86, duration: 0.65, ease: "power1.in" },
        startAt + 0.62,
      );

      // Новые устройства начинают вход ещё до полного ухода камней, а на середине
      // их пути подключаются новые декорации и доходят до позиции к концу шага.
      timeline.to(
        nextLayers.desk,
        { yPercent: 0, autoAlpha: 1, scale: 1, duration: 0.82, ease: "power2.out" },
        startAt + 1.35,
      );
      timeline.to(
        nextLayers.mob,
        { yPercent: 0, autoAlpha: 1, scale: 1, duration: 0.72, ease: "power2.out" },
        startAt + 1.55,
      );
      timeline.to(
        titles[nextIndex],
        { yPercent: 0, autoAlpha: 1, duration: 1.15, ease: "power2.out" },
        startAt + 1.46,
      );
      timeline.to(
        nextLayers.stones,
        {
          yPercent: 0,
          autoAlpha: 1,
          scale: 1,
          duration: (stoneIndex) => 0.72 + (stoneIndex % 4) * 0.11,
          ease: "power2.out",
          stagger: { each: 0.045, from: "start" },
        },
        startAt + 1.86,
      );
      timeline.to(
        nextLayers.light,
        { autoAlpha: 1, scale: 1, duration: 0.95, ease: "power1.out" },
        startAt + 2.02,
      );
      sceneReadyTimes.push(timeline.duration());
    });

    // Проверяем положение самой анимации: scrub продолжает её даже после остановки скролла.
    const syncActiveItem = () => {
      const time = timeline.time();
      const sceneIndex = Math.min(items.length - 1, Math.floor(time / transitionDuration));
      if (sceneIndex !== visibleIndex) {
        items.forEach((item, index) => {
          item.style.visibility = index === sceneIndex || index === sceneIndex + 1
            ? "visible"
            : "hidden";
        });
        visibleIndex = sceneIndex;
        if (timeline.scrollTrigger?.isActive) this.preloadNearby(sceneIndex);
      }
      const readyIndex = sceneReadyTimes.findIndex(
        (readyAt, index) =>
          time >= readyAt - hoverWindow && time <= index * transitionDuration,
      );
      if (readyIndex === activeIndex) return;

      items[activeIndex]?.classList.remove("is-active");
      activeIndex = readyIndex;
      if (activeIndex >= 0) {
        this.setBurstDirections(artworkLayers[activeIndex]);
        items[activeIndex].classList.add("is-active");
      }
    };
    timeline.eventCallback("onUpdate", syncActiveItem);
    syncActiveItem();
    this.timeline = timeline;

    return () => {
      if (this.timeline === timeline) this.timeline = null;
      timeline.scrollTrigger?.kill();
      timeline.kill();
      items[activeIndex]?.classList.remove("is-active");
      stones.forEach((stone) => {
        stone.style.removeProperty("--project-burst-x");
        stone.style.removeProperty("--project-burst-y");
      });
      gsap.set([...items, ...titles, ...artworks, ...stones, ...desks, ...mobs, ...lights], {
        clearProps: "transform,opacity,visibility",
      });
    };
  },

  initMobile() {
    const { section, items, titles, artworks, previousButton, nextButton } = this.elements;
    this.mobileIndex = 0;

    gsap.set(items, { autoAlpha: 0 });
    gsap.set(titles, { autoAlpha: 0 });
    gsap.set(artworks, { yPercent: -50, autoAlpha: 0, scale: 0.96 });
    gsap.set(items[0], { autoAlpha: 1 });
    gsap.set(titles[0], { autoAlpha: 1 });
    items[0].classList.add("is-active");
    this.setProgress(0);

    // При открытии страницы на этом блоке показываем композицию целиком,
    // только когда изображения первого проекта уже загрузились.
    let mobileActive = true;
    this.loadProject(0).then(() => {
      if (!mobileActive || this.mobileIndex !== 0 || this.mobileTween || this.mobileLoading) return;

      this.mobileIntro = gsap.fromTo(
        artworks[0],
        { yPercent: -50, autoAlpha: 0, scale: 0.96 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 85%", once: true },
        },
      );
    });

    // После установки мобильной раскладки AOS должен заново измерить позиции.
    const aosRefresh = requestAnimationFrame(() => {
      if (typeof AOS !== "undefined") AOS.refresh();
    });

    const onPrevious = () => this.goToMobile(this.mobileIndex - 1);
    const onNext = () => this.goToMobile(this.mobileIndex + 1);
    let touchStart = null;

    const onTouchStart = (event) => {
      if (
        event.touches.length !== 1 ||
        event.target.closest("a, button, input, select, textarea, [contenteditable]")
      ) {
        touchStart = null;
        return;
      }

      const touch = event.touches[0];
      touchStart = { id: touch.identifier, x: touch.clientX, y: touch.clientY };
    };

    const onTouchEnd = (event) => {
      if (!touchStart || event.touches.length) {
        touchStart = null;
        return;
      }

      const touch = Array.from(event.changedTouches).find(
        (item) => item.identifier === touchStart.id,
      );
      if (touch) {
        const deltaX = touch.clientX - touchStart.x;
        const deltaY = touch.clientY - touchStart.y;
        if (Math.abs(deltaX) >= 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
          this.goToMobile(this.mobileIndex + (deltaX < 0 ? 1 : -1));
        }
      }
      touchStart = null;
    };

    const onTouchCancel = () => {
      touchStart = null;
    };

    previousButton?.addEventListener("click", onPrevious);
    nextButton?.addEventListener("click", onNext);
    section.addEventListener("touchstart", onTouchStart, { passive: true });
    section.addEventListener("touchend", onTouchEnd, { passive: true });
    section.addEventListener("touchcancel", onTouchCancel, { passive: true });

    return () => {
      mobileActive = false;
      cancelAnimationFrame(aosRefresh);
      previousButton?.removeEventListener("click", onPrevious);
      nextButton?.removeEventListener("click", onNext);
      section.removeEventListener("touchstart", onTouchStart);
      section.removeEventListener("touchend", onTouchEnd);
      section.removeEventListener("touchcancel", onTouchCancel);
      this.mobileIntro?.scrollTrigger?.kill();
      this.mobileIntro?.kill();
      this.mobileIntro = null;
      this.mobileLoading = null;
      this.mobileTween?.kill();
      this.mobileTween = null;
      items.forEach((item) => item.classList.remove("is-active"));
      gsap.set([...items, ...titles, ...artworks], {
        clearProps: "transform,opacity,visibility",
      });
    };
  },

  goToMobile(nextIndex) {
    const { items } = this.elements;
    const previousIndex = this.mobileIndex;

    if (
      this.mobileTween ||
      this.mobileLoading ||
      nextIndex < 0 ||
      nextIndex >= items.length ||
      nextIndex === previousIndex
    ) {
      return;
    }

    const loading = this.loadProject(nextIndex);
    this.mobileLoading = loading;
    this.preloadNearby(nextIndex);
    loading.then(() => {
      if (this.mobileLoading !== loading || this.elements?.items !== items) return;
      this.mobileLoading = null;
      this.animateMobile(nextIndex, previousIndex);
    });
  },

  animateMobile(nextIndex, previousIndex) {
    const { items, titles, artworks } = this.elements;
    const currentItem = items[previousIndex];
    const nextItem = items[nextIndex];

    if (this.mobileIntro) {
      this.mobileIntro.scrollTrigger?.kill();
      this.mobileIntro.kill();
      this.mobileIntro = null;
      gsap.set(artworks[previousIndex], { autoAlpha: 1, scale: 1 });
    }

    nextItem.classList.add("is-active");
    gsap.set(nextItem, { autoAlpha: 1 });
    gsap.set(titles[nextIndex], { autoAlpha: 0 });
    gsap.set(artworks[nextIndex], {
      yPercent: -50,
      autoAlpha: 0,
      scale: 0.96,
    });

    this.mobileTween = gsap.timeline({
      defaults: { duration: 0.55, ease: "power2.out" },
      onComplete: () => {
        currentItem.classList.remove("is-active");
        gsap.set(currentItem, { autoAlpha: 0 });
        this.mobileTween = null;
      },
    });

    this.mobileTween.to(
      titles[previousIndex],
      { autoAlpha: 0 },
      0,
    );
    this.mobileTween.to(
      artworks[previousIndex],
      { autoAlpha: 0, scale: 0.96 },
      0,
    );
    this.mobileTween.to(titles[nextIndex], { autoAlpha: 1 }, 0.12);
    this.mobileTween.to(
      artworks[nextIndex],
      { autoAlpha: 1, scale: 1 },
      0.12,
    );

    this.mobileIndex = nextIndex;
    this.setProgress(nextIndex);
  },

  loadProject(index) {
    const artwork = this.elements?.artworks[index];
    if (!artwork) return Promise.resolve();

    const images = $$("img", artwork);
    return Promise.all(images.map((image) => {
      const existing = this.imageLoads.get(image);
      if (existing) return existing;

      const source = image.dataset.projectSrc;
      if (!source && image.complete) return Promise.resolve();

      const loading = new Promise((resolve) => {
        const finish = () => {
          image.removeEventListener("load", finish);
          image.removeEventListener("error", finish);
          resolve();
        };
        image.addEventListener("load", finish);
        image.addEventListener("error", finish);
        if (source) {
          image.src = source;
          image.removeAttribute("data-project-src");
        }
        if (image.complete) finish();
      });
      this.imageLoads.set(image, loading);
      return loading;
    }));
  },

  preloadNearby(index) {
    for (let next = index - 1; next <= index + 2; next += 1) {
      this.loadProject(next);
    }
  },

  setBurstDirections({ artwork, stones }) {
    const { offsetWidth: width, offsetHeight: height } = artwork;
    const baseDistance = Math.min(width, height) * 0.035;

    // .project__stones занимает всю сцену, поэтому layout-координаты не зависят от GSAP.
    const directions = stones.map((stone, index) => {
      const x = stone.offsetLeft + stone.offsetWidth / 2 - width / 2;
      const y = stone.offsetTop + stone.offsetHeight / 2 - height / 2;
      const angle = Math.hypot(x, y) < 1
        ? (Math.PI * 2 * index) / stones.length
        : Math.atan2(y, x);
      const distance = baseDistance * (0.78 + (index % 4) * 0.12);
      return [Math.cos(angle) * distance, Math.sin(angle) * distance];
    });

    stones.forEach((stone, index) => {
      const [x, y] = directions[index];
      stone.style.setProperty("--project-burst-x", `${x}px`);
      stone.style.setProperty("--project-burst-y", `${y}px`);
    });
  },

  setProgress(index) {
    if (!this.elements) return;

    const { current, previousButton, nextButton, items } = this.elements;
    current.textContent = this.formatNumber(index + 1);

    if (previousButton) previousButton.disabled = index === 0;
    if (nextButton) nextButton.disabled = index === items.length - 1;
  },

  formatNumber(value) {
    return String(value).padStart(2, "0");
  },

  destroy() {
    this.preloadObserver?.disconnect();
    this.preloadObserver = null;
    this.cancelSkipScroll?.();
    if (this.skipHandler) {
      this.elements?.skipLink?.removeEventListener("click", this.skipHandler);
      this.skipHandler = null;
    }
    this.media?.revert();
    this.media = null;
    this.timeline = null;
    this.mobileTween?.kill();
    this.mobileTween = null;
    this.mobileLoading = null;
    this.imageLoads = null;
    this.elements = null;
  },
};
