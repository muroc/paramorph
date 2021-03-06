import * as React from 'react';
import { Component, Children, ReactNode, ReactElement, cloneElement } from 'react';

import NodeMapper from './NodeMapper';

export interface Props {
  mapper ?: NodeMapper;
  limit ?: number;
  respectLimit ?: boolean;
}

export class Content extends Component<Props, {} > {
  private outstandingLimit : number;

  render() {
    this.outstandingLimit = this.props.limit || Number.MAX_SAFE_INTEGER;
    const { children } = this.props;

    return (
      <div className='content'>
        { this.renderChildren(children) }
      </div>
    );
  }

  private renderChildren(children : ReactNode) : ReactNode[] {
    return Children.map(children, this.renderNode.bind(this));
  }

  private renderNode(node : ReactNode, key : number | string) {
    if (this.isLimitReached() || isEmpty(node)) {
      return null;
    }

    switch (typeof node) {
      case 'boolean':
      case 'number':
        return node;
      case 'string':
        return this.renderString(node as string);
      default:
        return this.renderComponent(node as ReactElement<any>, key);
    }
  }

  private renderString(child : string) {
    if (child.indexOf('.') === -1 || !this.props.respectLimit) {
      return child;
    }
    const sentences = sentencize(child);

    const { outstandingLimit } = this;
    this.outstandingLimit -= sentences.length;

    return sentences.slice(0, outstandingLimit)
  }

  private renderComponent(elem : ReactElement<any>, key : number | string) {
    const { mapper = (node : ReactNode) => node, ...limiterProps } = this.props;
    if (limiterProps.respectLimit && elem.type === 'img') {
      return null;
    }
    const children = this.renderChildren(elem.props.children);
    const props = cloneProps(elem, children, limiterProps, key);

    if (children) {
      return mapper(cloneElement(elem, props, ...children));
    } else {
      return mapper(cloneElement(elem, props));
    }
  }

  private isLimitReached() {
    const { respectLimit } = this.props;
    return respectLimit && this.outstandingLimit <= 0;
  }
}

export default Content;

function isEmpty(node : any) {
  return node === null || node === undefined;
}

function sentencize(child : string) {
  const sentenceRegexp = /[^.!?…]*[.!?…]/g;
  const matches = [];

  let match;
  while ((match = sentenceRegexp.exec(child)) !== null) {
    matches.push(match[0]);
  }

  return matches;
}

function cloneProps(
  elem : ReactElement<any>,
  children : ReactNode,
  limiterProps : any,
  key : number | string,
) {
  if (typeof elem.type === 'string') {
    return { key, ...elem.props, children };
  }
  return { key, ...elem.props, ...limiterProps, children };
}

