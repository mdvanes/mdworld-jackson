import React from "react";
import Card from "react-md/lib/Cards/Card";
import CardTitle from "react-md/lib/Cards/CardTitle";
import Avatar from "react-md/lib/Avatars";
import FontIcon from "react-md/lib/FontIcons";
import PostPreview from "../PostPreview/PostPreview";
import "../PostPreview/PostPreview.scss";

class PostPreviewLight extends PostPreview {
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
