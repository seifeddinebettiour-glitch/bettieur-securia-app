const screens = document.querySelectorAll(".screen");
const navItems = document.querySelectorAll("[data-nav]");

function showScreen(id) {
  const target = document.getElementById(id) || document.getElementById("home");
  screens.forEach(s => s.classList.remove("active"));
  target.classList.add("active");
  navItems.forEach(n => n.classList.toggle("active", n.dataset.nav === target.id));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function handleRoute() {
  const id = location.hash.replace("#", "") || "home";
  showScreen(id);
}
window.addEventListener("hashchange", handleRoute);
handleRoute();

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", () => {
    const id = link.getAttribute("href").slice(1);
    setTimeout(() => showScreen(id), 0);
  });
});

const form = document.getElementById("quoteForm");
const message = document.getElementById("formMessage");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const button = form.querySelector("button[type=submit]");
  const original = button.innerHTML;
  button.disabled = true;
  button.innerHTML = "Invio in corso…";
  message.className = "form-message";
  message.textContent = "";

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { "Accept": "application/json" }
    });
    if (!response.ok) throw new Error("error");
    message.className = "form-message ok";
    message.textContent = "Richiesta inviata con successo ✓";
    form.reset();
  } catch {
    message.className = "form-message error";
    message.textContent = "Invio non riuscito. Riprova oppure usa WhatsApp.";
  } finally {
    button.disabled = false;
    button.innerHTML = original;
  }
});

let deferredPrompt;
const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.hidden = false;
});

installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.hidden = true;
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
