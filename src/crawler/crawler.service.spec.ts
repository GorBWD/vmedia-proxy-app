import { Test, TestingModule } from '@nestjs/testing';
import { CrawlerService } from '../../src/crawler/crawler.service';
import * as puppeteer from 'puppeteer';

jest.mock('puppeteer');

describe('CrawlerService', () => {
  let service: CrawlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrawlerService],
    }).compile();

    service = module.get<CrawlerService>(CrawlerService);
  });

  it('should fetch and modify content', async () => {
    const mockHtml = '<html><body><p>nestjs proxy server</p><a href="/websockets/gateways">link</a></body></html>';
    const browser = {
      newPage: jest.fn().mockResolvedValue({
        goto: jest.fn(),
        evaluate: jest.fn().mockResolvedValue('<html><body><p>nestjs™ proxy server</p><a href="/proxy/websockets/gateways">link</a></body></html>'),
        close: jest.fn(),
      }),
      close: jest.fn(),
    };

    (puppeteer.launch as jest.Mock).mockResolvedValue(browser);

    const result = await service.fetchAndModify('https://docs.nestjs.com');
    expect(result).toContain('nestjs™ proxy server');
    expect(result).toContain('/proxy/websockets/gateways');
  });
});