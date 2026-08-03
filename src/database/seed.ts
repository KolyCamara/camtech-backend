import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to run seed");
}

const pool = new Pool({
  connectionString,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

async function seed() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS articles (
        slug TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        author TEXT NOT NULL,
        date TEXT NOT NULL,
        summary TEXT NOT NULL,
        image TEXT NOT NULL,
        highlight TEXT NOT NULL,
        content TEXT[] NOT NULL,
        bullets TEXT[] NOT NULL
      );
    `);

    const articles = [
      {
        slug: "site-rapide-performant",
        title: "Comment créer un site rapide et performant ?",
        category: "Technologie",
        author: "Amina",
        date: "12 juillet 2026",
        summary:
          "Découvrez les bonnes pratiques pour réduire le temps de chargement et améliorer l’expérience utilisateur.",
        image:
          "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
        highlight:
          "Performance, UX et qualité de code au service de votre conversion.",
        content: [
          "La vitesse d’un site influence directement la satisfaction des visiteurs, le référencement et la conversion. Un rendu lent donne immédiatement une impression de manque de fiabilité.",
          "Pour obtenir un site rapide, il faut d’abord optimiser les images, réduire les scripts inutiles, limiter les requêtes réseau et privilégier une structure claire et légère.",
          "L’architecture technique doit aussi être pensée pour l’évolutivité. Un site bien construit permet d’ajouter des fonctionnalités sans perdre en qualité ni en vitesse.",
        ],
        bullets: [
          "Optimiser les images et les vidéos",
          "Réduire le poids du code et des dépendances",
          "Mettre en place un système de cache efficace",
        ],
      },
      {
        slug: "design-uiux-conversions",
        title: "Pourquoi le design UI/UX transforme les conversions ?",
        category: "Design",
        author: "Karim",
        date: "8 juillet 2026",
        summary:
          "Un bon design simplifie la navigation et augmente la confiance de vos visiteurs.",
        image:
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
        highlight:
          "Une interface claire transforme un simple visiteur en prospect qualifié.",
        content: [
          "Le design ne sert pas uniquement à rendre un site beau. Il guide le parcours utilisateur, réduit les frictions et aide à prendre des décisions rapidement.",
          "Les interfaces les plus efficaces sont celles qui utilisent une hiérarchie visuelle forte, des boutons explicites et une navigation fluide.",
          "Lorsque le design répond aux attentes, l’utilisateur reste plus longtemps, comprend mieux la proposition et passe plus facilement à l’action.",
        ],
        bullets: [
          "Améliorer la lisibilité des contenus",
          "Simplifier les parcours d’achat ou de contact",
          "Créer une identité visuelle forte et cohérente",
        ],
      },
      {
        slug: "tendances-web-2026",
        title: "Les tendances du web à suivre en 2026",
        category: "Marketing",
        author: "Sarah",
        date: "2 juillet 2026",
        summary:
          "Explorez les orientations les plus prometteuses pour les projets numériques modernes.",
        image:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        highlight:
          "Les meilleures marques combinent expérience, intelligence et personnalisation.",
        content: [
          "En 2026, les sites les plus performants misent sur une expérience personnalisée, un design immersif et une forte intégration des outils d’automatisation.",
          "Le contenu devient plus interactif, tandis que la simplicité de navigation reste un facteur décisif de satisfaction.",
          "Les entreprises qui s’adaptent à ces tendances gagnent en visibilité, en crédibilité et en efficacité commerciale.",
        ],
        bullets: [
          "Personnalisation du parcours utilisateur",
          "Mise en avant du contenu vidéo et interactif",
          "Automatisation intelligente des parcours",
        ],
      },
    ];

    for (const article of articles) {
      await pool.query(
        `INSERT INTO articles(slug, title, category, author, date, summary, image, highlight, content, bullets)
          VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
          ON CONFLICT (slug) DO NOTHING`,
        [
          article.slug,
          article.title,
          article.category,
          article.author,
          article.date,
          article.summary,
          article.image,
          article.highlight,
          article.content,
          article.bullets,
        ],
      );
    }

    console.log("Seed completed successfully.");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
