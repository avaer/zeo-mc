const path = require('path');

const websiteScraper = require('website-scraper');

class SiteImporter {
  constructor(opts) {
    this.dataDirectory = opts.dataDirectory;
  }

  import(opts, cb) {
    const url = opts.url;
    const name = opts.name;

    websiteScraper.scrape({
      urls: [url],
      directory: path.join(this.dataDirectory, name),
      subdirectories: [
        {directory: 'img', extensions: ['.jpg', '.png', '.svg']},
        {directory: 'js', extensions: ['.js']},
        {directory: 'css', extensions: ['.css']}
      ],
      sources: [
        {selector: 'img', attr: 'src'},
        {selector: 'link[rel="stylesheet"]', attr: 'href'},
        {selector: 'script', attr: 'src'}
      ],
      request: {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 4.2.1; en-us; Nexus 4 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19'
        }
      },
      noscript: true
    });
  }
}

module.exports = SiteImporter;
