(() => {
    "use strict";

    const qs = (s, scope = document) => scope.querySelector(s);

    const navToggle = qs(".nav-toggle");
    const navMenu = qs("#nav-menu");
    const navCloseBtn = qs(".nav-close-btn");

    if (!navToggle || !navMenu) return;

    const openMenu = () => {
        navToggle.classList.add("is-open");
        navMenu.classList.add("is-open");

        navToggle.setAttribute("aria-expanded", "true");
        navToggle.setAttribute("aria-label", "Fermer le menu");

        document.body.classList.add("menu-open");
        document.body.style.overflow = "hidden";
    };

    const closeMenu = () => {
        navToggle.classList.remove("is-open");
        navMenu.classList.remove("is-open");

        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Ouvrir le menu");

        document.body.classList.remove("menu-open");
        document.body.style.overflow = "";
    };

    navToggle.addEventListener("click", () => {
        navToggle.classList.contains("is-open") ? closeMenu() : openMenu();
    });

    navMenu.addEventListener("click", (e) => {
        if (e.target.tagName === "A") closeMenu();
    });

    navCloseBtn?.addEventListener("click", closeMenu);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && navToggle.classList.contains("is-open")) {
            closeMenu();
        }
    });

    /* Année footer */
    const yearEl = qs("#year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker
                .register("./service-worker.js")
                .then(() => console.info("✅ Service Worker actif"))
                .catch(err => console.warn("❌ SW erreur", err));
        });
    }
})();
