// =========================================================
// Salón Belleza — interacciones
// =========================================================

// Número de WhatsApp del salón en formato internacional, solo dígitos
// (código de país + área + número). Ej. Argentina: "5491123456789".
const WHATSAPP_NUMBER = "";

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  const nav = document.getElementById("nav");
  const toggle = document.querySelector(".nav-toggle");

  // Año actual en el pie
  document.getElementById("year").textContent = new Date().getFullYear();

  // Sombra del header al scrollear
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Menú mobile
  const setMenu = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  };
  toggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  // Link activo según la sección visible
  const links = [...document.querySelectorAll(".nav__list a")];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((link) =>
            link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`)
          );
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((section) => spy.observe(section));

    // Animación de entrada
    const revealTargets = document.querySelectorAll(
      ".section__head, .service, .about__media, .about__text, .gallery__item, .review, .booking__intro, .form, .contact__info, .contact__map"
    );
    const revealer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );
    revealTargets.forEach((el) => {
      el.classList.add("reveal");
      revealer.observe(el);
    });
  }

  // Formulario de reserva → WhatsApp
  const form = document.getElementById("booking-form");
  const errorBox = document.getElementById("form-error");
  const dateInput = form.elements.fecha;
  const today = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  dateInput.min = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    errorBox.hidden = true;

    const required = ["nombre", "telefono", "servicio", "fecha"];
    const missing = required.filter((name) => !form.elements[name].value.trim());
    required.forEach((name) => form.elements[name].classList.toggle("is-invalid", missing.includes(name)));

    if (missing.length) {
      errorBox.textContent = "Completá los campos marcados para enviar tu pedido.";
      errorBox.hidden = false;
      form.elements[missing[0]].focus();
      return;
    }

    if (!WHATSAPP_NUMBER) {
      errorBox.textContent = "Las reservas online todavía no están configuradas. Escribinos por teléfono o Instagram.";
      errorBox.hidden = false;
      return;
    }

    const data = Object.fromEntries(new FormData(form));
    const [year, month, day] = data.fecha.split("-");
    const lines = [
      "¡Hola! Quiero reservar un turno.",
      `Nombre: ${data.nombre}`,
      `Teléfono: ${data.telefono}`,
      `Servicio: ${data.servicio}`,
      `Fecha preferida: ${day}/${month}/${year} (${data.horario})`,
    ];
    if (data.comentarios.trim()) lines.push(`Comentarios: ${data.comentarios.trim()}`);

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener");
  });
});
