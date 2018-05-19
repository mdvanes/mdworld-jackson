import React from 'react';

// TODO replace by simple lightbox for the screenshots

export default class HelloWorld extends React.Component {
  constructor() {
    super();
    this.myText = 'Hello, World!';
    this.helloWorld = this.helloWorld.bind(this);
  }

  helloWorld() {
    alert(this.myText);
  }

  render() {
    return (
      <button onClick={this.helloWorld}>Try this button</button>
    );
  }
}