# Rendu des pages : CSR vs SSR

- **SSR (Server‑Side Rendering)**
  Le serveur assemble la page HTML avec toutes les données avant de l’envoyer.  
  Chargement initial rapide, très bon pour le **SEO** (les moteurs voient déjà le contenu).

- **CSR (Client‑Side Rendering)**
  Le serveur renvoie une page quasi vide + un script JS.  
  Le **navigateur construit** la page en exécutant le JS.  
  Démarrage un peu plus lent, mais navigation ultra‑fluide (pas de rechargement complet).

> Aujourd’hui on mélange souvent les deux : par ex. Next.js permet de choisir page par page.

---

# Verbes HTTP (la base d’une API RESTful)

| Verbe  | Action                                     |
|--------|--------------------------------------------|
| **GET**    | récupérer une ressource                    |
| **POST**   | envoyer des données pour créer           |
| **PUT**    | remplacer totalement une ressource        |
| **PATCH**  | modifier partiellement une ressource      |
| **DELETE** | supprimer                              |

Ces verbes « donnent du sens » : un API bien conçue les respecte.

---

# DNS et noms de domaine

- Les machines parlent **IP**, les humains tapent des **noms de domaine**.
- **DNS** effectue la traduction (requête aux serveurs racine → .com → Google, …).
- Résultat mis en cache pour accélérer.
- Un domaine s’achète chez un **registrar**, on y configure des enregistrements (A pour site, MX pour mail…).

---

# Monolithe vs micro‑services

- **Monolithe**  
  Tout est dans une seule application : utilisateurs, commandes, paiements…  
  simple à démarrer  
  ifficile à maintenir ; une panne peut tout faire tomber.

- **Micro‑services**  
  Plusieurs services indépendants, chacun gérant un métier précis.  
  Communiquent via API.  
  plus résilient (un service en panne n’atteint pas les autres)  
  omplexité opérationnelle accrue (orchestration, déploiement, observabilité…).

Pour un petit projet, le monolithe reste souvent plus raisonnable.

---

# Git & SemVer

- **Git** enregistre l’historique dans des commits, on travaille en branches, on utilise des PR pour relire avant fusion.
- **SemVer** = MAJOR.MINOR.PATCH
  - **MAJOR** : breaking changes  
  - **MINOR** : nouvelles fonctionnalités sans rupture  
  - **PATCH** : corrections de bugs

npm s’appuie sur ces conventions via les préfixes `^` et `~` dans package.json pour les mises à jour.

---

**En résumé**, ce document regroupe un condensé malin des notions clés du web moderne : rendu, HTTP, DNS, architectures et gestion de versions. Présentation mise à jour directement dans le fichier.