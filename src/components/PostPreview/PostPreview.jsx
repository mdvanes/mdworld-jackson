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
      ? __PATH_PREFIX__ + postInfo.cover
      : postInfo.cover;
    /* TODO do webpCover in gatsby-node.js for performance? */
    const webpCover = `${cover.split('.').slice(0,-1).join('.')}.webp 1222w`;
    return { cover, webpCover };
  }

  static getMediaOverlay(postInfo) {
    return (
      <MediaOverlay>
        <CardTitle title={postInfo.title}>
          <Button raised secondary className="md-cell--right">
            Read
          </Button>
        </CardTitle>
      </MediaOverlay>);
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
    /* eslint no-undef: "off" */
    const { cover, webpCover } = PostPreview.getCoverPaths(postInfo);
    return (
      <Card key={postInfo.path} raise className="md-grid md-cell md-cell--12">
        <GatsbyLink style={{ textDecoration: "none" }} to={postInfo.path}>
          <Media aspectRatio="mdworld-cover">
            {/* TODO extra breakpoint at 839-840 for small screens and offer smaller files? */}
            <picture>
              <source type="image/webp" srcSet={webpCover} />
              <img alt="cover generated from hash" src={cover} />
            </picture>
            {PostPreview.getMediaOverlay(postInfo)}
          </Media>
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
