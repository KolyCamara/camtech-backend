# CamTech Backend

API backend for the CamTech frontend.

## Endpoints

- `GET /articles` - list blog articles
- `GET /articles/:slug` - get a single article by slug
- `POST /contact` - submit a contact message

## Run

```bash
cd backend
npm install
npm run start:dev
```

## Neon PostgreSQL

1. Crée un projet Neon et copie le `DATABASE_URL`.
2. Ajoute-le dans `backend/.env` :

```env
DATABASE_URL=postgresql://username:password@host:port/dbname?sslmode=require
```

3. Crée la table `contacts` dans Neon :

```sql
CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

4. Configure l’envoi d’email avec SendGrid dans `backend/.env` :

```env
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=no-reply@yourdomain.com
EMAIL_TO=contact@yourdomain.com
```

5. Démarre le backend :

```bash
cd backend
npm run start:dev
```

6. Pour le déploiement de production :

```bash
npm run build
npm run start:prod
```

Le backend se connectera automatiquement à Neon via `DATABASE_URL`.

## Initialisation de la base

Pour créer les tables et insérer des articles de démonstration :

```bash
cd backend
npm run seed
```

Cela crée les tables `contacts` et `articles` si elles n'existent pas, puis charge les articles de démonstration.
