import { ConfigService } from '@nestjs/config';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { CrawlerService } from '../crawler/crawler.service';

@Controller('proxy')
export class ProxyController {
  private readonly proxyUrl: URL;

  constructor(
    private configService: ConfigService,
    private readonly crawlerService: CrawlerService
  ) {
    this.proxyUrl = new URL(this.configService.get<string>('PROXY_URL', 'https://docs.nestjs.com'));
  }

  @Get('*')
  async proxy(@Param() params): Promise<string> {
    const url = new URL(this.proxyUrl);
    url.pathname = params[0] || '';
    
    return this.crawlerService.fetchAndModify(url.toString());
  }
}