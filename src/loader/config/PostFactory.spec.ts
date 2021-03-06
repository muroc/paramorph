
import * as should from 'should';

import { Post, Collection, Category } from '../../model';

import PostFactory from './PostFactory';
import Matter from './Matter';

const date = new Date('Jun 05 2018 00:00 UTC');
const matter = (arg : any = {}) => ({ date, ...arg } as Matter);

describe('PostFactory', () => {
  const sourceFile = {
    name: 'test-post',
    path: './_posts/test.md',
  };
  const collection = new Collection('posts', 'Posts', './_posts');

  let testedFactory : PostFactory;

  beforeEach(() => {
    testedFactory = new PostFactory();
  });

  const roleTests : [any, any][] = [
    [ undefined, Post ],
    [ null, Post ],
    [ 'post', Post ],
    [ 'Post', Post ],
    [ 'POST', Post ],
    [ 'category', Category ],
    [ 'Category', Category ],
    [ 'CATEGORY', Category ],
  ];

  roleTests.forEach(params => {
    const [ role, ExpectedPrototype ] = params;

    describe(`when calling .create(${JSON.stringify(role)}`, () => {
      let result : Post;

      beforeEach(() => {
        result = testedFactory.create(sourceFile, collection, matter({ role }));
      });

      it(`returns instance of ${ExpectedPrototype.name}`, () => {
        result.should.be.instanceOf(ExpectedPrototype);
      });
    });
  });

  describe(`when calling .crate({ date: '${date}' })`, () => {
    let result : any;

    beforeEach(() => {
      result = testedFactory.create(sourceFile, collection, matter());
    });

    it('contains given date', () => {
      result.timestamp.should.equal(1528156800000);
    });
    it('contains title generated from file name', () => {
      result.title.should.equal('Test post');
    });
    it('contains url generated from file name', () => {
      result.url.should.equal('/test-post/');
    });
    it('contains empty description', () => {
      result.description.should.equal('');
    });
    it('contains layout \'default\'', () => {
      result.layout.should.equal('default');
    });
    it('contains output=true', () => {
      result.output.should.equal(true);
    });
    it('contains feed=true', () => {
      result.feed.should.equal(true);
    });
    it('contains no categories', () => {
      result.categories.should.eql([]);
    });
    it('contains no tags', () => {
      result.tags.should.eql([]);
    });
  });

  const fullMatter = {
    pathSpec: '/link',
    title: 'Title',
    description: 'Full defined post',
    image: 'image.jpg',
    layout: 'Custom',
    output: false,
    feed: false,
    limit: 10,
  };

  describe(`when calling .create(${JSON.stringify(fullMatter)})`, () => {
    let result : Post;

    beforeEach(() => {
      result = testedFactory.create(sourceFile, collection, matter(fullMatter));
    });

    it('contains given title', () => {
      result.title.should.equal(fullMatter.title);
    });
    it('contains given url', () => {
      result.url.should.equal('/link/');
    });
    it('contains given description', () => {
      result.description.should.equal(fullMatter.description);
    });
    it('contains given image', () => {
      (result.image as string).should.equal(fullMatter.image);
    });
    it('contains given layout', () => {
      result.layout.should.equal(fullMatter.layout);
    });
    it('contains given output', () => {
      result.output.should.equal(fullMatter.output);
    });
    it('contains given feed', () => {
      result.feed.should.equal(fullMatter.feed);
    });
    it('contains given limit', () => {
      result.limit.should.equal(fullMatter.limit);
    });
  });

  const tagsMatter = {
    tags: [ 'a', 'b', 'c' ],
  };

  describe(`when calling .create(${JSON.stringify(tagsMatter)})`, () => {
    let result : Post;

    beforeEach(() => {
      result = testedFactory.create(sourceFile, collection, matter(tagsMatter));
    });

    it('contains given tags', () => {
      result.tags.should.eql(tagsMatter.tags);
    });
  });

  const categoriesMatter = {
    categories: [ 'a', 'b', 'c' ],
  };

  describe(`when calling .create(${JSON.stringify(categoriesMatter)})`, () => {
    let result : Post;

    beforeEach(() => {
      result = testedFactory.create(sourceFile, collection, matter(categoriesMatter));
    });

    it('contains given categories', () => {
      result.categories.should.eql(categoriesMatter.categories);
    });
  });

  const categoryMatter = {
    category: 'a',
  };

  describe(`when calling .crate(${JSON.stringify(categoryMatter)})`, () => {
    let result : Post;

    beforeEach(() => {
      result = testedFactory.create(sourceFile, collection, matter(categoryMatter));
    });

    it('contains given categories', () => {
      result.categories.should.eql([ 'a' ]);
    });
  });

  const categoriesCategoryMatter = {
    categories: [ 'a', 'b', 'c' ],
    category: 'd',
  };

  describe(`when calling .create(${JSON.stringify(categoriesCategoryMatter)})`, () => {
    let result : Post;

    beforeEach(() => {
      result = testedFactory.create(sourceFile, collection, matter(categoriesCategoryMatter));
    });

    it('contains given categories', () => {
      result.categories.should.eql([ 'a', 'b', 'c', 'd' ]);
    });
  });
});

