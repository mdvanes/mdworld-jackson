import React, { Component } from "react";
import Card from "react-md/lib/Cards/Card";
import CardText from "react-md/lib/Cards/CardText";
import Link from "gatsby-link";
import config from "../../../data/SiteConfig";
import "./About.scss";

class About extends Component {
  render() {
    return (
      <div className="about-container md-grid mobile-fix">
        <Card className="md-grid md-cell--8">
          <div className="about-wrapper">
            <img
              src={config.userAvatar}
              className="about-img"
              alt={config.userName}
            />
            <CardText>
              <p className="about-text md-body-1">{config.userDescription}</p>
              <p>
                  Generated with <a href="https://www.gatsbyjs.org">Gatsby</a>.<br />
                  Build by Travis CI.<br />
                  Hosting on Github Pages.<br />
                  Source control on <a href="https://github.com/mdvanes/mdworld-jackson">Github</a>.<br />
                  Theme based on <a href="https://github.com/Vagr9K/gatsby-material-starter">Gatsby Material Starter</a>.<br />
                  <Link to="/site-updated/">Read more</Link> about the technology behind this blog.
              </p>
            </CardText>
            {/*<UserLinks labeled config={config} />*/}
          </div>
        </Card>
      </div>
    );
  }
}

export default About;
