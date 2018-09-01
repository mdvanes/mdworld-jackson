import React from "react";
import CardTitle from "react-md/lib/Cards/CardTitle";
import Avatar from "react-md/lib/Avatars";
import FontIcon from "react-md/lib/FontIcons";
import PostPreview from "../PostPreview/PostPreview";
import LazyCard from '../PostPreview/LazyCard';
import "../PostPreview/PostPreview.scss";

class PostPreviewLight extends PostPreview {
  render() {
    const { postInfo } = this.props;
    const { mobile } = this.state;
    const expand = mobile;
    return (
      <LazyCard
        key={postInfo.path}
        raise
        className="md-grid md-cell md-cell--12"
        placeholderHeight="300"
      >
        <a style={{ textDecoration: "none" }} href={postInfo.path}>
          {PostPreview.renderMedia(postInfo)}
        </a>
        <CardTitle
          expander={expand}
          avatar={<Avatar icon={<FontIcon iconClassName="fa fa-calendar" />} />}
          title={`Published on ${postInfo.date}`}
        />
      </LazyCard>
    );
  }
}

export default PostPreviewLight;
