(() => {
    "use strict";

    const STORAGE_KEY = "contactMessages";
    const MAX_MESSAGE_LENGTH = 800;

    const qs = (s, scope = document) => scope.querySelector(s);

    const form = qs("#contact-form");
    if (!form) return;

    const messageBox = qs("#contact-message");

    const isValidEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const getStoredMessages = () =>
        JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    const saveMessage = (data) => {
        const messages = getStoredMessages();
        messages.unshift({
            ...data,
            date: new Date().toISOString(),
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    };

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = qs("#contact-name").value.trim();
        const email = qs("#contact-email").value.trim();
        const message = qs("#contact-message-text").value.trim();

        messageBox.innerHTML = "";

        if (!name || !email || !message) {
            messageBox.innerHTML = `
        <p class="message-error" role="alert">
          Tous les champs sont obligatoires.
        </p>`;
            return;
        }

        if (!isValidEmail(email)) {
            messageBox.innerHTML = `
        <p class="message-error" role="alert">
          L’adresse email n’est pas valide.
        </p>`;
            return;
        }

        if (message.length > MAX_MESSAGE_LENGTH) {
            messageBox.innerHTML = `
        <p class="message-error" role="alert">
          Le message est trop long (800 caractères max).
        </p>`;
            return;
        }

        saveMessage({ name, email, message });

        messageBox.innerHTML = `
      <p class="message-success" role="status">
        Merci 🙌 Votre message a bien été envoyé.
        Nous vous répondrons rapidement.
      </p>`;

        form.reset();
    });
})();
