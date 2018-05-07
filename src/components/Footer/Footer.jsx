import React, { Component } from "react";
import Button from "react-md/lib/Buttons";
import Link from "gatsby-link";
import FontIcon from "react-md/lib/FontIcons";
import UserLinks from "../UserLinks/UserLinks";
import config from "../../../data/SiteConfig";
import "./Footer.scss";

class Footer extends Component {
  render() {
    const url = config.siteRss;
    const { userLinks } = this.props;
    const { copyright, fixedFooter } = config;
    const copyrightLine = (
      <a href="https://creativecommons.org/licenses/by-nc-sa/3.0/">
        <Button flat secondary iconClassName="fa fa-creative-commons">
          {new Date().getFullYear()} {copyright}
        </Button>
      </a>
    );
    if (!copyright) {
      return null;
    }
    return (
      <footer className={fixedFooter ? "footer footer-fixed" : "footer"}>
        {userLinks ? <UserLinks config={config} labeled /> : null}
        <div className="notice-container">
          <div className="copyright">
            <h4>
              {copyrightLine}
            </h4>
          </div>

          <div className="rss">
            <Link to={url}>
              <Button flat secondary iconClassName="fa fa-rss">
                Subscribe
              </Button>
            </Link>
          </div>
          <div className="based-on">
            <h4>
              Based on{" "}
              <a href="https://github.com/Vagr9K/gatsby-material-starter">
                Gatsby Material Starter
              </a>.
            </h4>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
