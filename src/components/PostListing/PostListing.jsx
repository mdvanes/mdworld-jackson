import React from 'react';
import Card from 'react-md/lib/Cards/Card';
import CardText from 'react-md/lib/Cards/CardText';
import PostPreview from '../PostPreview/PostPreview';
import PostPreviewLight from '../PostPreviewLight/PostPreviewLight';
import retroPosts from './retro-posts.json';

class PostListing extends React.Component {
  getPostList() {
    return this.props.postEdges.map(postEdge => ({
        path: postEdge.node.fields.slug,
        tags: postEdge.node.frontmatter.tags,
        category: postEdge.node.frontmatter.category,
        cover: postEdge.node.frontmatter.cover,
        hash: postEdge.node.frontmatter.hash,
        title: postEdge.node.frontmatter.title,
        date: postEdge.node.frontmatter.date,
        excerpt: postEdge.node.excerpt,
        timeToRead: postEdge.node.timeToRead
      }));
  }
  render() {
    const postList = this.getPostList();
    const retroPostsTempl = retroPosts
      .filter(post => post.category === this.props.category)
      .map(post => (<PostPreviewLight key={post.title} postInfo={post} />));
    return (
      <div className="md-grid md-grid--no-spacing md-cell--middle">
        <div className="md-grid md-cell--8 mobile-fix">
          {postList.map(post => (
            <PostPreview key={post.title} postInfo={post} />
          ))}
          {retroPostsTempl}
          <Card raise className="md-grid md-cell md-cell--12">
            <CardText>
              Looking for even older posts? Go <a href="https://mdvanes.github.io/mdworld-simon">here</a>.
            </CardText>
          </Card>
        </div>
      </div>
    );
  }
}

export default PostListing;
