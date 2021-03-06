
import * as React from 'react';
import * as PropTypes from 'prop-types';
import { History } from 'history';

import * as sinon from 'sinon';
import FakePromise from 'fake-promise';

import * as model from '../model';
import { RootProps } from '../react';
import { ServerRenderer, Locals, HashMap } from '../boot';

function elem(tag : string, ...children : React.ReactNode[]) {
  return React.createElement(tag, children);
}

class Root extends React.Component<RootProps> {
  render() {
    const { paramorph, post } = this.props;

    return (
      <html>
        <head>
         <title>{ post.title } | { paramorph.config.title }</title>
        </head>
        <body>
          %%%BODY%%%
        </body>
      </html>
    );
  }
}

class LayoutComponent extends React.Component<{}> {
  render() {
    const { children } = this.props;

    return (
      <div className='layout'>
        { children }
      </div>
    );
  }
}

class PostComponent extends React.Component<{}> {
  static readonly contextTypes = {
    post: PropTypes.object,
  };
  render() {
    const { post } = this.context;

    return (
      <p>
        { post.title }
      </p>
    );
  }
}

function createPost(url : string, title : string, date : number) {
  return new model.Post(url, title, '', null, 'Test', 'test', './test.md', true, true, 5, [], [], date);
}

describe('ServerRenderer', () => {
  let testedRenderer : ServerRenderer;

  beforeEach(() => {
    const collection = new model.Collection('test', 'Test', './_test');
    const post = createPost('/', 'Meeting', 0);
    const layout = new model.Layout('test', './layouts/test.md');

    const paramorph = new model.Paramorph({ title: 'website.test' } as model.Config);
    paramorph.addLayout(layout);
    paramorph.addCollection(collection);
    paramorph.addPost(post);
    paramorph.addContentLoader(post.url, () => Promise.resolve(PostComponent));
    paramorph.addLayoutLoader(layout.name, () => Promise.resolve(LayoutComponent));

    testedRenderer = new ServerRenderer({} as History, new model.PathParams, paramorph);
  });

  describe('after calling render', () => {
    let routerPromise : FakePromise<model.Post>;
    let resultPromise : Promise<HashMap<string>>;

    beforeEach(() => {
      const locals = { Root } as Locals;

      const webpackStats = {
        compilation: {
          assets: {
            'bundle.css': {},
            'bundle.js': {},
          },
        },
      };

      resultPromise = testedRenderer.render(locals, webpackStats);
    });

    it('renders single post', () => {
      return resultPromise.then(result => {
        Object.keys(result)
          .should.eql([ '/' ])
        ;
        (result['/'] as any).should.equal('' +
          '<!DOCTYPE html>\n' +
          '<html>' +
          '<head><title>Meeting | website.test</title></head>' +
          '<body><div class="layout" data-reactroot=""><p>Meeting</p></div></body>' +
          '</html>'
        );
      });
    });
  });
});

