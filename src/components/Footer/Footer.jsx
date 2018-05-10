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
          2003-{new Date().getFullYear()} {copyright}
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
            {copyrightLine}
          </div>
          <div className="rss">
            <Link to={url}>
              <Button flat secondary iconClassName="fa fa-rss">
                Subscribe
              </Button>
            </Link>
          </div>
          <div className="based-on">
            <Link to='/about'>
              <Button flat secondary>
                    Attribution and credits
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
