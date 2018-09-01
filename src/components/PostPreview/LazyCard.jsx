/**
 * Wrapper for Card that only shows content if in view (or has been in view)
 *
 * TODO now for each LazyCard a new observer will be created. It is possible to solve this with one Observer per page.
 */

import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import Card from 'react-md/lib/Cards/Card';

// TODO unit test

export default class LazyCard extends Component {

  constructor(props) {
    super(props);
    this.observer = null;
    this.state = {
      children: []
    };
    this.fill = this.fill.bind(this);
  }

  // Will not cause re-render
  componentWillMount() {
    // If intersection observer not available, load everything at once
    if(typeof window !== 'undefined' && !window.IntersectionObserver) {
      this.setState({children: this.props.children});
    }
  }

  // Will cause re-render
  componentDidMount() {
    if(typeof window !== 'undefined' && window.IntersectionObserver) {
      this.observer = new IntersectionObserver(this.fill, {
        threshold: 0.5 /* Default is 0 (i.e. on first pixel) */
      });
      // This should be fixed with ref callback, but must be done on HTMLElement, not on React Component e.g. Card
      // eslint-disable-next-line react/no-find-dom-node
      const elem = findDOMNode(this);
      this.observer.observe(elem);
    }
  }

  fill(entries) {
    if(entries && entries.length > 0 && entries[0].isIntersecting) {
      this.setState({children: this.props.children});
      // Deregister the observer when children are shown (alternative: observer.unobserve)
      this.observer.disconnect();
    }
  }

  render() {
    const { placeholderHeight, raise, className } = this.props;
    return(
      <Card raise={raise} className={className} style={{minHeight: `${placeholderHeight}px`}}>
        {this.state.children}
      </Card>);
  }
}