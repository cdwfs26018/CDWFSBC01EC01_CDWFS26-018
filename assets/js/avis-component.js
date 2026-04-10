(() => {
    "use strict";

    /* ======================================================
       CONFIG
    ====================================================== */

    const API_URL = "assets/data/avis.json";
    const STORAGE_KEY = "userReviews";
    const PREVIEW_LIMIT = 5;

    const MAX_LENGTHS = {
        prenom: 40,
        nom: 40,
        ville: 60,
        commentaire: 500,
    };

    const PREVIEW_TEXT_LIMIT = 220;

    const truncate = (text, limit) =>
        text.length > limit ? text.slice(0, limit) + "…" : text;

    const qs = (s, scope = document) => scope.querySelector(s);
    const qsa = (s, scope = document) => [...scope.querySelectorAll(s)];

    let activeModal = null;
    let lastFocus = null;

    /* ======================================================
       DATA
    ====================================================== */

    const getLocalReviews = () =>
        JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    const saveReview = (review) => {
        const reviews = getLocalReviews();
        reviews.unshift(review);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    };

    const fetchReviews = async () => {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Erreur avis.json");
        const fileReviews = await res.json();
        return [...getLocalReviews(), ...fileReviews];
    };

    /* ======================================================
       RENDER – SUMMARY & LIST
    ====================================================== */

    const renderSummary = (reviews) => {
        const el = qs("#reviews-summary");
        if (!el || !reviews.length) return;

        const avg =
            reviews.reduce((s, r) => s + r.note, 0) / reviews.length;

        el.innerHTML = `
      <span class="stars" aria-hidden="true">
        ${"★".repeat(Math.round(avg))}
      </span>
      <span class="score">${avg.toFixed(1)} / 5</span>
      <span class="count">(${reviews.length} avis)</span>
    `;
    };

    const renderCards = (reviews, container) => {
        container.innerHTML = reviews
            .map(
                (r) => `
      <article class="review">
        <div class="review-header">
          <strong>${r.prenom} ${r.nom}</strong>
          <span class="review-stars" aria-label="Note ${r.note} sur 5">
            ${"★".repeat(r.note)}
          </span>
        </div>
        <p class="review-text"> ${truncate(r.commentaire, PREVIEW_TEXT_LIMIT)}</p>
        <span class="review-city">${r.ville}</span>
      </article>
    `
            )
            .join("");
    };

    /* ======================================================
       PREVIEW (5 AVIS)
    ====================================================== */

    const renderPreview = async () => {
        const container = qs("#reviews-list");
        if (!container) return;

        try {
            const reviews = await fetchReviews();
            renderSummary(reviews);
            renderCards(reviews.slice(0, PREVIEW_LIMIT), container);
        } catch {
            container.innerHTML =
                "<p>Les avis ne sont pas disponibles pour le moment.</p>";
        }
    };

    /* ======================================================
       MODAL CORE
    ====================================================== */

    const closeModal = () => {
        activeModal?.remove();
        activeModal = null;
        document.body.style.overflow = "";
        lastFocus?.focus();
    };

    const openModal = (html) => {
        lastFocus = document.activeElement;

        const overlay = document.createElement("div");
        overlay.className = "modal-overlay";
        overlay.innerHTML = html;

        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) closeModal();
        });

        overlay.querySelector(".modal-close")
            ?.addEventListener("click", closeModal);

        document.addEventListener("keydown", escHandler);

        document.body.appendChild(overlay);
        document.body.style.overflow = "hidden";
        activeModal = overlay;

        overlay.querySelector("button, input, select, textarea")?.focus();
    };

    const escHandler = (e) => {
        if (e.key === "Escape") {
            document.removeEventListener("keydown", escHandler);
            closeModal();
        }
    };

    /* ======================================================
       MODAL – LISTE DES AVIS
    ====================================================== */

    const openReviewsModal = async () => {
        const reviews = await fetchReviews();

        openModal(`
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="reviews-title">
        <header class="modal-header">
          <h2 id="reviews-title">Avis clients</h2>
          <button class="modal-close" aria-label="Fermer">&times;</button>
        </header>

        <div class="modal-content">
          <ul class="avis-list">
            ${reviews
            .map(
                (r) => `
              <li class="avis-item">
                <strong>${r.prenom} ${r.nom}</strong>
                <span class="stars">${"★".repeat(r.note)}</span>
                <p>${r.commentaire}</p>
                <span class="city">${r.ville}</span>
              </li>
            `
            )
            .join("")}
          </ul>
        </div>

        <footer class="modal-footer">
          <button class="btn-primary js-open-form">
            Ajouter un avis
          </button>
        </footer>
      </div>
    `);

        qs(".js-open-form", activeModal)
            .addEventListener("click", () => {
                closeModal();
                openReviewFormModal();
            });
    };

    /* ======================================================
       MODAL – FORMULAIRE AVIS
    ====================================================== */

    const openReviewFormModal = () => {

        openModal(`
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="form-title">
        <header class="modal-header">
          <h2 id="form-title">Ajouter un avis</h2>
          <button class="modal-close" aria-label="Fermer">&times;</button>
        </header>

        <div class="modal-content">
          <form id="review-form" class="review-form" novalidate>
            <div id="review-message" aria-live="polite"></div>

            <label>Prénom *
              <input id="prenom" maxlength="40" required>
            </label>

            <label>Nom *
              <input id="nom" maxlength="40" required>
            </label>

            <label>Ville *
              <input id="ville" maxlength="60" required>
            </label>

            <label>Note *
              <select id="note" required>
                <option value="">Choisir</option>
                <option value="5">★★★★★</option>
                <option value="4">★★★★☆</option>
                <option value="3">★★★☆☆</option>
                <option value="2">★★☆☆☆</option>
                <option value="1">★☆☆☆☆</option>
              </select>
            </label>

            <label>Avis *
              <textarea id="commentaire"
                        rows="4"
                        maxlength="500"
                        required></textarea>
              <small class="char-counter" aria-hidden="true">
                0 / 500
              </small>
            </label>

            <button class="btn-primary" type="submit">
              Envoyer mon avis
            </button>
          </form>
        </div>
      </div>
    `);

        const textarea = qs("#commentaire", activeModal);
        const counter = qs(".char-counter", activeModal);

        textarea.addEventListener("input", () => {
            counter.textContent = `${textarea.value.length} / 500`;
        });

        qs("#review-form", activeModal)
            .addEventListener("submit", handleSubmit);
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        const fields = ["prenom", "nom", "ville", "note", "commentaire"];
        const data = Object.fromEntries(
            fields.map((f) => [f, qs("#" + f).value.trim()])
        );

        const msg = qs("#review-message");

        if (Object.values(data).some((v) => !v)) {
            msg.innerHTML =
                `<p class="message-error">Tous les champs sont obligatoires.</p>`;
            return;
        }

        if (data.commentaire.length > MAX_LENGTHS.commentaire) {
            msg.innerHTML = `
                <p class="message-error">
                  L’avis est trop long (500 caractères maximum).
                </p>`;
            return;
        }


        saveReview({
            ...data,
            note: Number(data.note),
        });

        msg.innerHTML =
            `<p class="message-success">Merci pour votre avis 🙏</p>`;

        setTimeout(() => {
            closeModal();
            renderPreview();
            openReviewsModal();
        }, 1200);
    };

    /* ======================================================
       EVENTS
    ====================================================== */

    qsa(".js-open-reviews").forEach((btn) =>
        btn.addEventListener("click", openReviewsModal)
    );

    renderPreview();
})();
