import React from "react";
import Helmet from "react-helmet";
import PostListing from "../components/PostListing/PostListing";
import SEO from "../components/SEO/SEO";
import config from "../../data/SiteConfig";
import Hero from "../components/Hero/Hero";

// Categoryname is defined twice, but see Note below
const category = 'webdevelopment';

class Index extends React.Component {
  render() {
    const postEdges = this.props.data.allMarkdownRemark.edges;
    return (
      <div className="index-container">
        <Helmet>
          <title>{config.siteTitle}</title>
          <link rel="canonical" href={`${config.siteUrl}`} />
        </Helmet>
        <SEO postEdges={postEdges} />
        <Hero />
        <PostListing postEdges={postEdges} category={category} />
      </div>
    );
  }
}

export default Index;

/*
Note: it is not pretty that category "webdevelopment" is hardcoded in the query. First of all, it is now defined in 2
places (the query and the category constant in this file).
However, it is not possible to do string intrapolation on a graphql tagged template.

The solution would be supplying a parameter to the query and setting that parameter in gatsby-node.js.
The downside is that in that case the logic would be split over 2 files, and the category "webdevelopment" would still
exist in 2 places, but now spread out over 2 files.

For future reference, it would look like this:

// Change the query to:

  query IndexQuery($currentCategory: String) {
    allMarkdownRemark(
      limit: 2000
      filter: { frontmatter: { category: { eq: $currentCategory } }}
      sort: { fields: [fields___sortDate], order: DESC }
      ...

// Add this in gatsby-node.js, creating exports.onCreatePage if needed:

exports.onCreatePage = ({ page, boundActionCreators }) => {
  const { createPage, deletePage } = boundActionCreators;
  return new Promise(resolve => {
    const oldPage = Object.assign({}, page);
    console.log(page.path)
    if(page.path === '/') {
      page.context.currentCategory = 'webdevelopment';
      // Replace new page with old page
      deletePage(oldPage);
      createPage(page);
    }
    resolve();
  });
};

Sources:

https://stackoverflow.com/questions/46365205/how-do-you-pass-variables-to-pagequery
https://www.gatsbyjs.org/docs/creating-and-modifying-pages/ (mainly "Removing trailing slashes")
*/

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(
      limit: 2000
      filter: { frontmatter: { category: { eq: "webdevelopment" } }}
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