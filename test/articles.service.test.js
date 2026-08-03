const test = require("node:test");
const assert = require("node:assert/strict");
const { ArticlesService } = require("../dist/articles/articles.service.js");

test("ArticlesService falls back to sample articles when the database is unavailable", async () => {
  const service = new ArticlesService({
    query: async () => {
      throw new Error("database unavailable");
    },
  });

  const articles = await service.findAll();
  assert.ok(Array.isArray(articles), "findAll should return an array");
  assert.ok(articles.length > 0, "findAll should return fallback articles");
  assert.equal(articles[0].slug, "site-rapide-performant");
});
