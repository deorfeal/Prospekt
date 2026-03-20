/**
 * stroke-text.js
 *
 * Usage:
 *   <span data-stroke-text>DEFINE</span>
 *
 * Data attributes (all optional):
 *   data-stroke-text-color="fff"       hex без #, default "fff"
 *   data-stroke-text-glow="true"       включить glow, default false
 *   data-stroke-text-duration="4"      общая длительность, default 4
 *   data-stroke-text-delay="0"         стартовая задержка, default 0
 *
 * Интеграция: вызывай StrokeText.init() рядом с AOS.init()
 */

(function () {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";

  const DEFAULTS = {
    color: "ffffff",
    glow: false,
    duration: 4,
    delay: 0,
  };

  function hexToRgba(hex, alpha) {
    let value = (hex || "").replace("#", "");

    if (value.length === 3) {
      value = value
        .split("")
        .map((char) => char + char)
        .join("");
    }

    const normalized = value || DEFAULTS.color;
    const number = parseInt(normalized, 16);

    return `rgba(${(number >> 16) & 255},${(number >> 8) & 255},${number & 255},${alpha})`;
  }

  function parseOpts(el) {
    const data = el.dataset;
    const aosAncestor = el.closest("[data-aos]");
    const aosDelay = parseFloat(
      data.aosDelay || (aosAncestor && aosAncestor.dataset.aosDelay) || 0,
    );
    const aosOffset = Math.max(0, aosDelay - 250) / 1000;

    return {
      color: data.strokeTextColor || DEFAULTS.color,
      glow: data.strokeTextGlow === "true",
      duration: parseFloat(data.strokeTextDuration) || DEFAULTS.duration,
      delay: aosOffset + (parseFloat(data.strokeTextDelay) || DEFAULTS.delay),
    };
  }

  function createSVGNode(tag) {
    return document.createElementNS(SVG_NS, tag);
  }

  function createTextNode(text, y, fs, ls, sw, stroke) {
    const textNode = createSVGNode("text");

    textNode.textContent = text;
    textNode.setAttribute("x", 0);
    textNode.setAttribute("y", y);
    textNode.setAttribute("font-size", fs);
    textNode.setAttribute("font-family", "'BebasNeue', 'Bebas Neue', sans-serif");
    textNode.setAttribute("font-weight", "400");
    textNode.setAttribute("letter-spacing", ls);
    textNode.setAttribute("fill", "none");
    textNode.setAttribute("stroke", stroke);
    textNode.setAttribute("stroke-width", sw);
    textNode.setAttribute("stroke-linecap", "round");
    textNode.setAttribute("stroke-linejoin", "round");
    textNode.setAttribute("paint-order", "stroke");
    textNode.setAttribute("text-rendering", "geometricPrecision");
    textNode.style.shapeRendering = "geometricPrecision";

    return textNode;
  }

  function getDashLength(node, fs) {
    const bbox = node.getBBox();
    const textLength =
      typeof node.getComputedTextLength === "function"
        ? node.getComputedTextLength()
        : bbox.width;

    return Math.max(
      2600,
      fs * 24,
      textLength * 6,
      (bbox.width + bbox.height) * 6,
    );
  }

  function applyDashState(node, dash) {
    node.style.strokeDasharray = `${dash}`;
    node.style.strokeDashoffset = `${dash}`;
  }

  function buildSVG(el, opts) {
    if (el.dataset.strokeTextBuilt) return;

    const text = el.textContent.replace(/[\r\n\t]/g, "").trim();
    if (!text) return;

    el.dataset.strokeTextBuilt = "1";

    const computed = getComputedStyle(el);
    const fs = parseFloat(computed.fontSize);
    const ls = parseFloat(computed.letterSpacing) || 0;
    const y = Math.round(fs * 0.92);
    const svgH = Math.round(fs * 1.08);

    if (computed.display === "inline" || computed.display === "contents") {
      el.style.display = "inline-block";
    }

    el.style.position = "relative";
    el.style.lineHeight = "1";
    el.style.color = "transparent";
    el.style.webkitTextStroke = "0px transparent";

    const svg = createSVGNode("svg");
    svg.setAttribute("aria-hidden", "true");
    svg.style.cssText =
      "position:absolute;top:0;left:0;overflow:visible;pointer-events:none;visibility:hidden;";

    el.appendChild(svg);

    const probe = createTextNode(text, y, fs, ls, 1, "transparent");
    svg.appendChild(probe);

    const probeBox = probe.getBBox();
    const realW = probeBox.width;

    svg.removeChild(probe);

    svg.setAttribute("viewBox", `0 0 ${realW} ${svgH}`);
    svg.style.width = `${realW}px`;
    svg.style.height = `${svgH}px`;
    svg.style.visibility = "visible";

    const strokeColor = hexToRgba(opts.color, 1);
    const glowColor = hexToRgba(opts.color, 0.22);
    const layers = [];

    if (opts.glow) {
      const glow = createTextNode(
        text,
        y,
        fs,
        ls,
        Math.max(fs * 0.06, 4),
        glowColor,
      );

      glow.style.filter = "blur(3px)";
      svg.appendChild(glow);

      const glowDash = getDashLength(glow, fs);
      applyDashState(glow, glowDash);

      layers.push({
        node: glow,
        dash: glowDash,
        strokeColor: glowColor,
      });
    }

    const sharp = createTextNode(
      text,
      y,
      fs,
      ls,
      Math.max(fs * 0.02, 1.5),
      strokeColor,
    );

    svg.appendChild(sharp);

    const sharpDash = getDashLength(sharp, fs);
    applyDashState(sharp, sharpDash);

    layers.push({
      node: sharp,
      dash: sharpDash,
      strokeColor,
    });

    el._strokeLayers = layers;
    el._strokeDuration = opts.duration;
    el._strokeDelay = opts.delay;
  }

  function animateLayer(layer, duration, delay) {
    const { node, dash, strokeColor } = layer;

    node.animate(
      [
        {
          stroke: "#ffffff",
          strokeDashoffset: dash,
        },
        {
          stroke: "#ffffff",
          strokeDashoffset: dash * 0.5,
          offset: 0.5,
        },
        {
          stroke: strokeColor,
          strokeDashoffset: dash * 0.25,
          offset: 0.7,
        },
        {
          stroke: strokeColor,
          strokeDashoffset: 0,
          offset: 1,
        },
      ],
      {
        duration: duration * 1000,
        delay: delay * 1000,
        easing: "ease-in",
        fill: "forwards",
      },
    );
  }

  function animateWord(el) {
    if (el.dataset.strokeTextAnimated) return;
    el.dataset.strokeTextAnimated = "1";

    const layers = el._strokeLayers || [];
    const duration = el._strokeDuration || DEFAULTS.duration;
    const delay = el._strokeDelay || DEFAULTS.delay;

    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        layers.forEach((layer) => animateLayer(layer, duration, delay));
      }),
    );
  }

  function init() {
    const elements = Array.from(document.querySelectorAll("[data-stroke-text]"));
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target;

          if (!el.dataset.strokeTextBuilt) {
            buildSVG(el, parseOpts(el));
          }

          animateWord(el);
          observer.unobserve(el);
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -30px 0px",
      },
    );

    elements.forEach((el) => observer.observe(el));
  }

  window.StrokeText = { init };
})();
