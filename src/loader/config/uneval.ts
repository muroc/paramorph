
import { Paramorph, Layout, Include, Post, Collection, Category, Tag } from '../../model';

export function uneval(paramorph : Paramorph, varName : string = 'paramorph') : string {
  const layouts = Object.keys(paramorph.layouts)
    .map(key => paramorph.layouts[key] as Layout);
  const includes = Object.keys(paramorph.includes)
    .map(key => paramorph.includes[key] as Layout);
  const collections = Object.keys(paramorph.collections)
    .map(key => paramorph.collections[key] as Collection);

  const posts : Post[] = [];
  const categories : Category[] = [];
  const tags : Tag[] = [];

  const all = Object.keys(paramorph.posts)
    .map(key => paramorph.posts[key] as Post);

  all.forEach(post => {
    switch (post.constructor) {
      case Post:
        posts.push(post);
        return;
      case Category:
        categories.push(post as Category);
        return;
      case Tag:
        tags.push(post as Tag);
        return;
      default:
        console.warn(`found a post of unknown type: ${post.constructor}`);
        posts.push(post);
        return;
    }
  });

  const categoryTuples = [].concat.apply([],
    all.map(({ url, categories } : Post) => categories.map(category => ({ category, url }))),
  ) as { category : string, url : string }[];
  const tagTuples = [].concat.apply([],
    all.map(({ url, tags } : Post) => tags.map(tag => ({ tag, url }))),
  ) as { tag : string, url : string }[];

  return `// GENERATED BY PARAMORPH //
const React = require('react');

// CONFIG //
const config = ${JSON.stringify(paramorph.config, null, 2)};

// PARAMORPH //
const ${varName} = new Paramorph(config);

// LAYOUTS //
${
  layouts
    .map(layout => `${varName}.addLayout(\n${unevalLayout(layout)}\n);\n`)
    .join('')
}
// INCLUDES //
${
  includes
    .map(include => `${varName}.addInclude(\n${unevalInclude(include)}\n);\n`)
    .join('')
}
// COLLECTIONS //
${
  collections
    .map(collection => `${varName}.addCollection(\n${unevalCollection(collection)}\n);\n`)
    .join('')
}
// PAGES //
${
  posts
    .map(post => `${varName}.addPost(\n${unevalPost(post)}\n);\n`)
    .join('')
}
// CATEGORIES //
${
  categories
    .map(category => `${varName}.addPost(\n${unevalCategory(category)}\n);\n`)
    .join('')
}
// PAGES IN CATEGORIES //
${
  categoryTuples
    .map(t => `${varName}.categories["${t.category}"].posts.push(${varName}.posts["${t.url}"]);\n`)
    .join('')
}
// TAGS //
${
  tags
    .map(tag => `${varName}.addPost(\n${unevalTag(tag)}\n);\n`)
    .join('')
}
// PAGES IN TAGS //
${
  tagTuples
    .map(t => `${varName}.tags["${t.tag}"].posts.push(${varName}.posts["${t.url}"]);\n`)
    .join('')
}
// LAYOUT LOADERS //
${
  layouts
    .map(layout => `${varName}.addLayoutLoader("${layout.name}", ${loaderOf(layout.path)});\n`)
    .join('')
}
// INCLUDE LOADERS //
${
  includes
    .map(include => `${varName}.addIncludeLoader("${include.name}", ${loaderOf(include.path)});\n`)
    .join('')
}
// CONTENT LOADERS //
${
  all
    .map(post => `${varName}.addContentLoader("${post.url}", ${loaderOf(post.source)});\n`)
    .join('')
}
// UTIL FUNCTIONS
function asReactComponent(exports, url) {
  if (exports.default === undefined) {
    throw new Error(url +' must have a default export');
  }
  const candidate = exports.default;

  if (React.isValidElement(candidate) && typeof candidate.type === 'function') {
    const got = JSON.stringify(candidate);
    throw new Error(url +' must have react component as default export; got '+ got);
  }
  return exports.default;
}

`;
}

export default uneval;

export function unevalLayout(layout : Layout) {
  return `  new Layout(\n    ${
    JSON.stringify(layout.name)
  },\n    ${
    JSON.stringify(layout.path)
  },\n  )`;
}

export function unevalInclude(include : Include) {
  return `  new Include(\n    ${
    JSON.stringify(include.name)
  },\n    ${
    JSON.stringify(include.path)
  },\n  )`;
}

export function unevalCollection(collection : Collection) {
  return `  new Collection(\n    ${
    JSON.stringify(collection.name)
  },\n    ${
    JSON.stringify(collection.title)
  },\n    ${
    JSON.stringify(collection.path)
  },\n    ${
    JSON.stringify(collection.layout)
  },\n    ${
    JSON.stringify(collection.output)
  },\n    ${
    JSON.stringify(collection.limit)
  },\n  )`;
}

export function unevalPost(post : Post) {
  return `  new Post(\n    ${
    JSON.stringify(post.pathSpec)
  },\n    ${
    JSON.stringify(post.title)
  },\n    ${
    JSON.stringify(post.description)
  },\n    ${
    JSON.stringify(post.image)
  },\n    ${
    JSON.stringify(post.collection)
  },\n    ${
    JSON.stringify(post.layout)
  },\n    ${
    JSON.stringify(post.source)
  },\n    ${
    JSON.stringify(post.output)
  },\n    ${
    JSON.stringify(post.feed)
  },\n    ${
    JSON.stringify(post.limit)
  },\n    ${
    JSON.stringify(post.categories)
  },\n    ${
    JSON.stringify(post.tags)
  },\n    ${
    JSON.stringify(post.timestamp)
  },\n  )`;
}

export function unevalCategory(post : Category) {
  return `  new Category(\n    ${
    JSON.stringify(post.pathSpec)
  },\n    ${
    JSON.stringify(post.title)
  },\n    ${
    JSON.stringify(post.description)
  },\n    ${
    JSON.stringify(post.image)
  },\n    ${
    JSON.stringify(post.collection)
  },\n    ${
    JSON.stringify(post.layout)
  },\n    ${
    JSON.stringify(post.source)
  },\n    ${
    JSON.stringify(post.output)
  },\n    ${
    JSON.stringify(post.feed)
  },\n    ${
    JSON.stringify(post.limit)
  },\n    ${
    JSON.stringify(post.categories)
  },\n    ${
    JSON.stringify(post.tags)
  },\n    ${
    JSON.stringify(post.timestamp)
  },\n  )`;
}

export function unevalTag(post : Tag) {
  return `  new Tag(\n    ${
    JSON.stringify(post.pathSpec)
  },\n    ${
    JSON.stringify((post as Tag).originalTitle)
  },\n    ${
    JSON.stringify(post.description)
  },\n    ${
    JSON.stringify(post.image)
  },\n    ${
    JSON.stringify(post.layout)
  },\n    ${
    JSON.stringify(post.source)
  },\n    ${
    JSON.stringify(post.output)
  },\n    ${
    JSON.stringify(post.limit)
  },\n    ${
    JSON.stringify(post.timestamp)
  },\n  )`;
}

export function loaderOf(path : string) {
  return `() => import("@website${path.substring(1)}").then(exports => asReactComponent(exports, "${path}"))`;
}

