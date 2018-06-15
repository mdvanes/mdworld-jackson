const path = require('path');
const _ = require('lodash');
const webpackLodashPlugin = require('lodash-webpack-plugin');
const generateCovers = require('procgen-cover');
const crypto = require('crypto');
const fs = require('fs');
const retroPostsHash = require('./retro-posts-hash');

let postNodes = [];

/* parse date string in format dd-mm-yyyy */
function parseDate(dateString) {
  const [day, month1Indexed, year] = dateString.split('-');
  return new Date(year, month1Indexed - 1, day);
}

function addSiblingNodesForFiltered(createNodeField, filteredPostNodes) {
  for (let i = 0; i < filteredPostNodes.length; i += 1) {
    const nextID = i + 1 < filteredPostNodes.length ? i + 1 : 0;
    const prevID = i - 1 > 0 ? i - 1 : filteredPostNodes.length - 1;
    const currNode = filteredPostNodes[i];
    const nextNode = filteredPostNodes[nextID];
    const prevNode = filteredPostNodes[prevID];
    createNodeField({
      node: currNode,
      name: "nextTitle",
      value: nextNode.frontmatter.title
    });
    createNodeField({
      node: currNode,
      name: "nextSlug",
      value: nextNode.fields.slug
    });
    createNodeField({
      node: currNode,
      name: "prevTitle",
      value: prevNode.frontmatter.title
    });
    createNodeField({
      node: currNode,
      name: "prevSlug",
      value: prevNode.fields.slug
    });
  }
}

function addSiblingNodes(createNodeField) {
  postNodes.sort(
    ({ fields: { sortDate: date1 } }, { fields: { sortDate: date2 } }) =>
      date1 - date2
  );
  // console.log('Debug', postNodes.map(n => `${n.frontmatter.title} ${n.frontmatter.date} ${n.fields.sortDate}`));

  addSiblingNodesForFiltered(createNodeField, postNodes.filter(n => n.frontmatter.category === 'webdevelopment'));
  addSiblingNodesForFiltered(createNodeField, postNodes.filter(n => n.frontmatter.category === 'mypc'));
}

exports.onCreateNode = ({ node, boundActionCreators, getNode }) => {
  const { createNodeField } = boundActionCreators;
  let slug;
  if (node.internal.type === "MarkdownRemark") {
    const fileNode = getNode(node.parent);
    const parsedFilePath = path.parse(fileNode.relativePath);
    if (
      Object.prototype.hasOwnProperty.call(node, "frontmatter") &&
      Object.prototype.hasOwnProperty.call(node.frontmatter, "title")
    ) {
      slug = `/${_.kebabCase(node.frontmatter.title)}`;
    } else if (parsedFilePath.name !== "index" && parsedFilePath.dir !== "") {
      slug = `/${parsedFilePath.dir}/${parsedFilePath.name}/`;
    } else if (parsedFilePath.dir === "") {
      slug = `/${parsedFilePath.name}/`;
    } else {
      slug = `/${parsedFilePath.dir}/`;
    }
    if (
      Object.prototype.hasOwnProperty.call(node, "frontmatter") &&
      Object.prototype.hasOwnProperty.call(node.frontmatter, "slug")
    ) {
      slug = `/${_.kebabCase(node.frontmatter.slug)}`;
    }
    createNodeField({ node, name: "slug", value: slug });
    // console.log(node.frontmatter)
    // if(!node.frontmatter.date) {
    //   console.log(node.frontmatter)
    // }
    const sortDate = parseDate(node.frontmatter.date).getTime();
    createNodeField({ node, name: "sortDate", value: sortDate });
    postNodes.push(node);
  }
};

function addHash(node) {
  const shasum = crypto.createHash('sha1');
  shasum.update(JSON.stringify({
    title: node.frontmatter.title,
    date: node.frontmatter.date
  }));
  const hash = shasum.digest('hex');
  const newNode = node;
  newNode.frontmatter.cover = `/cover/${hash}.jpg`;
  newNode.hash = hash;
  return newNode;
}

/* Batch for all articles at once */
function createCoverArt(hashArr) {
  let result = '';
  const coverPath = 'static/cover';
  const filteredHashArr = hashArr.filter(hash => {
    const hashCoverPath = `${coverPath}/${hash}.jpg`;
    return !fs.existsSync(hashCoverPath);
  });
  if(filteredHashArr && filteredHashArr.length > 0) {
     result = generateCovers(coverPath, {
         keepOpen: true,
         headless: true,
         formats: [
             {type: 'jpg', quality: 70},
             {type: 'webp', quality: 70}
         ]
     }, filteredHashArr);
  } else {
    result = new Promise(resolve => resolve({status: 'All covers already exist, no covers generated'}));
  }
  return result;
}

exports.setFieldsOnGraphQLNodeType = ({ type, boundActionCreators }) => {
  const { name } = type;
  const { createNodeField } = boundActionCreators;
  if (name === "MarkdownRemark") {
    // Post processing
    addSiblingNodes(createNodeField);
    postNodes = postNodes.map(addHash);
  }
};

exports.onPostBootstrap = () => {
  const hashes = postNodes.map(node => node.hash);
  return retroPostsHash()
    .then(retroHashes => [...hashes, ...retroHashes])
    .then(allHashes => createCoverArt(allHashes))
    .then(result => {
      console.log(`createCoverArt result: ${result && result.status}`)
    })
};

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators;

  return new Promise((resolve, reject) => {
    const postPage = path.resolve("src/templates/post.jsx");
    const tagPage = path.resolve("src/templates/tag.jsx");
    const categoryPage = path.resolve("src/templates/category.jsx");
    resolve(
      graphql(
        `
          {
            allMarkdownRemark {
              edges {
                node {
                  frontmatter {
                    tags
                    category
                  }
                  fields {
                    slug
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          /* eslint no-console: "off" */
          console.log(result.errors);
          reject(result.errors);
        }

        const tagSet = new Set();
        const categorySet = new Set();
        result.data.allMarkdownRemark.edges.forEach(edge => {
          if (edge.node.frontmatter.tags) {
            edge.node.frontmatter.tags.forEach(tag => {
              tagSet.add(tag);
            });
          }

          if (edge.node.frontmatter.category) {
            categorySet.add(edge.node.frontmatter.category);
          }

          createPage({
            path: edge.node.fields.slug,
            component: postPage,
            context: {
              slug: edge.node.fields.slug
            }
          });
        });

        const tagList = Array.from(tagSet);
        tagList.forEach(tag => {
          createPage({
            path: `/tags/${_.kebabCase(tag)}/`,
            component: tagPage,
            context: {
              tag
            }
          });
        });

        const categoryList = Array.from(categorySet);
        categoryList.forEach(category => {
          createPage({
            path: `/categories/${_.kebabCase(category)}/`,
            component: categoryPage,
            context: {
              category
            }
          });
        });
      })
    );
  });
};

exports.modifyWebpackConfig = ({ config, stage }) => {
  if (stage === "build-javascript") {
    config.plugin("Lodash", webpackLodashPlugin, null);
  }
};
