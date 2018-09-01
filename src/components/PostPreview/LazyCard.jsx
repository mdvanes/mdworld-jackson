/**
 * Wrapper for Card that only shows content if in view (or has been in view)
 *
 * TODO now for each LazyCard a new observer will be created. It is possible to solve this with one Observer per page.
 */

import React, { Component } from 'react';
import Card from 'react-md/lib/Cards/Card';

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
    if(!window.IntersectionObserver) {
      this.setState({children: this.props.children});
    }
  }

  // Will cause re-render
  componentDidMount() {
    if(window.IntersectionObserver) {
      this.observer = new IntersectionObserver(this.fill, {
        threshold: 1.0 /* Default is 0 TODO change to 0.1 */
      });
      // TODO better way to get the current element ?
      const elem = document.querySelector(`[placeholder-key='${this.props.placeholderKey}']`);
      this.observer.observe(elem);
    }
  }

  fill(entries) {
    if(entries && entries.length > 0 && entries[0].isIntersecting) {
      this.setState({children: this.props.children});
      // Deregister the observer when children are shown (alternative: observer.unobserve)
      this.observer.disconnect();
      // console.log('DEREGISTERED', this.props.placeholderKey)
    }
  }

  render() {
    const { placeholderKey, placeholderHeight, raise, className } = this.props;
    return(
      <Card placeholder-key={placeholderKey} raise={raise} className={className} style={{minHeight: `${placeholderHeight}px`}}>
        {this.state.children}
      </Card>);
  }
}