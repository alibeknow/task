import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from '@shared/snake-naming.strategy';

const configs: TypeOrmModuleOptions & { seeds: string[]; factories: string[] } =
  {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    namingStrategy: new SnakeNamingStrategy(),
    entities: ['src/**/*.entity{.ts,.js}', 'src/**/*.view-entity{.ts,.js}'],
    migrations: ['src/database/migrations/*{.ts,.js}'],
    seeds: ['src/database/seeds/**/*{.ts,.js}'],
    factories: ['src/database/factories/**/*{.ts,.js}'],
  };

module.exports = configs;
