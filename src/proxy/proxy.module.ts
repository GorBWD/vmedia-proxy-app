import { Module } from '@nestjs/common';
import { ProxyController } from './proxy.controller';
import { CrawlerModule } from 'src/crawler/crawler.module';

@Module({
    imports: [CrawlerModule],
    controllers: [ProxyController]
})
export class ProxyModule {}
