import React, { Component } from "react";
import CardTitle from "react-md/lib/Cards/CardTitle";
import Button from "react-md/lib/Buttons";
import Avatar from "react-md/lib/Avatars";
import CardText from "react-md/lib/Cards/CardText";
import FontIcon from "react-md/lib/FontIcons";
import GatsbyLink from "gatsby-link";
import Media, { MediaOverlay } from "react-md/lib/Media";
import PostTags from "../PostTags/PostTags";
import LazyCard from './LazyCard';
import "./PostPreview.scss";

class PostPreview extends Component {

  static getCoverPaths(postInfo) {
    const cover = postInfo.cover.startsWith('/')
      // eslint-disable-next-line no-undef
      ? __PATH_PREFIX__ + postInfo.cover
      : postInfo.cover;
    return { cover, hash: postInfo.hash };
  }

  static renderMediaOverlay(postInfo) {
    return (
      <MediaOverlay>
        <CardTitle title={postInfo.title}>
          <Button raised secondary className="md-cell--right">
            Read
          </Button>
        </CardTitle>
      </MediaOverlay>);
  }

  static renderMedia(postInfo) {
    const { cover, hash } = PostPreview.getCoverPaths(postInfo);
    const coverPathPrefix = `${cover}${hash}`;
    return (
      <Media aspectRatio="mdworld-cover">
        <picture>
          <source type="image/webp" srcSet={`${coverPathPrefix}-1222w.webp 1222w, ${coverPathPrefix}-640w.webp 640w`} />
          <source type="image/jpeg" srcSet={`${coverPathPrefix}-1222w.jpg 1222w, ${coverPathPrefix}-640w.jpg 640w`} />
          <img alt="cover generated from hash" src={`${coverPathPrefix}-640w.jpg`} />
        </picture>
        {PostPreview.renderMediaOverlay(postInfo)}
      </Media>);
  }

  constructor(props) {
    super(props);
    this.state = {
      mobile: true
    };
    this.handleResize = this.handleResize.bind(this);
  }
  componentDidMount() {
    this.handleResize();
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  handleResize() {
    if (window.innerWidth >= 640) {
      this.setState({ mobile: false });
    } else {
      this.setState({ mobile: true });
    }
  }

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
        <GatsbyLink style={{ textDecoration: "none" }} to={postInfo.path}>
          {PostPreview.renderMedia(postInfo)}
        </GatsbyLink>
        <CardTitle
          expander={expand}
          avatar={<Avatar icon={<FontIcon iconClassName="fa fa-calendar" />} />}
          title={`Published on ${postInfo.date}`}
          subtitle={`${postInfo.timeToRead} min read`}
        />
        <CardText expandable={expand}>
          {postInfo.excerpt}
          <PostTags tags={postInfo.tags} />
        </CardText>
      </LazyCard>
    );
  }
}

export default PostPreview;
