import { Inject, Injectable } from "@nestjs/common";
import { Pool } from "pg";

export interface Article {
  slug: string;
  title: string;
  category: string;
  author: string;
  date: string;
  summary: string;
  image: string;
  highlight: string;
  content: string[];
  bullets: string[];
}

const fallbackArticles: Article[] = [
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

@Injectable()
export class ArticlesService {
  constructor(@Inject("PG_POOL") private readonly pool: Pool) {}

  async findAll(): Promise<Article[]> {
    try {
      const query = `SELECT slug, title, category, author, date, summary, image, highlight, content, bullets FROM articles ORDER BY date DESC`;
      const result = await this.pool.query(query);
      return result.rows;
    } catch (error) {
      console.warn(
        "Articles service falling back to local sample data:",
        error,
      );
      return fallbackArticles;
    }
  }

  async findOne(slug: string): Promise<Article | undefined> {
    try {
      const query = `SELECT slug, title, category, author, date, summary, image, highlight, content, bullets FROM articles WHERE slug = $1 LIMIT 1`;
      const result = await this.pool.query(query, [slug]);
      return result.rows[0];
    } catch (error) {
      console.warn("Articles service fallback for single article:", error);
      return fallbackArticles.find((article) => article.slug === slug);
    }
  }
}
