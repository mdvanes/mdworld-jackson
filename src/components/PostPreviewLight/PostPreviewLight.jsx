import React, { Component } from "react";
import Card from "react-md/lib/Cards/Card";
import CardTitle from "react-md/lib/Cards/CardTitle";
import Button from "react-md/lib/Buttons";
import Avatar from "react-md/lib/Avatars";
import FontIcon from "react-md/lib/FontIcons";
import Media, { MediaOverlay } from "react-md/lib/Media";
import PostPreview from "../PostPreview/PostPreview";
import "../PostPreview/PostPreview.scss";

class PostPreviewLight extends PostPreview {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     mobile: true
  //   };
  //   this.handleResize = this.handleResize.bind(this);
  // }
  // componentDidMount() {
  //   this.handleResize();
  //   window.addEventListener("resize", this.handleResize);
  // }
  //
  // componentWillUnmount() {
  //   window.removeEventListener("resize", this.handleResize);
  // }
  //
  // handleResize() {
  //   if (window.innerWidth >= 640) {
  //     this.setState({ mobile: false });
  //   } else {
  //     this.setState({ mobile: true });
  //   }
  // }
  render() {
    const { postInfo } = this.props;
    const { mobile } = this.state;
    const expand = mobile;
    return (
      <Card key={postInfo.path} raise className="md-grid md-cell md-cell--12">
        <a style={{ textDecoration: "none" }} href={postInfo.path}>
          {PostPreview.renderMedia(postInfo)}
        </a>
        <CardTitle
          expander={expand}
          avatar={<Avatar icon={<FontIcon iconClassName="fa fa-calendar" />} />}
          title={`Published on ${postInfo.date}`}
        />
      </Card>
    );
  }
}

export default PostPreviewLight;
