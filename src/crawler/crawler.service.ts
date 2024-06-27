import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class CrawlerService {  
  async fetchAndModify(url: string): Promise<string> {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    const modifiedContent = await page.evaluate((originalUrl) => {
      // Function to add ™ symbol to every six-letter word
      const modifyText = (text) => {
        return text.split(' ').map(word => {
          return word.length === 6 ? `${word}™` : word;
        }).join(' ');
      };

      // Modify text nodes in the document, excluding images and other elements
      const bodyElement = document.body;
      const textNodes = [];
      const walker = document.createTreeWalker(bodyElement, NodeFilter.SHOW_TEXT, null);
      while (walker.nextNode()) {
        textNodes.push(walker.currentNode);
      }
      textNodes.forEach(textNode => {
        textNode.nodeValue = modifyText(textNode.nodeValue);
      });

      // Modify internal links
      document.querySelectorAll('a[href^="/"]').forEach(anchor => {
        anchor.setAttribute('href', `/proxy${anchor.getAttribute('href')}`);
      });

      // Replace src URLs with original domain for images and other resources
      const elements = document.querySelectorAll('img[src^="/"], script[src^="/"], link[href^="/"]');
      elements.forEach(element => {
        const src = element.getAttribute('src');
        const href = element.getAttribute('href');
        if (src) {
          element.setAttribute('src', new URL(src, originalUrl).href);
        } else if (href) {
          element.setAttribute('href', new URL(href, originalUrl).href);
        }
      });

      return document.documentElement.outerHTML;
    }, url);

    await browser.close();
    return modifiedContent;
  }
}