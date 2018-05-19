import React, { Component } from "react";
import Card from "react-md/lib/Cards/Card";
import CardTitle from "react-md/lib/Cards/CardTitle";
import Button from "react-md/lib/Buttons";
import Avatar from "react-md/lib/Avatars";
import FontIcon from "react-md/lib/FontIcons";
import Media, { MediaOverlay } from "react-md/lib/Media";
import "../PostPreview/PostPreview.scss";

class PostPreviewLight extends Component {
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
    const cover = postInfo.cover.startsWith("/")
      ? __PATH_PREFIX__ + postInfo.cover
      : postInfo.cover;
    const coverHeight = mobile ? 162 : 225;
    return (
      <Card key={postInfo.path} raise className="md-grid md-cell md-cell--12">
        <a style={{ textDecoration: "none" }} href={postInfo.path}>
          <Media
            style={{
              backgroundImage: `url(${cover})`,
              height: `${coverHeight}px`
            }}
            className="post-preview-cover"
          >
            <MediaOverlay>
              <CardTitle title={postInfo.title}>
                <Button raised secondary className="md-cell--right">
                  Read
                </Button>
              </CardTitle>
            </MediaOverlay>
          </Media>
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
