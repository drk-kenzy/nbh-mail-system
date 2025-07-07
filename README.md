# NBH Mail System

Système moderne de gestion de courriers inspiré de lePremier.net, développé avec Next.js, Tailwind CSS et React.


## Fonctionnalités principales

- Navigation responsive (sidebar, bottom nav, header mobile)
- Formulaires courrier arrivé/départ complets
- Gestion des partenaires
- Paramètres utilisateur
- Statistiques, tableaux, filtres, archivage
- Authentification stylisée, feedback visuel, dark mode
- Accessibilité (a11y) et expérience utilisateur soignée
- Optimisations performance (lazy loading, préchargement, etc.)
- **Progressive Web App (PWA) : installable, offline, manifest, service worker**
- Animations de transition de page (Framer Motion)


## Structure du projet

- `components/` : composants réutilisables (Sidebar, BottomNav, Header, MailModal, etc.)
- `pages/` : pages Next.js (dashboard, login, register, etc.)
- `styles/` : styles globaux (Tailwind)
- `public/` : assets statiques


## Démarrage rapide

```bash
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000) pour voir l’application.


## Bonnes pratiques & contribution

- Respecte la structure des composants et la centralisation des données (`navLinks.js`)
- Privilégie l’accessibilité et la performance
- Documente les nouveaux composants (JSDoc ou commentaires)
- Ajoute des tests unitaires pour les composants critiques


## Déploiement

Déploiement recommandé sur [Vercel](https://vercel.com/) ou toute plateforme compatible Next.js.


## Ressources utiles

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
- [Accessibilité web (a11y)](https://www.w3.org/WAI/test-evaluate/)


## Progressive Web App (PWA)

- Le projet est installable sur mobile et desktop (manifest.json, service worker, thème personnalisable).
- Fonctionne hors-ligne sur les pages déjà visitées.
- Pour tester : lancez le projet (`npm run dev`), ouvrez dans Chrome, puis « Ajouter à l’écran d’accueil » ou « Installer l’application ».


## Animations

- Transitions de page fluides grâce à Framer Motion (fade/slide sur chaque navigation).


---

> Projet réalisé pour une expérience utilisateur moderne, accessible et performante.
