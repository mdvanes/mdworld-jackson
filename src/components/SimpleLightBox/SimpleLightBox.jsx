import React, { PureComponent } from 'react';
import { Button, DialogContainer } from 'react-md';
import { withPrefix } from 'gatsby-link';
import SimpleLightBoxDialog from './SimpleLightBoxDialog';

export default class SimpleListDialog extends PureComponent {
  constructor() {
    super();
    this.state = { visible: false };
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  show() {
    this.setState({ visible: true });
  };

  hide() {
    this.setState({ visible: false });
  };

  handleKeyDown(e) {
    const key = e.which || e.keyCode;
    if (key === 13 || key === 32) {
      // also close on enter or space keys
      this.hide();
    }
  };

  render() {
    const { visible } = this.state;

    return (
      <span>
        <button onClick={this.show} style={{border: 'none', cursor: 'pointer', padding: '0'}}>
          <img alt={this.props.imgTitle} src={withPrefix(this.props.imgPath)} style={{width: '100vw'}} />
        </button>

        {/* Portal to outside of the <p> created by post.jsx */}
        <SimpleLightBoxDialog>
          <DialogContainer
            id="lightbox-dialog"
            visible={visible}
            aria-label="{this.props.imgTitle}"
            onHide={this.hide}
            fullPage
            style={{textAlign: 'center'}}
          >
            <Button
              floating
              secondary
              onClick={this.hide}
              onKeyDown={this.handleKeyDown}
              style={{marginTop: '75px', marginBottom: '1em'}}
            >
              close
            </Button>
            <br />
            <img
              style={{width: '100vw'}}
              alt={this.props.imgTitle}
              src={withPrefix(this.props.imgPath)}
            />
          </DialogContainer>
        </SimpleLightBoxDialog>
      </span>
    );
  }
}
