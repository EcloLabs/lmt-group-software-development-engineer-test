# Système de Gestion d'Articles

Application complète de gestion d'articles pour magasin, développée avec Next.js 14, TypeScript, Prisma ORM et MySQL.

## Fonctionnalités

### Authentification Sécurisée

- Système de connexion sécurisé sans inscription
- Mots de passe hashés avec bcrypt (12 rounds)
- Sessions JWT sécurisées avec cookies httpOnly
- Protection automatique de toutes les routes privées

### Tableau de Bord

- Nombre total d'articles en stock
- Valeur totale de l'inventaire
- Alertes pour les 5 articles avec le stock le plus faible
- Statistiques en temps réel avec requêtes optimisées

### Gestion des Articles (CRUD)

- **Créer** : Ajouter de nouveaux articles avec validation complète
- **Lire** : Liste paginée avec recherche et tri
- **Modifier** : Mise à jour des informations avec validation
- **Supprimer** : Suppression avec confirmation préalable

### Fonctionnalités Avancées

- Recherche par nom ou SKU
- Tri par date, nom, prix ou stock
- Pagination efficace (10 articles par page)
- Génération automatique de SKU unique
- Validation côté client et serveur
- Notifications toast pour le feedback utilisateur
- Interface responsive et moderne

## Technologies Utilisées

- **Frontend/Backend** : Next.js 14 (App Router) avec TypeScript
- **ORM** : Prisma ORM
- **Base de Données** : MySQL
- **Authentification** : JWT avec jose + bcrypt
- **Style** : Tailwind CSS + shadcn/ui
- **Notifications** : Sonner
- **Icônes** : Lucide React

## Installation

### Prérequis

- Node.js 18+ et npm
- MySQL 8.0+ installé et en cours d'exécution

### Étapes d'Installation

1. **Cloner le projet**

```bash
git clone <votre-repo>
cd <nom-du-projet>
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Configuration de la base de données**

Les variables d'environnement MySQL sont configurées dans le fichier `.env` :

```
DATABASE_URL="mysql://nextjs_user:test_technique@localhost:3306/gestion_articles"
```

**Créer la base de données MySQL :**

```sql
CREATE DATABASE IF NOT EXISTS gestion_articles;
```

**Appliquer les migrations Prisma :**

```bash
npm run prisma:migrate-dev
```

Cela créera les tables nécessaires :

- `users` : Utilisateurs avec authentification
- `articles` : Articles de l'inventaire

4. **Créer un utilisateur initial**

Exécutez le script de seed pour créer l'utilisateur par défaut :

```bash
npm run seed
```

**Identifiants de connexion par défaut :**

- Email : `admin@example.com`
- Mot de passe : `admin123`

**⚠️ IMPORTANT :** Changez ces identifiants en production !

Pour créer un nouvel utilisateur, exécutez cette requête SQL dans MySQL :

```sql
INSERT INTO users (id, email, password, name, created_at)
VALUES (
  UUID(),
  'votre-email@example.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5lW1sFKvJJZrm',
  'Votre Nom',
  NOW()
);
```

Pour créer votre propre mot de passe hashé, utilisez ce code Node.js :

```javascript
const bcrypt = require("bcryptjs");
const password = "votre-mot-de-passe";
const hash = bcrypt.hashSync(password, 12);
console.log(hash);
```

5. **Lancer l'application en développement**

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

6. **Build de production**

```bash
npm run build
npm start
```

## Guide de Démarrage Rapide

### Procédure Complète pour Faire Fonctionner l'Application

Suivez ces étapes dans l'ordre pour démarrer l'application :

#### 1. Vérifier les prérequis

**Vérifier Node.js :**

```bash
node --version  # Doit être 18.0.0 ou supérieur
npm --version
```

**Vérifier MySQL :**

```bash
mysql --version  # Doit être 8.0 ou supérieur
```

**Démarrer le service MySQL (si nécessaire) :**

```bash
# Linux/Mac
sudo service mysql start
# ou
sudo systemctl start mysql

# Windows
net start MySQL80
```

**Tester la connexion MySQL :**

```bash
mysql -u nextjs_user -p
# Entrez le mot de passe : test_technique
```

#### 2. Préparer la base de données

**Se connecter à MySQL :**

```bash
mysql -u nextjs_user -ptest_technique
```

**Créer la base de données :**

```sql
CREATE DATABASE IF NOT EXISTS gestion_articles;
SHOW DATABASES;
EXIT;
```

#### 3. Installer et configurer le projet

**Installer les dépendances :**

```bash
npm install
```

**Vérifier le fichier .env :**

```bash
cat .env
# Doit contenir : DATABASE_URL="mysql://nextjs_user:test_technique@localhost:3306/gestion_articles"
```

**Générer le client Prisma :**

```bash
npx prisma generate
```

**Appliquer les migrations :**

```bash
npx prisma migrate dev
# Cela va créer les tables users et articles
```

**Vérifier que les tables ont été créées :**

```bash
mysql -u nextjs_user -ptest_technique -e "USE gestion_articles; SHOW TABLES;"
```

#### 4. Initialiser les données

**Créer l'utilisateur par défaut :**

```bash
npm run seed
```

**Vérifier que l'utilisateur a été créé :**

```bash
mysql -u nextjs_user -ptest_technique -e "USE gestion_articles; SELECT email, name FROM users;"
```

#### 5. Lancer l'application

**Mode développement :**

```bash
npm run dev
```

**L'application sera accessible sur :**

```
http://localhost:3000
```

#### 6. Se connecter à l'application

1. Ouvrez votre navigateur et allez sur `http://localhost:3000`
2. Vous serez redirigé vers la page de connexion
3. Utilisez les identifiants par défaut :
   - Email : `admin@example.com`
   - Mot de passe : `admin123`
4. Après connexion, vous accéderez au tableau de bord

### Résolution des Problèmes Courants

#### Erreur : "Can't reach database server"

- Vérifiez que MySQL est démarré : `sudo service mysql status`
- Vérifiez les identifiants dans `.env`
- Testez la connexion : `mysql -u nextjs_user -ptest_technique`

#### Erreur : "Database does not exist"

- Créez la base de données : `mysql -u nextjs_user -ptest_technique -e "CREATE DATABASE gestion_articles;"`

#### Erreur : "Prisma Client not initialized"

- Régénérez le client : `npx prisma generate`

#### Erreur : "User not found" lors de la connexion

- Exécutez le script de seed : `npm run seed`
- Vérifiez que l'utilisateur existe : `mysql -u nextjs_user -ptest_technique -e "USE gestion_articles; SELECT * FROM users;"`

#### L'application ne démarre pas

- Vérifiez que le port 3000 est libre : `lsof -i :3000`
- Vérifiez les logs : regardez la console pour les erreurs
- Réinstallez les dépendances : `rm -rf node_modules && npm install`

### Commandes Utiles

```bash
# Visualiser la base de données avec Prisma Studio
npx prisma studio

# Réinitialiser la base de données
npx prisma migrate reset

# Voir l'état des migrations
npx prisma migrate status

# Créer une nouvelle migration
npx prisma migrate dev --name nom_de_la_migration

# Vérifier les types TypeScript
npm run typecheck

# Build de production
npm run build

# Démarrer en production
npm start
```

## Structure du Projet

```
├── app/
│   ├── api/
│   │   ├── auth/          # Routes d'authentification
│   │   │   ├── login/
│   │   │   ├── logout/
│   │   │   └── me/
│   │   ├── articles/      # Routes CRUD articles
│   │   │   └── [id]/
│   │   └── dashboard/     # Route statistiques
│   ├── dashboard/         # Page tableau de bord
│   ├── articles/          # Page gestion articles
│   ├── login/             # Page de connexion
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Page d'accueil (redirect)
├── components/
│   ├── ui/                # Composants shadcn/ui
│   ├── article-form.tsx   # Formulaire article
│   ├── delete-dialog.tsx  # Dialog de confirmation
│   ├── header.tsx         # En-tête de l'app
│   └── navigation.tsx     # Navigation principale
├── lib/
│   ├── auth.ts            # Logique d'authentification
│   ├── prisma.ts          # Client Prisma
│   └── utils.ts           # Utilitaires
├── prisma/
│   └── schema.prisma      # Schéma de base de données
├── middleware.ts          # Protection des routes
└── .env                   # Variables d'environnement
```

## Sécurité

### Authentification

- Mots de passe hashés avec bcrypt (12 rounds)
- Sessions JWT avec expiration de 24h
- Cookies httpOnly et secure en production
- Protection CSRF avec sameSite: lax

### Base de Données

- Protection contre l'injection SQL via Prisma ORM
- Validation des données côté serveur
- Contraintes de base de données (UNIQUE, CHECK)
- Transactions automatiques via Prisma

### Validation

- Validation côté client (formulaires)
- Validation côté serveur (API)
- Contraintes de base de données (CHECK, UNIQUE)
- Messages d'erreur sécurisés (pas de fuite d'informations)

## API Routes

### Authentification

**POST /api/auth/login**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**POST /api/auth/logout**

**GET /api/auth/me**

### Articles

**GET /api/articles**

- Query params: `page`, `limit`, `search`, `sortBy`, `sortOrder`

**POST /api/articles**

```json
{
  "nom": "Article 1",
  "description": "Description",
  "prix": 10.99,
  "quantite_stock": 50,
  "sku": "ART-001" // optionnel, généré automatiquement
}
```

**GET /api/articles/[id]**

**PUT /api/articles/[id]**

**DELETE /api/articles/[id]**

### Dashboard

**GET /api/dashboard/stats**

## Schéma de Base de Données

### Table `users`

| Colonne    | Type        | Description             |
| ---------- | ----------- | ----------------------- |
| id         | uuid        | Identifiant unique (PK) |
| email      | text        | Email unique            |
| password   | text        | Mot de passe hashé      |
| name       | text        | Nom d'affichage         |
| created_at | timestamptz | Date de création        |

### Table `articles`

| Colonne        | Type          | Description                |
| -------------- | ------------- | -------------------------- |
| id             | serial        | Identifiant unique (PK)    |
| nom            | text          | Nom unique de l'article    |
| description    | text          | Description                |
| prix           | numeric(10,2) | Prix (≥ 0)                 |
| quantite_stock | integer       | Quantité en stock (≥ 0)    |
| sku            | text          | SKU unique                 |
| created_at     | timestamptz   | Date de création           |
| updated_at     | timestamptz   | Date de mise à jour (auto) |

### Indexes

- `idx_articles_nom` : Recherche par nom
- `idx_articles_sku` : Recherche par SKU
- `idx_articles_quantite_stock` : Tri par stock
- `idx_articles_created_at` : Tri par date

## Gestion des Erreurs

### Côté Client

- Notifications toast pour toutes les actions
- Messages d'erreur conviviaux
- États de chargement clairs
- Gestion des erreurs réseau

### Côté Serveur

- Try/catch sur toutes les routes API
- Logs d'erreur détaillés (console.error)
- Messages d'erreur sécurisés (pas d'informations sensibles)
- Codes HTTP appropriés (401, 404, 409, 500)

## Performance

### Optimisations Base de Données

- Index sur les colonnes de recherche et tri
- Requêtes optimisées avec Prisma
- Pagination efficace avec `skip()` et `take()`
- Sélection uniquement des colonnes nécessaires avec `select`

### Optimisations Frontend

- Server Components par défaut
- Client Components uniquement pour l'interactivité
- Chargement lazy des composants
- Debouncing sur la recherche (via state)

## Scripts Disponibles

```bash
npm run dev              # Démarrer en mode développement
npm run build            # Build de production
npm start                # Démarrer en production
npm run lint             # Linter le code
npm run typecheck        # Vérifier les types TypeScript
npx prisma generate      # Générer le client Prisma
npx prisma migrate dev   # Appliquer les migrations
npx prisma studio        # Interface graphique Prisma
```

## Critères de Qualité

### ✅ Qualité de Code

- TypeScript strict
- Code modulaire et réutilisable
- Séparation des préoccupations
- Commentaires sur la logique complexe
- Conventions de nommage cohérentes

### ✅ Performance des Requêtes

- Index de base de données
- Pagination efficace
- Requêtes optimisées
- Pas de N+1 queries

### ✅ Gestion des Erreurs

- Validation complète (client + serveur)
- Messages d'erreur clairs
- Logs appropriés
- Récupération gracieuse

## Support et Documentation

Pour toute question ou problème :

1. Vérifiez que toutes les dépendances sont installées
2. Vérifiez la configuration de `.env`
3. Vérifiez que la base de données est accessible
4. Consultez les logs de la console

## Licence

MIT
