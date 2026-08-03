import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { ArticlesService } from "./articles.service";

@Controller("articles")
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  async findAll() {
    return this.articlesService.findAll();
  }

  @Get(":slug")
  async findOne(@Param("slug") slug: string) {
    const article = await this.articlesService.findOne(slug);
    if (!article) {
      throw new NotFoundException("Article introuvable");
    }
    return article;
  }
}
