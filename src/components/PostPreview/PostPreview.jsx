import React, { Component } from "react";
import Card from "react-md/lib/Cards/Card";
import CardTitle from "react-md/lib/Cards/CardTitle";
import Button from "react-md/lib/Buttons";
import Avatar from "react-md/lib/Avatars";
import CardText from "react-md/lib/Cards/CardText";
import FontIcon from "react-md/lib/FontIcons";
import GatsbyLink from "gatsby-link";
import Media, { MediaOverlay } from "react-md/lib/Media";
import PostTags from "../PostTags/PostTags";
import "./PostPreview.scss";

class PostPreview extends Component {

  static getCoverPaths(postInfo) {
    const cover = postInfo.cover.startsWith("/")
      // eslint-disable-next-line no-undef
      ? __PATH_PREFIX__ + postInfo.cover
      : postInfo.cover;
    const webpCover = postInfo.webpCover.startsWith("/")
      // eslint-disable-next-line no-undef
      ? __PATH_PREFIX__ + postInfo.webpCover
      : postInfo.webpCover;
    return { cover, webpCover };
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
    const { cover, webpCover } = PostPreview.getCoverPaths(postInfo);
    return (
      <Media aspectRatio="mdworld-cover">
        {/* TODO extra breakpoint at 839-840 for small screens and offer smaller files? */}
        <picture>
          <source type="image/webp" srcSet={`${webpCover} 1222w`} />
          <img alt="cover generated from hash" src={cover} />
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
      <Card key={postInfo.path} raise className="md-grid md-cell md-cell--12">
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
      </Card>
    );
  }
}

export default PostPreview;
