
# NBH Mail System

Système moderne et complet de gestion de courriers développé avec **Next.js**, **Tailwind CSS** et **React**. Une solution inspirée de lePremier.net offrant une interface intuitive et des fonctionnalités avancées pour la gestion des courriers entrants et sortants.

## ✨ Fonctionnalités principales

### 📧 Gestion des courriers
- **Courriers arrivés** : Enregistrement, suivi et traitement des courriers entrants
- **Courriers départs** : Création et suivi des courriers sortants
- **Brouillons** : Sauvegarde et modification des courriers en cours de rédaction
- **Archives** : Archivage automatique et recherche dans l'historique

### 🎯 Interface utilisateur
- **Design responsive** : Adaptation parfaite mobile, tablette et desktop
- **Navigation intuitive** : Sidebar desktop, bottom nav mobile, header adaptatif
- **Dark mode** optimisé pour une utilisation prolongée
- **Animations fluides** avec Framer Motion pour les transitions de page
- **Accessibilité (a11y)** : Navigation clavier, ARIA labels, contraste optimisé

### 📊 Tableau de bord et statistiques
- **Dashboard interactif** avec statistiques en temps réel
- **Activité récente** : Suivi des dernières actions
- **Tâches en attente** : Gestion des priorités et urgences
- **Métriques avancées** : Temps de traitement, taux de réponse, partenaires actifs

### 🔍 Fonctionnalités avancées
- **Recherche intelligente** : Filtrage par objet, expéditeur, destinataire
- **Tri et pagination** : Organisation flexible des données
- **Gestion des pièces jointes** : Upload et prévisualisation de fichiers
- **Gestion des partenaires** : Carnet d'adresses intégré
- **Paramètres utilisateur** : Personnalisation de l'interface

### 🔐 Sécurité et authentification
- **Système d'authentification** complet (login, register, reset password)
- **Gestion des rôles** : Admin, Employé, RH, Manager
- **Protection des routes** avec guards de sécurité

### 📱 Progressive Web App (PWA)
- **Installation** : Ajout à l'écran d'accueil mobile/desktop
- **Mode hors-ligne** : Fonctionnement sans connexion sur les pages visitées
- **Manifest et Service Worker** configurés
- **Notifications push** (prêt pour l'implémentation)

## 🏗️ Architecture technique

### Structure du projet
```
nbh-mail-system/
├── components/           # Composants React réutilisables
│   ├── Layout.js        # Layout principal avec sidebar/header
│   ├── MailTable.js     # Tableau de courriers avec tri/pagination
│   ├── Dashboard.jsx    # Tableau de bord avec statistiques
│   ├── CourrierForm.jsx # Formulaires courriers arrive/depart
│   └── ...
├── pages/               # Pages Next.js
│   ├── dashboard/       # Pages du tableau de bord
│   ├── api/            # API routes Next.js
│   └── ...
├── hooks/              # Hooks React personnalisés
│   ├── useMailList.js  # Gestion des données courriers
│   └── useTranslation.js # Internationalisation
├── locales/            # Fichiers de traduction (FR/EN)
├── styles/             # Styles globaux Tailwind CSS
└── public/             # Assets statiques et PWA
```

### Technologies utilisées
- **Framework** : Next.js 14 (React 18)
- **Styling** : Tailwind CSS avec configuration personnalisée
- **Animations** : Framer Motion
- **Icons** : React Icons (Feather Icons)
- **Storage** : LocalStorage (prêt pour API backend)
- **Tests** : Jest avec testing-library
- **PWA** : Service Worker et Manifest

## 🚀 Installation et développement

### Prérequis
- Node.js 18+
- npm ou yarn

### Démarrage rapide
```bash
# Installation des dépendances
npm install

# Lancement en mode développement
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

### Scripts disponibles
```bash
npm run dev      # Démarrage en mode développement
npm run build    # Build de production
npm run start    # Démarrage du serveur de production
npm run lint     # Vérification ESLint
npm run test     # Lancement des tests Jest
```

## 🌐 Fonctionnalités multilingues

Le système supporte actuellement :
- **Français** (par défaut)
- **Anglais**

Configuration via les fichiers dans `/locales/` avec hook `useTranslation`.

## 📊 Fonctionnalités du tableau de courriers

- **Expansion d'objet** : Affichage tronqué avec bouton [...] pour voir le texte complet
- **Tri dynamique** : Par date, expéditeur, destinataire, statut
- **Pagination** : Navigation par pages avec contrôles
- **Recherche en temps réel** : Filtrage instantané
- **Actions rapides** : Voir, modifier, archiver, supprimer
- **Statuts colorés** : Identification visuelle des priorités

## 🎨 Thème et personnalisation

### Couleurs principales
- **Primary** : Bleu (#3B82F6) pour les actions principales
- **Secondary** : Vert (#10B981) pour les statuts positifs
- **Warning** : Jaune (#F59E0B) pour les alertes
- **Danger** : Rouge (#EF4444) pour les actions critiques

### Responsive Design
- **Mobile-first** : Interface optimisée pour mobile
- **Breakpoints** : sm (640px), md (768px), lg (1024px), xl (1280px)
- **Navigation adaptative** : Bottom nav mobile, sidebar desktop

## 🧪 Tests et qualité

### Tests inclus
- Tests de composants avec React Testing Library
- Tests d'accessibilité automatisés
- Validation ESLint avec configuration personnalisée

### Lancement des tests
```bash
npm run test     # Tests unitaires
npm run lint     # Vérification du code
```

## 📱 PWA - Installation

### Sur mobile
1. Ouvrir l'application dans Chrome/Safari
2. Cliquer sur "Ajouter à l'écran d'accueil"
3. L'application s'installe comme une app native

### Sur desktop
1. Ouvrir dans Chrome/Edge
2. Cliquer sur l'icône d'installation dans la barre d'adresse
3. L'application s'installe dans le système

## 🚀 Déploiement

### Déploiement sur Replit
Le projet est optimisé pour Replit avec configuration automatique.

### Variables d'environnement
```env
# Optionnel pour features avancées
NEXT_PUBLIC_API_URL=your_api_url
```

## 🔄 Roadmap

### Prochaines fonctionnalités
- [ ] Intégration API backend
- [ ] Notifications push en temps réel
- [ ] Export PDF des courriers
- [ ] Workflow d'approbation
- [ ] Signature électronique
- [ ] Intégration calendrier
- [ ] Rapports avancés

## 🤝 Contribution

### Standards de développement
- **Code style** : ESLint + Prettier
- **Commits** : Convention Conventional Commits
- **Tests** : Couverture minimum 80%
- **Accessibilité** : Conformité WCAG 2.1 AA

### Structure des composants
```jsx
// Exemple de composant
import { useState } from 'react';
import { FiIcon } from 'react-icons/fi';

export default function Component({ prop1, prop2 }) {
  const [state, setState] = useState();
  
  return (
    <div className="component-class">
      {/* JSX content */}
    </div>
  );
}
```

## 📞 Support

Pour toute question ou problème :
- Créer une issue sur le repository
- Consulter la documentation des composants
- Vérifier les tests existants pour les exemples d'usage

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

> **NBH Mail System** - Une solution complète et moderne pour la gestion de courriers, pensée pour l'efficacité et l'expérience utilisateur.
