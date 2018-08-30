import React from "react";
import Helmet from "react-helmet";
import PostListing from "../components/PostListing/PostListing";
import SEO from "../components/SEO/SEO";
import config from "../../data/SiteConfig";

// Categoryname is defined twice, but see Note in pages/index.jsx
const category = 'mypc';

class MyPC extends React.Component {
  render() {
    const postEdges = this.props.data.allMarkdownRemark.edges;

    return (
      <div className="index-container">
        <Helmet>
          <title>{config.siteTitle}</title>
          <link rel="canonical" href={`${config.siteUrl}`} />
        </Helmet>
        <SEO postEdges={postEdges} />
        <PostListing postEdges={postEdges} category={category} />
      </div>
    );
  }
}

export default MyPC;

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query MyPCQuery {
    allMarkdownRemark(
      limit: 2000
      filter: { frontmatter: { category: { eq: "mypc" } }}
      sort: { fields: [fields___sortDate], order: DESC }
    ) {
      edges {
        node {
          fields {
            slug
          }
          excerpt
          timeToRead
          frontmatter {
            title
            tags
            cover
            hash
            date
          }
        }
      }
    }
  }
`;
