// ORIGIN — hero benchmark graph animation
(function () {
  const stockLine = document.getElementById('stockLine');
  const optLine = document.getElementById('optLine');
  const stockAvgEl = document.getElementById('stockAvg');
  const optAvgEl = document.getElementById('optAvg');

  if (!stockLine || !optLine) return; // not on this page

  const W = 560, H = 200;
  const POINTS = 24;

  // Generate a plausible "stock" fps trace (choppy, low, occasional dips)
  function genStockSeries() {
    let v = 50;
    const arr = [];
    for (let i = 0; i < POINTS; i++) {
      v += (Math.random() - 0.55) * 14;
      v = Math.max(22, Math.min(70, v));
      arr.push(v);
    }
    return arr;
  }

  // Generate the "optimized" trace (higher, smoother, tight band)
  function genOptSeries() {
    let v = 140;
    const arr = [];
    for (let i = 0; i < POINTS; i++) {
      v += (Math.random() - 0.5) * 8;
      v = Math.max(120, Math.min(160, v));
      arr.push(v);
    }
    return arr;
  }

  function toPoints(series) {
    const step = W / (series.length - 1);
    // map fps (0-260 range) to y within padded chart area
    const maxFps = 260;
    const padTop = 12, padBottom = 12;
    return series
      .map((v, i) => {
        const x = i * step;
        const y = padTop + (1 - v / maxFps) * (H - padTop - padBottom);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }

  const stockSeries = genStockSeries();
  const optSeries = genOptSeries();

  const stockAvg = Math.round(stockSeries.reduce((a, b) => a + b, 0) / stockSeries.length);
  const optAvg = Math.round(optSeries.reduce((a, b) => a + b, 0) / optSeries.length);

  if (stockAvgEl) stockAvgEl.textContent = stockAvg;
  if (optAvgEl) optAvgEl.textContent = optAvg;

  // Animate line draw-in using stroke-dasharray trick
  function animateLine(el, points) {
    el.setAttribute('points', points);
    const length = el.getTotalLength ? el.getTotalLength() : 800;
    el.style.strokeDasharray = length;
    el.style.strokeDashoffset = length;
    el.getBoundingClientRect(); // force reflow
    el.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)';
    requestAnimationFrame(() => {
      el.style.strokeDashoffset = '0';
    });
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    stockLine.setAttribute('points', toPoints(stockSeries));
    optLine.setAttribute('points', toPoints(optSeries));
  } else {
    setTimeout(() => animateLine(stockLine, toPoints(stockSeries)), 150);
    setTimeout(() => animateLine(optLine, toPoints(optSeries)), 450);
  }

  // Animate benchmark table numbers counting up when scrolled into view
  const benchRows = document.querySelectorAll('.bench-row[data-stock]');
  if (benchRows.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const row = entry.target;
            const stockTarget = parseInt(row.dataset.stock, 10);
            const optTarget = parseInt(row.dataset.opt, 10);
            const stockEl = row.querySelector('.stock-num');
            const optEl = row.querySelector('.opt-num');
            countUp(stockEl, stockTarget);
            countUp(optEl, optTarget);
            observer.unobserve(row);
          }
        });
      },
      { threshold: 0.4 }
    );
    benchRows.forEach((row) => observer.observe(row));
  }

  function countUp(el, target) {
    if (!el) return;
    if (reduceMotion) {
      el.textContent = target;
      return;
    }
    const duration = 900;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
})();
