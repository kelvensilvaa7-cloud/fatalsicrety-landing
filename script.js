// ============================================
// FATALSICRETY — LANDING SCRIPT
// ============================================

// ⚠️ CONFIGURE AQUI ⚠️
const FORM_ENDPOINT = "https://formspree.io/f/xkjgobdn";
const TOTAL_SPOTS = 20;
const SPOTS_TAKEN = 6;
const DEADLINE = new Date('2026-10-31T23:59:59');

// ============================================
// 1. CONTADOR DE URGÊNCIA (vagas + tempo)
// ============================================
function updateSpots() {
  const left = Math.max(0, TOTAL_SPOTS - SPOTS_TAKEN);
  document.querySelectorAll('#spots-left').forEach(el => {
    el.textContent = left;
  });
}

function updateCountdown() {
  const now = new Date();
  const diff = DEADLINE - now;

  const el = document.getElementById('countdown');
  if (!el) return;

  if (diff <= 0) {
    el.textContent = 'encerrado';
    return;
  }

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);

  el.textContent = `${d}d ${h}h ${m}m ${s}s`;
}

updateSpots();
updateCountdown();
setInterval(updateCountdown, 1000);

// ============================================
// 2. FORMULÁRIO (envio para Formspree)
// ============================================
const form = document.getElementById('founding-form');
const status = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = form.nome.value.trim();
    const handle = form.handle.value.trim();
    const email = form.email.value.trim();
    const whatsapp = form.whatsapp.value.trim();
    const canal = form.canal.value;
    const nicho = form.nicho.value.trim();

    if (!nome || !handle || !email || !whatsapp || !canal || !nicho) {
      status.textContent = 'Por favor, preencha todos os campos obrigatórios.';
      status.className = 'form-status error';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    status.textContent = '';
    status.className = 'form-status';

    try {
      const data = new FormData(form);
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.reset();
        status.textContent = '✅ Candidatura enviada! Entraremos em contato em até 24h.';
        status.className = 'form-status success';
        submitBtn.textContent = 'Enviado ✓';

        if (window.fbq) fbq('track', 'Lead');
        if (window.gtag) gtag('event', 'generate_lead');
      } else {
        throw new Error('Erro no envio');
      }
    } catch (err) {
      status.textContent = '❌ Algo deu errado. Tente de novo ou fale no WhatsApp.';
      status.className = 'form-status error';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar minha candidatura →';
    }
  });
}

// ============================================
// 3. RASTREAMENTO DE CLIQUES
// ============================================
document.querySelectorAll('.whatsapp-float, .btn-primary').forEach(el => {
  el.addEventListener('click', () => {
    if (window.fbq) fbq('track', 'InitiateCheckout');
    if (window.gtag) gtag('event', 'click_cta');
  });
});
