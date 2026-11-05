/**
 * Ventanas Bañuls - Interactive Frontend Logic
 * Features: Before/After Slider, Energy Savings Calculator, WhatsApp Prefill & Cross-Lead
 * Zero Dependencies | Ultra Fast
 */

document.addEventListener('DOMContentLoaded', () => {
  initBeforeAfterSlider();
  initEnergyCalculator();
  initQuickQuoteForm();
});

/* ==========================================================================
   1. Interactive Before / After Split Slider
   ========================================================================== */
function initBeforeAfterSlider() {
  const container = document.querySelector('.ba-slider-container');
  if (!container) return;

  const afterImage = container.querySelector('.ba-image-after');
  const handle = container.querySelector('.ba-slider-handle');
  let isDragging = false;

  function updateSlider(xPos) {
    const rect = container.getBoundingClientRect();
    let position = ((xPos - rect.left) / rect.width) * 100;
    if (position < 5) position = 5;
    if (position > 95) position = 95;

    afterImage.style.width = `${position}%`;
    handle.style.left = `${position}%`;
  }

  handle.addEventListener('mousedown', (e) => {
    isDragging = true;
    e.preventDefault();
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSlider(e.clientX);
  });

  handle.addEventListener('touchstart', () => {
    isDragging = true;
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || !e.touches[0]) return;
    updateSlider(e.touches[0].clientX);
  }, { passive: true });

  container.addEventListener('click', (e) => {
    updateSlider(e.clientX);
  });
}

/* ==========================================================================
   2. Energy Savings Simulator (Alcoy Climate Model)
   ========================================================================== */
function initEnergyCalculator() {
  const m2Slider = document.getElementById('calc-m2');
  const m2Value = document.getElementById('calc-m2-val');
  const currentType = document.getElementById('calc-window-type');
  const savingsDisplay = document.getElementById('calc-savings-display');
  const tempDisplay = document.getElementById('calc-temp-display');
  const deductionDisplay = document.getElementById('calc-deduction-display');

  if (!m2Slider || !savingsDisplay) return;

  function calculate() {
    const m2 = parseInt(m2Slider.value, 10);
    const windowFactor = parseFloat(currentType.value);
    
    if (m2Value) m2Value.textContent = `${m2} m²`;

    // Climate model for Alcoy (600m altitude, cold continental winter)
    const estimatedLossEur = m2 * 8.5 * windowFactor;
    const annualSavings = Math.round(estimatedLossEur * 0.52);
    const tempGain = (2.5 * windowFactor).toFixed(1);

    // Tax deduction estimation (40% max deduction in Valencian Community)
    const avgInvestment = Math.round(m2 * 48);
    const estDeduction = Math.round(avgInvestment * 0.40);

    savingsDisplay.textContent = `${annualSavings} €`;
    if (tempDisplay) tempDisplay.textContent = `+${tempGain} °C`;
    if (deductionDisplay) deductionDisplay.textContent = `Hasta ~${estDeduction} €`;
  }

  m2Slider.addEventListener('input', calculate);
  currentType.addEventListener('change', calculate);
  calculate();
}

/* ==========================================================================
   3. Quick Quote Form -> WhatsApp Automation with Cross-Selling
   ========================================================================== */
function initQuickQuoteForm() {
  const form = document.getElementById('quick-quote-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('quote-name')?.value || 'Cliente';
    const servicio = document.getElementById('quote-service')?.value || 'Cambio de ventanas';
    const poblacion = document.getElementById('quote-location')?.value || 'Alcoy';
    const notas = document.getElementById('quote-notes')?.value || '';
    const includeReform = document.getElementById('quote-cross-reform')?.checked;

    let textMsg = `Hola Ventanas Bañuls! Mi nombre es ${nombre}. Estoy interesado en un presupuesto para ${servicio} en ${poblacion}. Detalle: ${notas}`;
    if (includeReform) {
      textMsg += ` (Nota: También estoy interesado en información sobre reformas de baño/cocina con vuestra división Reformas Bañuls).`;
    }

    const waUrl = `https://wa.me/34601281313?text=${encodeURIComponent(textMsg)}`;
    window.open(waUrl, '_blank');
  });
}
