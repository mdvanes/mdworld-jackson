import React from "react";
import Media from "react-md/lib/Media";
import PostPreview from "../PostPreview/PostPreview";
import "./PostCover.scss";

class PostCover extends PostPreview {
  render() {
    const { cover, hash } = PostPreview.getCoverPaths(this.props.postNode.frontmatter);
    const coverPathPrefix = `${cover}${hash}`;
    return (
      <Media aspectRatio="mdworld-cover" className="md-grid md-cell--11">
        <picture>
          <source type="image/webp" srcSet={`${coverPathPrefix}-1222w.webp 1222w, ${coverPathPrefix}-640w.webp 640w`} />
          <source type="image/jpeg" srcSet={`${coverPathPrefix}-1222w.jpg 1222w, ${coverPathPrefix}-640w.jpg 640w`} />
          <img alt="cover generated from hash" src={`${coverPathPrefix}-640w.jpg`} />
        </picture>
      </Media>
    );
  }
}

export default PostCover;
