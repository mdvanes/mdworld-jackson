webpackJsonp([71589287150858],{117:function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}t.__esModule=!0;var i=n(1),u=a(i),c=n(44),f=a(c),p=n(30),s=a(p),d=function(e){function t(){return r(this,t),o(this,e.apply(this,arguments))}return l(t,e),t.prototype.render=function(){var e=this.props,t=e.postNode,n=e.postPath,a=e.postSEO,r=void 0,o=void 0,l=void 0,i=void 0;if(a){var c=t.frontmatter;r=c.title,o=c.description?c.description:t.excerpt,l=c.cover,i=s.default.siteUrl+s.default.pathPrefix+n}else r=s.default.siteTitle,o=s.default.siteDescription,l=s.default.siteLogo;var p="/"===s.default.pathPrefix?"":s.default.pathPrefix;l=s.default.siteUrl+p+l;var d=s.default.siteUrl+s.default.pathPrefix,m=[{"@context":"http://schema.org","@type":"WebSite",url:d,name:r,alternateName:s.default.siteTitleAlt?s.default.siteTitleAlt:""}];return a&&m.push([{"@context":"http://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,item:{"@id":i,name:r,image:l}}]},{"@context":"http://schema.org","@type":"BlogPosting",url:d,name:r,alternateName:s.default.siteTitleAlt?s.default.siteTitleAlt:"",headline:r,image:{"@type":"ImageObject",url:l},description:o}]),u.default.createElement(f.default,null,u.default.createElement("meta",{name:"description",content:o}),u.default.createElement("meta",{name:"image",content:l}),u.default.createElement("script",{type:"application/ld+json"},JSON.stringify(m)),u.default.createElement("meta",{property:"og:url",content:a?i:d}),a?u.default.createElement("meta",{property:"og:type",content:"article"}):null,u.default.createElement("meta",{property:"og:title",content:r}),u.default.createElement("meta",{property:"og:description",content:o}),u.default.createElement("meta",{property:"og:image",content:l}),u.default.createElement("meta",{property:"fb:app_id",content:s.default.siteFBAppID?s.default.siteFBAppID:""}),u.default.createElement("meta",{name:"twitter:card",content:"summary_large_image"}),u.default.createElement("meta",{name:"twitter:creator",content:s.default.userTwitter?s.default.userTwitter:""}),u.default.createElement("meta",{name:"twitter:title",content:r}),u.default.createElement("meta",{name:"twitter:description",content:o}),u.default.createElement("meta",{name:"twitter:image",content:l}))},t}(i.Component);t.default=d,e.exports=t.default},455:function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}t.__esModule=!0,t.pageQuery=void 0;var i=n(1),u=a(i),c=n(44),f=a(c),p=n(164),s=a(p),d=n(117),m=a(d),y=n(30),h=a(y),E="mypc",g=function(e){function t(){return r(this,t),o(this,e.apply(this,arguments))}return l(t,e),t.prototype.render=function(){var e=this.props.data.allMarkdownRemark.edges;return u.default.createElement("div",{className:"index-container"},u.default.createElement(f.default,null,u.default.createElement("title",null,h.default.siteTitle),u.default.createElement("link",{rel:"canonical",href:""+h.default.siteUrl})),u.default.createElement(m.default,{postEdges:e}),u.default.createElement(s.default,{postEdges:e,category:E}))},t}(u.default.Component);t.default=g;t.pageQuery="** extracted graphql fragment **"}});
//# sourceMappingURL=component---src-pages-mypc-jsx-6060d72542d8a498d81c.js.map