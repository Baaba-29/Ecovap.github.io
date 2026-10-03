// ===== Ecovap — shared behaviors =====
const WHATSAPP_NUMBER = "221775023232"; // +221 77 502 32 32

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const mobilePanel = document.getElementById('mobilePanel');
if (navToggle && mobilePanel) {
  navToggle.addEventListener('click', () => {
    const isOpen = mobilePanel.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });
  mobilePanel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobilePanel.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));
}

// Mark active nav link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-panel a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-visible'));
}

// Prevent picking a past date on the reservation form
const dateField = document.getElementById('date');
if (dateField) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  dateField.min = `${yyyy}-${mm}-${dd}`;
}

// Reservation form -> formatted WhatsApp message
const reservationForm = document.getElementById('reservationForm');
if (reservationForm) {
  const formSuccess = document.getElementById('formSuccess');
  reservationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(reservationForm);
    const get = (k) => (data.get(k) || '').toString().trim();

    const lines = [
      "Bonjour Ecovap, je souhaite réserver un nettoyage :",
      `Nom : ${get('name')}`,
      `Téléphone : ${get('phone')}`,
      `Service : ${get('service')}`,
      `Quantité : ${get('quantity')}`,
      `Adresse : ${get('address')}, ${get('district')}`,
      `Date souhaitée : ${get('date')} à ${get('time')}`,
    ];
    if (get('comment')) lines.push(`Commentaire : ${get('comment')}`);
    if (get('source')) lines.push(`Connu via : ${get('source')}`);

    const message = encodeURIComponent(lines.join('\n'));
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

    if (formSuccess) formSuccess.classList.add('show');
    window.open(waUrl, '_blank');
  });
}
