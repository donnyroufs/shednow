import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      url: "postgresql://postgres:postgres@localhost/shednow-dev",
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
