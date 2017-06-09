
import { Page, Layout, Category, Collection, Website, ComponentType } from '../models';

import requireDirectory, { Module, RequireContext } from './requireDirectory';

import layouts from './layouts';

const Context = require('./requireContext');
const config = require('../../_config.yml');

function checkIsObject(value : any, name : string) {
  if (typeof value != 'object') {
    throw new Error(`${name} must be an object; got ${typeof value}`);
  }
  return value;
}
function checkIsArray(value : any, name : string) {
  if (!(value instanceof Array)) {
    throw new Error(`${name} must be an array; got ${typeof value}`);
  }
  return value;
}
function checkIsString(value : any, name : string) {
  if (typeof value != 'string') {
    throw new Error(`${name} must be a string; got ${typeof value}`);
  }
  return value;
}

checkIsObject(config.collections, 'config.collections');

const website = new Website();
layouts.forEach((layout : Layout) => website.addLayout(layout));

const ROOT_COLLECTION_KEY = '$root';
const ROOT_COLLECTION_TITLE = 'Root Pages';
const DEFAULT_LAYOUT_NAME = 'default';

function titleFromUrl(url : string, requiredBy : string) {
  const title = `${url.charAt(0).toUpperCase()}${url.substring(1).replace(/-/g, ' ')}`;
  console.warn(`${requiredBy}.title is not defined; defaulting to ${title}`);
  return title;
}
function urlFromTitle(title : string, requiredBy : string) {
  const url = `/${title.toLowerCase().replace(/ /g, '-')}`;
  console.warn(`${requiredBy}.url is not defined; defaulting to ${url}`);
  return url;
}

function parseCollection(key : string, cfg : any) {
  const requiredBy = `collections['${key}']`;

  const title = checkIsString(cfg.title || titleFromUrl(key, requiredBy), requiredBy);
  const layout = website.getLayoutOfName(cfg.layout || DEFAULT_LAYOUT_NAME, requiredBy);
  return new Collection(title, layout, cfg.output != false);
}

function parsePage(name : string, body: ComponentType<any>, frontMatter: any, defaultLayout : string) {
  const requiredBy = `pages['${name}']`;

  const layout = website.getLayoutOfName(
    checkIsString(frontMatter.layout || defaultLayout, `${requiredBy}.layout`),
    requiredBy
  );
  const title = checkIsString(
    frontMatter.title || titleFromUrl(name, requiredBy),
    `${requiredBy}.title`
  );
  const url = checkIsString(
    frontMatter.permalink || urlFromTitle(name, requiredBy),
    `${requiredBy}.url`
  );
  const date = frontMatter.date;
  const role = checkIsString(frontMatter.role || 'page', `${requiredBy}.role`);

  const categoryTitles = checkIsArray(frontMatter.categories || [], `${requiredBy}.categories`);
  if (frontMatter.category != undefined) {
    categoryTitles.push(checkIsString(frontMatter.category, `${requiredBy}.category`));
  }

  switch (role) {
    case 'page': return new Page(title, url, layout, body, date, categoryTitles);
    case 'category': return new Category(title, url, layout, body, date, categoryTitles);
    default: throw new Error(`unrecognized role: ${role} in ${requiredBy}`);
  }
}

function createCollection(key : string, cfg : any, context : RequireContext) {
  const collection = parseCollection(key, cfg);

  collection.pages = requireDirectory(context)
    .map((module : Module) => parsePage(
      module.name.replace(/\.markdown$/, '').replace(/^\.\//, ''),
      module.exports.component,
      module.exports.frontMatter,
      collection.layout.name
    ));

  return collection;
}

const collections = [].concat.apply(
  createCollection(ROOT_COLLECTION_KEY, { title : ROOT_COLLECTION_TITLE }, Context.ROOT),
  Object.keys(config.collections)
    .filter((key : string) => {
      const context = Context.hasOwnProperty(key.toUpperCase());
      if (!context) {
        console.warn(`couldn't find folder _${key} required by collection ${key}`);
      }
      return context;
    })
    .map((key : string) =>
      createCollection(key, config.collections[key], Context[key.toUpperCase()])),
);

export default collections;

