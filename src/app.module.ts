import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProxyModule } from './proxy/proxy.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    ProxyModule
  ],
  controllers: [AppController]
})
export class AppModule {}
