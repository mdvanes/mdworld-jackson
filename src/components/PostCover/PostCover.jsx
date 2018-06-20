import React from "react";
import Media from "react-md/lib/Media";
import PostPreview from "../PostPreview/PostPreview";
import "./PostCover.scss";

class PostCover extends PostPreview {
  render() {
    const { cover, webpCover } = PostPreview.getCoverPaths(this.props.postNode.frontmatter);
    return (
      <Media aspectRatio="mdworld-cover" className="md-grid md-cell--11">
        {/* TODO extra breakpoint at 839-840 for small screens and offer smaller files? */}
        <picture>
          <source type="image/webp" srcSet={`${webpCover} 1222w`} />
          <img alt="cover generated from hash" src={cover} />
        </picture>
      </Media>
    );
  }
}

export default PostCover;
