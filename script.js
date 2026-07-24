// ============================================================
// Terminal boot sequence
// ============================================================
const bootLines = [
  { text: '$ ./check-services.sh', delay: 0 },
  { text: 'devops    ......... <span class="ok">ONLINE</span>', delay: 550 },
  { text: 'networking ........ <span class="ok">ONLINE</span>', delay: 1000 },
  { text: 'web       ......... <span class="ok">ONLINE</span>', delay: 1450 },
  { text: '<span class="muted">3/3 services healthy — ready for work</span>', delay: 2000 },
];

function typeLine(el, html, speed = 14) {
  return new Promise((resolve) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const plain = tmp.textContent;
    let i = 0;
    const line = document.createElement('div');
    el.appendChild(line);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      line.innerHTML = html;
      resolve();
      return;
    }

    const timer = setInterval(() => {
      i++;
      line.textContent = plain.slice(0, i);
      if (i >= plain.length) {
        clearInterval(timer);
        line.innerHTML = html; // swap in real markup (with spans) once fully typed
        resolve();
      }
    }, speed);
  });
}

async function runBoot() {
  const body = document.getElementById('terminalBody');
  if (!body) return;
  for (const l of bootLines) {
    await typeLine(body, l.text);
  }
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  body.appendChild(cursor);
}

document.addEventListener('DOMContentLoaded', () => {
  runBoot();
  setYear();
  setupNav();
  setupForm();
  setupReveal();
});

// ============================================================
// Footer year
// ============================================================
function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

// ============================================================
// Mobile nav
// ============================================================
function setupNav() {
  const burger = document.getElementById('navBurger');
  const links = document.querySelector('.nav-links');
  if (!burger || !links) return;

  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
    links.style.display = open ? 'flex' : '';
  });

  links.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      links.classList.remove('open');
      links.style.display = '';
      burger.setAttribute('aria-expanded', 'false');
    })
  );
}

// ============================================================
// Contact form (demo — replace action with real endpoint)
// ============================================================
function setupForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    if (!data.name || !data.email || !data.message) {
      status.textContent = 'Please fill in all required fields.';
      return;
    }

    // Placeholder behavior — wire this up to your real backend / form service.
    status.textContent = `Thanks, ${data.name.split(' ')[0]}! I'll reply at ${data.email} soon.`;
    form.reset();
  });
}

// ============================================================
// Scroll reveal for cards
// ============================================================
function setupReveal() {
  const targets = document.querySelectorAll('.service-card, .work-card, .process-step, .stat, .testimonial-card');
  if (!('IntersectionObserver' in window)) return;

  targets.forEach((t) => {
    t.style.opacity = '0';
    t.style.transform = 'translateY(16px)';
    t.style.transition = 'opacity .6s ease, transform .6s ease';
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((t) => io.observe(t));
}
