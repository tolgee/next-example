import MyDocument from './_document';
import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';

describe('MyDocument', () => {
  const createDocumentInstance = () => {
    const instance = Object.create(MyDocument.prototype);
    return instance;
  };

  it('should have a render method that returns JSX', () => {
    const document = createDocumentInstance();
    const result = document.render.call(document);
    
    expect(result).toBeDefined();
    expect(result.type).toBe(Html);
  });

  it('should render Html component with Head child', () => {
    const document = createDocumentInstance();
    const result = document.render.call(document);
    
    const headChild = result.props.children.find(
      (child: React.ReactElement) => child.type === Head
    );
    expect(headChild).toBeDefined();
  });

  it('should render link to style.css in Head', () => {
    const document = createDocumentInstance();
    const result = document.render.call(document);
    
    const headChild = result.props.children.find(
      (child: React.ReactElement) => child.type === Head
    );
    const link = headChild.props.children;
    expect(link.props.href).toBe('/style.css');
  });

  it('should render body with Main and NextScript', () => {
    const document = createDocumentInstance();
    const result = document.render.call(document);
    
    const bodyChild = result.props.children.find(
      (child: React.ReactElement) => child.type === 'body'
    );
    expect(bodyChild).toBeDefined();
    
    const bodyChildren = Array.isArray(bodyChild.props.children)
      ? bodyChild.props.children
      : [bodyChild.props.children];
    
    const mainComponent = bodyChildren.find(
      (child: React.ReactElement) => child.type === Main
    );
    expect(mainComponent).toBeDefined();
    
    const nextScriptComponent = bodyChildren.find(
      (child: React.ReactElement) => child.type === NextScript
    );
    expect(nextScriptComponent).toBeDefined();
  });
});
