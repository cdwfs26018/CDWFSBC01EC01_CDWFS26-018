/* ======================================================
   MAGIC HOME SERVICE - INDEX JS
   Auteur : Magic Home Service
   ====================================================== */

(() => {
    "use strict";

    /* ======================================================
       UTILITAIRES
       ====================================================== */

    const qs = (selector, scope = document) => scope.querySelector(selector);
    const qsa = (selector, scope = document) =>
        [...scope.querySelectorAll(selector)];

    /* ======================================================
       ANNÉE AUTOMATIQUE FOOTER
       ====================================================== */

    const yearEl = qs("#year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    /* ======================================================
       MODAL AVIS (ACCESSIBLE)
       ====================================================== */

    const avisButtons = qsa(".js-open-reviews");
    let modal = null;
    let lastFocusedElement = null;

    const createModal = () => {
        const modalEl = document.createElement("div");
        modalEl.className = "modal-overlay";
        modalEl.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <header class="modal-header">
          <h2 id="modal-title">Avis clients</h2>
          <button class="modal-close" aria-label="Fermer la fenêtre">&times;</button>
        </header>

        <div class="modal-content" id="avis-content">
          <p>Chargement des avis...</p>
        </div>

        <footer class="modal-footer">
          <button class="btn-primary" id="add-review">
            Ajouter un avis
          </button>
        </footer>
      </div>
    `;
        return modalEl;
    };

    const openModal = async () => {
        lastFocusedElement = document.activeElement;

        modal = createModal();
        document.body.appendChild(modal);
        document.body.style.overflow = "hidden";

        qs(".modal-close", modal).focus();

        await loadReviews();
        qs("#add-review", modal)?.addEventListener("click", showAddReviewForm);

        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeModal();
        });

        document.addEventListener("keydown", handleKeydown);
    };

    const closeModal = () => {
        if (!modal) return;

        modal.remove();
        modal = null;
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleKeydown);

        if (lastFocusedElement) lastFocusedElement.focus();
    };

    const handleKeydown = (e) => {
        if (e.key === "Escape") {
            closeModal();
        }
    };

    /* ======================================================
       CHARGEMENT AJAX DES AVIS
       ====================================================== */

    const loadReviews = async () => {
        const container = qs("#avis-content");
        if (!container) return;

        try {
            // Simulation d'API (à remplacer par une vraie source)
            const response = await fetch("assets/data/avis.json");

            if (!response.ok) {
                throw new Error("Erreur lors du chargement");
            }

            const fileReviews = await response.json();
            const userReviews = getStoredReviews();
            const avis = [...userReviews, ...fileReviews];
            renderReviewsSummary(avis);

            if (!avis.length) {
                container.innerHTML = "<p>Aucun avis pour le moment.</p>";
                return;
            }

            container.innerHTML = `
        <ul class="avis-list">
          ${avis
                .map(
                    (item) => `
            <li class="avis-item">
              <strong>${item.nom}</strong>
              <span aria-label="Note ${item.note} sur 5">
                ${"★".repeat(item.note)}
              </span>
              <p>${item.commentaire}</p>
            </li>
          `
                )
                .join("")}
        </ul>
      `;
        } catch (error) {
            container.innerHTML =
                "<p>Impossible de charger les avis pour le moment.</p>";
            console.error(error);
        }
    };

    /* ======================================================
   CALCUL MOYENNE AVIS
   ====================================================== */

    const calculateAverageRating = (reviews) => {
        if (!reviews.length) return null;

        const total = reviews.reduce((sum, review) => sum + review.note, 0);
        return (total / reviews.length).toFixed(1);
    };

    /* ======================================================
       EVENTS
       ====================================================== */

    avisButtons.forEach((btn) => {
        btn.addEventListener("click", openModal);
    });

    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("modal-close")) {
            closeModal();
        }
    });

    /* ======================================================
   AFFICHAGE DES 5 DERNIERS AVIS (HOME)
   ====================================================== */

    const reviewsContainer = document.querySelector("#reviews-list");

    const loadLastReviews = async () => {
        if (!reviewsContainer) return;

        try {
            const response = await fetch("assets/data/avis.json");
            if (!response.ok) throw new Error("Erreur avis");

            const reviews = [...getStoredReviews(), ...(await response.json())];

            renderReviewsSummary(reviews);

            const lastFive = reviews.slice(0, 5);

            reviewsContainer.innerHTML = lastFive
                .map(
                    (review) => `
        <article class="review">
          <div class="review-header">
            <span class="review-name">${review.nom}</span>
            <span class="review-stars" aria-label="Note ${review.note} sur 5">
              ${"★".repeat(review.note)}
            </span>
          </div>
          <p class="review-text">${review.commentaire}</p>
        </article>
      `
                )
                .join("");
        } catch (error) {
            reviewsContainer.innerHTML =
                "<p>Les avis ne sont pas disponibles pour le moment.</p>";
        }
    };

    loadLastReviews();

    /* ======================================================
   AJOUT D'UN AVIS (LOCALSTORAGE)
   ====================================================== */

    const getStoredReviews = () => {
        return JSON.parse(localStorage.getItem("userReviews") || "[]");
    };

    const saveReview = (review) => {
        const reviews = getStoredReviews();
        reviews.unshift(review);
        localStorage.setItem("userReviews", JSON.stringify(reviews));
    };

    const showAddReviewForm = () => {
        const container = qs("#avis-content");
        if (!container) return;

        container.innerHTML = `
  <form id="review-form" class="review-form" novalidate>
    <div id="review-message" class="review-message" aria-live="polite"></div>

    <div class="form-group">
      <label for="review-name">Votre nom</label>
      <input type="text" id="review-name" name="name" required>
    </div>

    <div class="form-group">
      <label for="review-rating">Note</label>
      <select id="review-rating" name="rating" required>
        <option value="">Choisir</option>
        <option value="5">★★★★★ – Excellent</option>
        <option value="4">★★★★☆ – Très bien</option>
        <option value="3">★★★☆☆ – Bien</option>
        <option value="2">★★☆☆☆ – Moyen</option>
        <option value="1">★☆☆☆☆ – Décevant</option>
      </select>
    </div>

    <div class="form-group">
      <label for="review-text">Votre avis</label>
      <textarea id="review-text" name="comment" rows="4" required></textarea>
    </div>

    <button type="submit" class="btn-primary">
      Envoyer mon avis
    </button>
  </form>
`;

        qs("#review-name")?.focus();

        qs("#review-form")?.addEventListener("submit", handleReviewSubmit);
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();

        const name = qs("#review-name").value.trim();
        const rating = qs("#review-rating").value;
        const comment = qs("#review-text").value.trim();
        const messageEl = qs("#review-message");

        if (!name || !rating || !comment) {
            messageEl.innerHTML = `
      <p class="message-error" role="alert">
        Merci de remplir tous les champs avant l’envoi.
      </p>
    `;
            return;
        }

        const newReview = {
            nom: name,
            note: Number(rating),
            commentaire: comment,
        };

        saveReview(newReview);

        messageEl.innerHTML = `
    <p class="message-success" role="status">
      Merci pour votre avis ! Il a bien été enregistré.
    </p>
  `;

        // Retour à la liste après 1.5s
        setTimeout(() => {
            loadReviews();
        }, 1500);
    };

    const renderReviewsSummary = (reviews) => {
        const summaryEl = qs("#reviews-summary");
        if (!summaryEl || !reviews.length) return;

        const average = calculateAverageRating(reviews);
        const stars = "★".repeat(Math.round(average));

        summaryEl.innerHTML = `
    <span class="stars" aria-hidden="true">${stars}</span>
    <span class="score">${average} / 5</span>
    <span class="count">(${reviews.length} avis)</span>
  `;
    };


})();

