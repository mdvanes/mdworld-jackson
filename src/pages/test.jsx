import React from "react"
import Helmet from "react-helmet";
import PostListing from "../components/PostListing/PostListing";
import SEO from "../components/SEO/SEO";
import config from "../../data/SiteConfig";

const mediumCDNUrl = `https://cdn-images-1.medium.com/max/150/`

const TestPage = ({ data }) => {
  const posts = data.allMediumPost.edges

  return (
    <main>
      {posts.map(post => (
        <article key={post.node.id}>
          <h2>{post.node.title}</h2>
          <h3>by {post.node.author.name}</h3>
          <img
            src={`${mediumCDNUrl}/${post.node.virtuals.previewImage.imageId}`}
            alt={post.node.title}
            width="150"
          />
        </article>
      ))}
      {/* <div className="index-container">
        <Helmet>
          <title>{config.siteTitle}</title>
          <link rel="canonical" href={`${config.siteUrl}`} />
        </Helmet>
        <SEO postEdges={posts} />
        <PostListing postEdges={posts} />
      </div>       */}
    </main>
  )
}

TestPage.propTypes

export default TestPage

export const pageQuery = graphql`
  query TestQuery {
    allMediumPost(limit: 5, sort: { fields: [createdAt], order: DESC }) {
      edges {
        node {
          id
          title
          author {
            name
          }
          virtuals {
            previewImage {
              imageId
            }
          }
        }
      }
    }
  }
`