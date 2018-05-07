module.exports = {
  blogPostDir: "posts", // The name of directory that contains your posts.
  siteTitle: "MDWorld", // Site title.
  siteTitleAlt: "MDWorld, a webdevelopment blog", // Alternative site title for SEO.
  siteLogo: "/logos/logo-1024.png", // Logo used for SEO and manifest.
  siteUrl: "https://vagr9k.github.io", // Domain of your website without pathPrefix.
  pathPrefix: "/gatsby-material-starter", // Prefixes all links. For cases when deployed to example.github.io/gatsby-material-starter/.
  fixedFooter: false, // Whether the footer component is fixed, i.e. always visible
  siteDescription: "A GatsbyJS stater with Material design in mind.", // Website description used for RSS feeds/meta description tag.
  siteRss: "/rss.xml", // Path to the RSS file.
  siteFBAppID: "1825356251115265", // FB Application ID for using app insights
  siteGATrackingID: "UA-47311644-4", // Tracking code ID for google analytics.
  disqusShortname: "https-vagr9k-github-io-gatsby-material-starter", // Disqus shortname.
  postDefaultCategoryID: "Tech", // Default category for posts.
  userName: "M.D. van Es", // Username to display in the author segment.
  // userTwitter: "", // Optionally renders "Follow Me" in the UserInfo segment.
  // userLocation: "North Pole, Earth", // User location to display in the author segment.
  userAvatar: "/logos/logo-1024.png", // User avatar to display in the author segment.
  // userDescription:
  //   "See my LinkedIn.", // User description to display in the author segment.
  // Links to social profiles/projects you want to display in the author segment/navigation bar.
  userLinks: [
    {
      label: "GitHub",
      url: "https://github.com/mdvanes",
      iconClassName: "fa fa-github"
    },
    {
      label: "Bitbucket",
      url: "https://bitbucket.org/mdvanes",
      iconClassName: "fa fa-bitbucket"
    },
    {
      label: "Twitter",
      url: "https://twitter.com/mdworldnl",
      iconClassName: "fa fa-twitter"
    },
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/mdvanes/",
      iconClassName: "fa fa-linkedin"
    },
    // {
    //   label: "Email",
    //   url: "mailto:example@example.com",
    //   iconClassName: "fa fa-envelope"
    // }
  ],
  copyright: "MDWorld" // Copyright string for the footer of the website and RSS feed.
};
