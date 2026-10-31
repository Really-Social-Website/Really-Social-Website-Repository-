/* ============================================
   SETTINGS: change these and every page updates
   ============================================ */
const QUIZ_URL = '#';          // Paste the quiz link here, e.g. 'https://your-quiz-link'
const CONTACT_EMAIL = '';      // Enterprise "Talk to us" email, e.g. 'hello@reallysocial.media'

/* Quiz buttons */
document.querySelectorAll('[data-quiz]').forEach((a) => { a.href = QUIZ_URL; });

/* Enterprise contact buttons */
document.querySelectorAll('[data-contact]').forEach((a) => {
  if (CONTACT_EMAIL) a.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent('Really Social for our group');
});

/* Footer year */
document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

/* Mobile menu */
const nav = document.querySelector('.nav');
const toggle = document.querySelector('.nav-toggle');
if (nav && toggle) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Close' : 'Menu';
  });
}

/* Highlights carousel */
const track = document.querySelector('.track');
if (track) {
  const slides = Array.from(track.querySelectorAll('.slide'));
  const pills = Array.from(document.querySelectorAll('.pill'));
  const prev = document.querySelector('[data-prev]');
  const next = document.querySelector('[data-next]');
  let current = 0;

  const setActive = (i) => {
    current = i;
    pills.forEach((p, n) => p.setAttribute('aria-selected', String(n === i)));
    if (prev) prev.disabled = i === 0;
    if (next) next.disabled = i === slides.length - 1;
  };

  const goTo = (i) => {
    const s = slides[Math.max(0, Math.min(slides.length - 1, i))];
    track.scrollTo({ left: s.offsetLeft - (track.clientWidth - s.clientWidth) / 2 });
  };

  pills.forEach((p, i) => p.addEventListener('click', () => goTo(i)));
  if (prev) prev.addEventListener('click', () => goTo(current - 1));
  if (next) next.addEventListener('click', () => goTo(current + 1));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) setActive(slides.indexOf(e.target)); });
  }, { root: track, threshold: 0.6 });
  slides.forEach((s) => io.observe(s));
  setActive(0);
}
