/**
 * stroke-text.js
 *
 * Usage:
 *   <span data-stroke-text>DEFINE</span>
 *
 * Data attributes (all optional):
 *   data-stroke-text-color="fff"       hex без #, default "fff"
 *   data-stroke-text-glow="true"       включить glow, default false
 *   data-stroke-text-duration="0.22"   секунд на букву, default 0.22
 *   data-stroke-text-gap="0.06"        пауза между буквами, default 0.06
 *   data-stroke-text-delay="0"         стартовая задержка, default 0
 *
 * Интеграция: вызывай StrokeText.init() рядом с AOS.init()
 */

(function () {
  'use strict';

  const DEFAULTS = {
    color:    'ffffff',
    glow:     false,
    duration: 0.4,
    gap:      0.04,
    delay:    0,
  };

  function hexToRgba(hex, alpha) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const n = parseInt(hex, 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
  }

  function parseOpts(el) {
    const d = el.dataset;
    const aosDuration = 750;
    const aosAncestor = el.closest('[data-aos]');
    const aosDelay    = parseFloat(
      el.dataset.aosDelay || (aosAncestor && aosAncestor.dataset.aosDelay) || 0
    );
    const aosOffset = Math.max(0, aosDelay - 250) / 1000;

    return {
      color:    d.strokeTextColor                 || DEFAULTS.color,
      glow:     d.strokeTextGlow                 === 'true',
      duration: parseFloat(d.strokeTextDuration) || DEFAULTS.duration,
      gap:      parseFloat(d.strokeTextGap)       || DEFAULTS.gap,
      delay:    aosOffset + (parseFloat(d.strokeTextDelay) || DEFAULTS.delay),
    };
  }

  function buildSVG(el, opts) {
    if (el.dataset.strokeTextBuilt) return;
    el.dataset.strokeTextBuilt = '1';

    const text = el.textContent.replace(/[\r\n\t]/g, '').trim();
    const cs   = getComputedStyle(el);

    if (cs.display === 'inline' || cs.display === 'contents') {
      el.style.display = 'inline-block';
    }
    el.style.position   = 'relative';
    el.style.lineHeight = '1';

    const fs = parseFloat(getComputedStyle(el).fontSize);
    const ls = parseFloat(getComputedStyle(el).letterSpacing) || 0;
    const W  = el.offsetWidth;
    const y  = Math.round(fs * 0.92);
    const svgH = Math.round(fs * 1.0);

    el.style.color            = 'transparent';
    el.style.webkitTextStroke = '0px transparent';

    // ── SVG создаём и вставляем для замера ───────────────────────────────
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.cssText = 'position:absolute;top:0;left:0;overflow:visible;pointer-events:none;visibility:hidden;';
    el.appendChild(svg);

    // ── Probe: рендерим весь текст чтобы получить точные x позиции ───────
    const probe = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    probe.textContent = text;
    probe.setAttribute('x', 0);
    probe.setAttribute('y', y);
    probe.setAttribute('font-size', fs);
    probe.setAttribute('font-family', "'Bebas Neue', sans-serif");
    probe.setAttribute('font-weight', '400');
    probe.setAttribute('letter-spacing', ls);
    probe.setAttribute('fill', 'none');
    svg.appendChild(probe);

    const chars     = text.split('');
    const positions = chars.map((_, i) => probe.getStartPositionOfChar(i).x);
    const realW     = probe.getBBox().width;
    svg.removeChild(probe);

    // ── Финальный размер SVG ──────────────────────────────────────────────
    svg.setAttribute('viewBox', `0 0 ${realW} ${svgH}`);
    svg.style.width      = realW + 'px';
    svg.style.height     = svgH + 'px';
    svg.style.visibility = 'visible';

    const strokeColor = hexToRgba(opts.color, 1);
    const glowColor   = hexToRgba(opts.color, 0.22);
    const DASH = 700;
    const letters = [];

    chars.forEach((char, i) => {
      const x     = positions[i];
      const delay = opts.delay + i * (opts.duration + opts.gap);

      if (opts.glow) {
        const glow = makeLetter(char, x, y, fs, ls, Math.max(fs * 0.06, 4), glowColor, DASH);
        glow.style.filter = 'blur(3px)';
        svg.appendChild(glow);
        letters.push({ node: glow, delay });
      }

      const sharp = makeLetter(char, x, y, fs, ls, Math.max(fs * 0.020, 1.5), strokeColor, DASH);
      svg.appendChild(sharp);
      letters.push({ node: sharp, delay });
    });

    el._strokeLetters  = letters;
    el._strokeDuration = opts.duration;
  }

  function makeLetter(char, x, y, fs, ls, sw, stroke, dash) {
    const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t.textContent = char;
    t.setAttribute('x', x);
    t.setAttribute('y', y);
    t.setAttribute('font-size', fs);
    t.setAttribute('font-family', "'Bebas Neue', sans-serif");
    t.setAttribute('font-weight', '400');
    t.setAttribute('letter-spacing', ls);
    t.setAttribute('fill', 'none');
    t.setAttribute('stroke', stroke);
    t.setAttribute('stroke-width', sw);
    t.style.strokeDasharray  = dash;
    t.style.strokeDashoffset = dash;
    return t;
  }

  function animateLetters(el) {
    if (el.dataset.strokeTextAnimated) return;
    el.dataset.strokeTextAnimated = '1';

    const letters  = el._strokeLetters  || [];
    const duration = el._strokeDuration || DEFAULTS.duration;

    requestAnimationFrame(() => requestAnimationFrame(() => {
      letters.forEach(({ node, delay }) => {
        node.style.transition = `stroke-dashoffset ${duration}s ease ${delay}s`;
        node.style.strokeDashoffset = '0';
      });
    }));
  }

  function init() {
    const elements = Array.from(document.querySelectorAll('[data-stroke-text]'));
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        if (!el.dataset.strokeTextBuilt) buildSVG(el, parseOpts(el));
        animateLetters(el);
        observer.unobserve(el);
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px',
    });

    elements.forEach(el => observer.observe(el));
  }

  window.StrokeText = { init };
})();