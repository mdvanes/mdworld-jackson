import React, { Component } from "react";
import Helmet from "react-helmet";
import Card from "react-md/lib/Cards/Card";
import CardText from "react-md/lib/Cards/CardText";
import config from "../../data/SiteConfig";

function isLiftDomain() {
  return typeof window !== 'undefined' &&
    (window.location.host.split('.')[0] === 'lift' || window.location.href.indexOf('lift') > -1);
}

class NotFoundPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '404 Page Not Found'
    };
  }

  componentWillMount() {
    if(isLiftDomain()) {
      this.setState({message: 'You are being redirected to LIFT...'});
      setTimeout(() => {
        window.location.href = 'https://mdvanes.github.io/mdworld-simon/scriptie/';
      }, 1000);
    }
  }

  render() {
    return (
      <div className="about-container">
        <Helmet>
          <title>{`About | ${config.siteTitle}`}</title>
          <link rel="canonical" href={`${config.siteUrl}/about/`} />
        </Helmet>
        <div className="md-grid mobile-fix">
          <Card className="md-grid md-cell--8">
            <CardText>
              <h1>{this.state.message}</h1>
            </CardText>
          </Card>
        </div>
      </div>
    );
  }
}

export default NotFoundPage;
