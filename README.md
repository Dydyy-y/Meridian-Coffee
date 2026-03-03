# Meridian-Coffee — E-commerce de café torréfié

Application e-commerce complète dédiée à la vente de cafés torréfiés, construite avec **React 18 + TypeScript** côté client et **Node.js + Express + Sequelize** côté API.

---

## Table des matières

- [Aperçu du projet](#aperçu-du-projet)
- [Stack technique](#stack-technique)
- [Architecture](#architecture)
- [Prérequis](#prérequis)
- [Installation](#installation)
  - [1. Cloner le frontend](#1-cloner-le-frontend)
  - [2. Cloner l'API](#2-cloner-lapi)
  - [3. Variables d'environnement](#3-variables-denvironnement)
- [Lancement](#lancement)
- [Pages & fonctionnalités](#pages--fonctionnalités)
- [Structure du projet](#structure-du-projet)

---

## Aperçu du projet

Meridian-Coffee est une boutique en ligne permettant aux utilisateurs de :

- Parcourir un catalogue de cafés avec filtres et détails produits
- Gérer un panier d'achats persistant
- S'authentifier et gérer leur profil
- Passer des commandes et recevoir une confirmation
- S'abonner à des offres spéciales

---

## Stack technique

### Frontend

| Technologie | Version | Rôle |
|---|---|---|
| React | ^18.2 | Framework UI |
| TypeScript | ^5.3 | Typage statique |
| Vite | ^5.0 | Bundler & dev server |
| React Router DOM | ^6.21 | Routing SPA |
| Chakra UI | ^2.8 | Bibliothèque de composants |
| Framer Motion | ^10.18 | Animations |

### Backend (API)

| Technologie | Version | Rôle |
|---|---|---|
| Node.js | — | Runtime |
| Express | ^4.18 | Framework HTTP |
| Sequelize | ^6.34 | ORM |
| SQLite3 | ^5.1 | Base de données |
| JSON Web Token | ^9.0 | Authentification |
| bcrypt | ^5.1 | Hash des mots de passe |
| Swagger UI Express | ^5.0 | Documentation API |

---

## Architecture

```
┌─────────────────────────────┐        ┌─────────────────────────────┐
│         Frontend            │        │           API               │
│   React + TypeScript        │◄──────►│   Express + Sequelize       │
│   (port 5173 par défaut)    │  REST  │   (port 8080 par défaut)    │
└─────────────────────────────┘        └─────────────────────────────┘
         │                                         │
         │  Context API                            │  SQLite
         │  ├── AuthContext (JWT / localStorage)   │  (fichier local)
         │  └── CartContext (panier persistant)    │
         │                                         
         │  Services
         │  ├── BaseService<T>   (CRUD générique)
         │  ├── ProductService   
         │  ├── CartService      
         │  ├── AuthService      
         │  └── UserService      
```

---

## Prérequis

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **Git**

---

## Installation

### 1. Cloner le frontend

```bash
git clone https://github.com/Dydyy-y/Meridian-Coffee.git
cd Meridian-Coffee
npm install
```

### 2. Cloner l'API

```bash
git clone https://github.com/Dydyy-y/18_06_ecom.git
cd 18_06_ecom
npm install
```

Initialisez ensuite la base de données SQLite :

```bash
npm run init-db
```

### 3. Variables d'environnement

Dans la racine du dossier **frontend** (`Meridian-Coffee`), créez un fichier `.env` :

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

> Par défaut, si la variable n'est pas définie, l'application pointe automatiquement vers `http://localhost:8080/api`.

---

## Lancement

Lancez les deux serveurs dans deux terminaux distincts :

**Terminal 1 — API :**

```bash
cd 18_06_ecom
npm start
# → serveur démarré sur http://localhost:8080
# → documentation Swagger disponible sur http://localhost:8080/api-docs
```

**Terminal 2 — Frontend :**

```bash
cd Meridian-Coffee
npm run dev
# → application disponible sur http://localhost:5173
```

---

## Pages & fonctionnalités

| Route | Page | Accès |
|---|---|---|
| `/` | Page d'accueil — catalogue produits | Public |
| `/cafes` | Page cafés — liste complète | Public |
| `/product/:id` | Détail d'un produit | Public |
| `/login` | Connexion / Inscription | Public |
| `/abonnement` | Offres d'abonnement | Public |
| `/profile` | Profil utilisateur | Authentifié |
| `/cart` | Panier d'achats | Authentifié |
| `/order-confirmation` | Confirmation de commande | Authentifié |

> Les routes protégées  redirigent automatiquement vers `/login` si l'utilisateur n'est pas connecté.

### Authentification

- Token JWT stocké dans le `localStorage` via un hook personnalisé `useLocalStorage`
- Le token est automatiquement attaché aux requêtes nécessitant une authentification
- Déconnexion supprime le token et les données utilisateur du stockage local

### Panier

- Persistant via `localStorage` entre les sessions
- Synchronisation avec l'API lors de la validation de commande

---

## Structure du projet

```
src/
├── components/
│   ├── ProductCard.tsx          # Carte produit réutilisable
│   ├── ProtectedRoute.tsx       # HOC de protection des routes
│   ├── features/
│   │   └── products/
│   │       └── RelatedProducts.tsx
│   └── shared/layout/
│       ├── Navbar.tsx
│       ├── Footer.tsx
│       └── PageLayout.tsx
├── context/
│   ├── AuthContext.tsx           # Gestion JWT & session utilisateur
│   └── CartContext.tsx           # Gestion du panier
├── hooks/
│   └── useLocalStorage.ts        # Hook de persistance locale
├── pages/                        # Une page par route
├── router/
│   └── index.tsx                 # Déclaration de toutes les routes
├── services/
│   ├── base.service.ts           # Classe abstraite CRUD générique
│   ├── product.service.ts
│   ├── cart.service.ts
│   ├── auth.service.ts
│   └── user.service.ts
└── types/                        # Interfaces TypeScript globales
    ├── auth.types.ts
    ├── cart.types.ts
    └── product.types.ts
```
