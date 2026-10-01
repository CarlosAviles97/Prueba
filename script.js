const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");
const header = document.getElementById("header");
const toTop = document.getElementById("toTop");
const navLinks = [...document.querySelectorAll(".nav__link")];
const sections = [...document.querySelectorAll("main section[id]")];

function closeNav() {
  nav.classList.remove("is-open");
  navToggle.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
}

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  navToggle.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => link.addEventListener("click", closeNav));

window.addEventListener("resize", () => {
  if (window.innerWidth > 1024) closeNav();
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const isLarge = target > 999;
  const duration = 1400;
  const start = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(eased * target);
    el.textContent = isLarge ? value.toLocaleString("es-EC") : String(value);
    if (progress < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll(".stat__num").forEach((num) => counterObserver.observe(num));

const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
      });
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);

sections.forEach((section) => spy.observe(section));

function onScroll() {
  header.classList.toggle("is-scrolled", window.scrollY > 8);
  toTop.classList.toggle("is-visible", window.scrollY > 500);
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

document.querySelectorAll(".faq__question").forEach((question) => {
  question.addEventListener("click", () => {
    const item = question.parentElement;
    const answer = item.querySelector(".faq__answer");
    const isOpen = item.classList.contains("is-open");

    document.querySelectorAll(".faq__item.is-open").forEach((open) => {
      open.classList.remove("is-open");
      open.querySelector(".faq__answer").style.maxHeight = null;
      open.querySelector(".faq__question").setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("is-open");
      answer.style.maxHeight = answer.scrollHeight + "px";
      question.setAttribute("aria-expanded", "true");
    }
  });
});

const form = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

function setError(field, message) {
  const wrapper = field.closest(".field");
  wrapper.classList.toggle("is-invalid", Boolean(message));
  wrapper.querySelector(".field__error").textContent = message;
  return !message;
}

function validateField(field) {
  const value = field.value.trim();

  if (field.name === "email") {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    return setError(field, valid ? "" : "Ingrese un correo electronico valido.");
  }

  if (!value) {
    return setError(field, "Este campo es obligatorio.");
  }

  if (value.length < 3) {
    return setError(field, "Ingrese al menos 3 caracteres.");
  }

  return setError(field, "");
}

const formFields = [...form.querySelectorAll("input, textarea")];

formFields.forEach((field) => {
  field.addEventListener("blur", () => validateField(field));
  field.addEventListener("input", () => {
    if (field.closest(".field").classList.contains("is-invalid")) validateField(field);
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const results = formFields.map(validateField);
  const firstInvalid = formFields[results.indexOf(false)];

  if (firstInvalid) {
    formStatus.textContent = "Revise los campos marcados en rojo.";
    firstInvalid.focus();
    return;
  }

  formStatus.textContent = "Mensaje validado correctamente (demostracion, no se envio).";
  form.reset();
});