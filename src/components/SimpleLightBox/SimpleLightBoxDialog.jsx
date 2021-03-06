import { PureComponent } from 'react';
import ReactDOM from 'react-dom';

export default class SimpleLightBoxDialog extends PureComponent {
  constructor(props) {
    super(props);
    if(typeof document !== 'undefined') {
      this.el = document.createElement('div');
    }
  }

  componentWillMount() {
    // Normally the Portal root would be declared outside the class, but the way Gatsby initializes the DOM with an html.jsx makes this not possible
    if(typeof document !== 'undefined') {
      const modalRoot = document.getElementById('modal-root');
      modalRoot.appendChild(this.el);
    }
  }

  componentWillUnmount() {
    // Normally the Portal root would be declared outside the class, but the way Gatsby initializes the DOM with an html.jsx makes this not possible
    if(typeof document !== 'undefined') {
      const modalRoot = document.getElementById('modal-root');
      modalRoot.removeChild(this.el);
    }
  }

  render() {
    if(typeof document !== 'undefined') {
      return ReactDOM.createPortal(
        this.props.children,
        this.el,
      );
    }
    return null;
  }
}
