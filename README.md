# Magic Home Service – Site vitrine

Site vitrine moderne pour **Magic Home Service**, artisan peintre décorateur et spécialiste en rénovation intérieure et rénovation énergétique en Eure-et-Loir.

Le projet est développé en **HTML / CSS / JavaScript vanilla**, sans framework, avec une attention particulière portée à :
- l’accessibilité
- le SEO
- les performances
- l’expérience utilisateur (desktop & mobile)

---

## ✨ Fonctionnalités principales

### 🧱 Pages
- **Accueil (`index.html`)**
    - Hero de présentation
    - Services
    - Galerie de réalisations
    - Tarifs
    - Avis clients (aperçu)
    - Formulaire de contact AJAX
- **Prestations (`prestation.html`)**
    - Détail complet des prestations
    - Sections illustrées
    - Avis clients + ajout d’avis

---

### ⭐ Système d’avis clients (component)
- Composant **réutilisable** (`avis-component.js`)
- Chargement des avis depuis :
    - `assets/data/avis.json`
    - `localStorage` (nouveaux avis)
- Fonctionnalités :
    - Affichage des **5 derniers avis**
    - Moyenne des notes
    - Bouton **“Voir tous les avis”**
    - Modal accessible listant tous les avis
    - Modal dédiée pour **ajouter un avis**
- Sécurité & UX :
    - Limitation de longueur des champs
    - Validation des champs obligatoires
    - Messages d’erreur et de succès accessibles (`aria-live`)
    - Texte d’avis tronqué dans l’aperçu pour éviter les abus

---

### 📩 Formulaire de contact (component)
- Envoi **sans rechargement de page**
- Validation du format email
- Messages de succès / erreur accessibles
- Données stockées temporairement en `localStorage`
- Design éditorial (sans carte / sans modal)

---

### 📱 Navigation & responsive
- Menu burger accessible (mobile / tablette)
- Gestion correcte de `aria-expanded`
- Fermeture :
    - clic
    - lien
    - touche `ESC`
- Navigation cohérente entre pages (ancres index)

---

### 🚀 SEO & bonnes pratiques
- Balises sémantiques HTML5
- Titres hiérarchisés (`h1` → `h3`)
- Meta descriptions
- Attributs `alt` pour les images
- Chargement différé des images (`loading="lazy"`)
- Lighthouse friendly

---

### 📦 PWA (Progressive Web App)
- `manifest.webmanifest`
- Couleur de thème
- Service Worker (cache basique)
- Installable sur mobile

---

## 🛠️ Technologies utilisées

- HTML5
- CSS3 (Grid, Flexbox, variables CSS)
- JavaScript ES6+ (vanilla)
- LocalStorage
- Fetch API
- Lighthouse (audit)

Aucun framework, aucune dépendance externe.

---

## Condition d'utilisation

A lancer dans un serveur web pour l'utilisation des forms

---

## 📁 Structure du projet

```txt
/
├── index.html
├── prestation.html
├── manifest.webmanifest
├── service-worker.js
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── index.js
│   │   ├── avis-component.js
│   │   └── contact-component.js
│   ├── data/
│   │   └── avis.json
│   └── img/
│       └── *.avif
