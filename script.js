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

// =========================================================
// Asistente: responde preguntas frecuentes por palabras clave.
// Editá las respuestas acá; no usa inteligencia artificial ni servidor.
// =========================================================
const FAQ = [
  {
    keys: ["servicio", "hacen", "ofrecen", "tratamiento", "corte", "color", "mecha", "balayage", "pestana", "ceja"],
    answer:
      "Hacemos corte y peinado, color, mechas y balayage, pestañas, cejas y tratamientos capilares.\nPodés ver cada uno en <a href=\"#servicios\">Servicios</a>.",
  },
  {
    keys: ["precio", "cuesta", "cuanto", "valor", "sale", "tarifa"],
    answer:
      "Los precios dependen del largo y el estado del cabello. Tenés los precios de referencia en <a href=\"#servicios\">Servicios</a>, y te pasamos un presupuesto exacto al reservar.",
  },
  {
    keys: ["horario", "abren", "abierto", "cierran", "domingo", "sabado", "hora", "dias"],
    answer: "Lunes a viernes de 9:00 a 19:00, sábados de 9:00 a 14:00. Los domingos está cerrado.",
  },
  {
    keys: ["reserv", "turno", "cita", "agendar", "agenda"],
    answer:
      "Podés pedir tu turno desde el <a href=\"#reservar\">formulario de reserva</a>: se abre WhatsApp con tu pedido listo y te confirmamos la disponibilidad.",
  },
  {
    keys: ["donde", "direccion", "ubicacion", "llegar", "queda", "mapa"],
    answer: "Estamos en [Calle y número], [Ciudad]. Tenés el mapa en <a href=\"#contacto\">Contacto</a>.",
  },
  {
    keys: ["cancel", "reprogram", "cambiar turno"],
    answer: "Si necesitás cancelar o cambiar tu turno, avisanos con 24 h de anticipación, por favor.",
  },
  {
    keys: ["pago", "pagar", "tarjeta", "efectivo", "transferencia", "mercado"],
    answer: "Aceptamos efectivo, transferencia y tarjetas.",
  },
  {
    keys: ["telefono", "contacto", "llamar", "whatsapp", "mail", "email", "instagram"],
    answer: "Podés escribirnos por WhatsApp o Instagram, o llamarnos al [Tu teléfono]. Tenés todos los datos en <a href=\"#contacto\">Contacto</a>.",
  },
  {
    keys: ["hola", "buenas", "buen dia", "buenas tardes"],
    answer: "¡Hola! ¿En qué te puedo ayudar? Preguntame por servicios, horarios, dirección o cómo reservar.",
  },
  {
    keys: ["gracias", "genial", "perfecto"],
    answer: "¡De nada! Si querés, reservá tu turno desde el <a href=\"#reservar\">formulario</a>. 💕",
  },
];

const CHAT_GREETING = "¡Hola! Soy la asistente del salón. Preguntame por servicios, horarios, dirección o cómo reservar.";
const CHAT_FALLBACK =
  "No tengo una respuesta para eso. Escribinos por WhatsApp o desde el <a href=\"#reservar\">formulario</a> y te respondemos personalmente.";
const CHAT_SUGGESTIONS = ["¿Qué servicios tienen?", "¿Abren los domingos?", "¿Cómo reservo?", "¿Dónde están?"];

document.addEventListener("DOMContentLoaded", () => {
  const chat = document.getElementById("chat");
  const launcher = document.getElementById("chat-launcher");
  const panel = document.getElementById("chat-panel");
  const log = document.getElementById("chat-log");
  const chips = document.getElementById("chat-chips");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");
  let started = false;

  const normalize = (text) =>
    text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9ñ\s]/g, " ");

  const addMessage = (html, from) => {
    const msg = document.createElement("div");
    msg.className = `chat__msg chat__msg--${from}`;
    if (from === "user") msg.textContent = html;
    else msg.innerHTML = html;
    log.appendChild(msg);
    log.scrollTop = log.scrollHeight;
  };

  const findAnswer = (question) => {
    const text = normalize(question);
    let best = null;
    let bestScore = 0;
    FAQ.forEach((item) => {
      const score = item.keys.filter((key) => text.includes(key)).length;
      if (score > bestScore) {
        best = item;
        bestScore = score;
      }
    });
    return best ? best.answer : CHAT_FALLBACK;
  };

  const ask = (question) => {
    if (!question.trim()) return;
    addMessage(question.trim(), "user");
    chips.hidden = true;
    setTimeout(() => addMessage(findAnswer(question), "bot"), 350);
  };

  const setOpen = (open) => {
    chat.classList.toggle("is-open", open);
    panel.hidden = !open;
    launcher.setAttribute("aria-expanded", String(open));
    if (open && !started) {
      started = true;
      addMessage(CHAT_GREETING, "bot");
      CHAT_SUGGESTIONS.forEach((text) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.textContent = text;
        chip.addEventListener("click", () => ask(text));
        chips.appendChild(chip);
      });
    }
    if (open) input.focus();
    else launcher.focus();
  };

  launcher.addEventListener("click", () => setOpen(true));
  document.getElementById("chat-close").addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && chat.classList.contains("is-open")) setOpen(false);
  });

  // Cerrar el panel en mobile al tocar un link interno de una respuesta
  log.addEventListener("click", (e) => {
    if (e.target.closest("a[href^='#']") && window.innerWidth <= 600) setOpen(false);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    ask(input.value);
    input.value = "";
  });
});
