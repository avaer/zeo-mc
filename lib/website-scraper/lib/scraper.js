var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs-extra'));
var path = require('path');
var _ = require('underscore');

var defaults = require('./config/defaults');
var types = require('./config/resource-types');
var utils = require('./utils.js');
var request = require('./request');
var Resource = require('./resource');
var loadHtml = require('./file-handlers/html');
var loadCss = require('./file-handlers/css');
var compareUrls = require('compare-urls');

function getHandleFunction (resource) {
	var type = resource.getType();
	switch (type) {
		case types.css: return loadCss;
		case types.html: return function loadHtmlAndCss (context, po) {
			return loadHtml(context, po).then(function (loaded) {
				return loadCss(context, loaded);
			});
		};
		default: return _.noop;
	}
}

function Scraper (options) {
	this.originalResources = [];
	this.loadedResources = [];

	this.options = _.extend({}, defaults, options);
	this.options.directory = path.resolve(process.cwd(), this.options.directory || '');
}

Scraper.prototype.getLoadedResource = function getLoadedResource (resource) {
	return _.find(this.loadedResources, function(lr) {
		return compareUrls(resource.getUrl(), lr.getUrl());
	});
};

Scraper.prototype.addLoadedResource = function addLoadedResource (resource) {
	this.loadedResources.push(resource);
};

Scraper.prototype.getOccupiedFilenames = function getOccupiedFilenames () {
	var subdirectories = _.map(this.options.subdirectories, function (dir) { return dir.directory; });
	var loadedFiles = _.map(this.loadedResources, function(r) { return r.getFilename(); });
	return subdirectories.concat(loadedFiles);
};

Scraper.prototype.getHtmlSources = function getHtmlSources () {
	return this.options.sources;
};

Scraper.prototype.generateFilename = function generateFilename (resource) {
	var self = this;

	var occupiedFilenames = self.getOccupiedFilenames();

	var preferredFilename = resource.getFilename();       // which was set in options
	var urlFilename = utils.getFilenameFromUrl(resource.getUrl());  // try to get filename from url
	var filename = preferredFilename || urlFilename || self.options.defaultFilename;

	var ext = path.extname(filename);
	var dir = self.getDirectoryByExtension(ext);
	var currentFilename = path.join(dir, filename);
	var basename = path.basename(filename, ext);
	var index = 1;

	while (_.contains(occupiedFilenames, currentFilename)) {
		currentFilename = path.join(dir, basename + '_' + index + ext);
		index++;
	}
	return currentFilename;
};

Scraper.prototype.getDirectoryByExtension = function getDirectoryByExtension (ext) {
	return _.chain(this.options.subdirectories)
		.filter(function (dir) { return _.contains(dir.extensions, ext); })
		.map(function (dir) { return dir.directory; })
		.first()
		.value() || '';
};

Scraper.prototype.loadResource = function loadResource (resource) {
	var self = this;

	var loaded = self.getLoadedResource(resource); 	// try to find already loaded

	var url = resource.getUrl();
	var filename;
	var handleFile;

	if (!loaded) {
		filename = self.generateFilename(resource);
		resource.setFilename(filename);

		self.addLoadedResource(resource);

		// Request -> processing -> save to fs
		return self.makeRequest(url).then(function requestCompleted(data) {
			resource.setUrl(data.url);  // Url may be changed in redirects
			resource.setText(data.body);
			handleFile = getHandleFunction(resource);
			return handleFile(self, resource);
		}).then(function fileHandled() {
			var filename = path.join(self.options.directory, resource.getFilename());
			var text = resource.getText();
			return fs.outputFileAsync(filename, text, { encoding: 'binary' });
		}).then(function fileSaved() {
			return Promise.resolve(resource);
		});
	}
	return Promise.resolve(loaded);
};

Scraper.prototype.validate = function validate () {
	if (fs.existsSync(this.options.directory)) {
		return Promise.reject(new Error('Path ' + this.options.directory + ' exists'));
	}
	return Promise.resolve();
};

Scraper.prototype.prepare = function prepare () {
	var self = this;
	fs.ensureDirSync(self.options.directory);

	// Create makeRequest function with custom request params
	self.makeRequest = request.makeRequest.bind(null, self.options.request);

	// Create array of Resource for downloading
	self.options.urls = _.isArray(self.options.urls) ? self.options.urls : [self.options.urls];
	self.originalResources = _.map(self.options.urls, function createResource(obj) {
		var url = _.isObject(obj) && _.has(obj, 'url') ? obj.url : obj;
		var filename = _.isObject(obj) && _.has(obj, 'filename') ? obj.filename : self.options.defaultFilename;
		return new Resource(url, filename);
	});
	return Promise.resolve();
};

Scraper.prototype.load = function load () {
	var self = this;
	return Promise.map(self.originalResources, function loadPage (po) {
		return self.loadResource(po).then(function pageLoaded (loaded) {
			return Promise.resolve({
				url: loaded.getUrl(),
				filename: loaded.getFilename()
			});
		});
	});
};

Scraper.prototype.errorCleanup = function errorCleanup (error) {
	if (!_.isEmpty(this.loadedResources)) {
		fs.removeSync(this.options.directory);
	}
	throw error;
};

Scraper.prototype.scrape = function scrape(callback) {
	var self = this;
	return Promise.bind(self)
		.then(self.validate)
		.then(self.prepare)
		.then(self.load)
		.catch(self.errorCleanup)
		.nodeify(callback);
};

module.exports = Scraper;
