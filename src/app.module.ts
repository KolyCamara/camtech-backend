import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ArticlesModule } from "./articles/articles.module";
import { ContactModule } from "./contact/contact.module";
import { DatabaseModule } from "./database/database.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
    ThrottlerModule.forRoot({
      ttl: Number(process.env.RATE_LIMIT_TTL || 60),
      limit: Number(process.env.RATE_LIMIT_REQUESTS || 10),
    }),
    DatabaseModule,
    ArticlesModule,
    ContactModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}