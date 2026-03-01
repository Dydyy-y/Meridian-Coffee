
Sujet de Projet Final - Application E-Commerce (React + TypeScript)

Contexte general

Dans le cadre du module React & TypeScript, vous devez realiser une application complete d'e-commerce en utilisant :
- React 18+
- TypeScript
- Vite
- React Router
- Context API (ou Zustand/Recoil si vous preferez, mais optionnel)
- Chakra UI
- ESLint + conventions vues en cours
- L'API fournie (Swagger)

Ce projet est individuel

Vous disposez de 3 mois pour livrer une application fonctionnelle, testee, coherente et bien presentee.

Rendus attendus pour le 3 mars 2026

L'API est disponible ici : https://github.com/KennochaJilian/18_06_ecom

Objectifs pedagogiques

Ce projet doit demontrer votre capacite a :
- Creer une architecture front moderne et scalable
- Implementer une navigation complete (React Router)
- Manipuler une API REST (CRUD, auth, JWT, gestion des erreurs)
- Gerer un etat global (user connecte, panier...)
- Concevoir une UI moderne et responsive avec Chakra UI
- Utiliser TypeScript proprement : types, interfaces, modeles, services
- Respecter une architecture claire en modules/composants/services
- Mettre en place une logique d'authentification securisee (JWT)
- Documenter une application web (README + resume pedagogique)

Livrables obligatoires

1. Application complete fonctionnelle
2. Prototype / Maquette sur Figma ou Adobe XD
   - Pages obligatoires : Home, Detail produit, Login, Profil, Panier
   - Design responsive obligatoire
3. Resume pedagogique (1 a 2 pages)
   Vous expliquerez ce que vous avez appris sur :
   - CSR vs SSR
   - Les verbes HTTP
   - DNS et fonctionnement d'un nom de domaine
   - Architecture microservices vs monolithique
   - Semver, git, etc.
4. Code source propre, structure, type, commente
5. README complet
   - Presentation du projet
   - Installation
   - Choix techniques
   - Architecture
   - Difficultes rencontrees

Fonctionnalites obligatoires (Minimum Viable Product)

1. Page d'accueil
   Recuperer les produits via l'endpoint :
   GET /api/products
   
   Chaque produit doit apparaitre sous forme de card (Chakra UI).
   Chaque card doit afficher :
   - Une image du produit
   - Le nom
   - Le prix
   - Un bouton "Voir le detail"
   
   Possibilite de rechercher (query ?search=).

2. Page de detail d'un produit
   Recuperer via :
   GET /api/products/{product_id}
   
   Afficher au minimum :
   - Une image (issue de Images[0].link)
   - Le nom
   - Le prix
   - Description
   - Stock
   - Un bouton "Ajouter au panier"

3. Authentification (login/signup)
   Inscription
   Via POST /api/users/signup
   
   Connexion
   Via POST /api/users/signin
   
   Le token JWT doit etre stocke dans :
   - localStorage (le plus simple), ou
   - un cookie HTTPOnly si vous souhaitez aller plus loin
   
   Une fois logue, l'utilisateur doit etre redirige vers la page d'accueil.

4. Page Profil
   Recuperer via :
   GET /api/users/{user_id} (token obligatoire)
   
   La page doit permettre :
   - D'afficher les infos : nom, email
   - De modifier les infos (PUT /users/{id})
   - Bonus : gerer adresses / telephone / moyens de paiement

5. Panier + passage de commande
   Le panier est gere cote API :
   - Recuperation :
     GET /api/carts/user/{user_id}
   - Ajouter un produit :
     POST /api/carts/{cart_id}/products/{product_id}
   - Supprimer un produit :
     DELETE /api/carts/{cart_id}/products/{product_id}
   
   Vous devez :
   - Afficher la liste des produits du panier
   - Afficher le total
   - Permettre de supprimer un article
   - Permettre de finaliser la commande (meme si l'API ne propose pas un vrai paiement, un ecran de confirmation suffit)

Fonctionnalites Bonus (pour aller chercher une meilleure note)

- Filtre par categorie (/api/categories)
- Page Admin (si role admin)
- Gestion des adresses + paiement via endpoints disponibles
- Pagination / infinite scroll
- Animations Chakra UI
- Dark mode
- Gestion du stock dynamique
- Tests unitaires (Vitest)
- Deploiement (Vercel / Netlify)

Architecture recommandee

src/
 |-- components/
 |-- pages/
 |-- hooks/
 |-- context/
 |-- services/ (appels API types)
 |-- types/ (interfaces TS)
 |-- utils/
 |-- router/
 |-- App.tsx

Services API par exemple :
services/
 |-- api.ts
 |-- auth.service.ts
 |-- product.service.ts
 |-- cart.service.ts

Evaluation

Critere                                          Coefficient
Fonctionnalites obligatoires                     40
Qualite du code (TS, structure, reutilisabilite) 20
UI/UX + maquette                                 5
Bonne utilisation API REST                       10
Auth & routing                                   5
Panier & gestion etat global                     5
Resume pedagogique                               10
README                                           5
