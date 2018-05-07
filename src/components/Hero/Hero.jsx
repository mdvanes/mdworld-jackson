import React from 'react';
import {Grid, Cell} from 'react-md';
import { withPrefix } from 'gatsby-link';
import './Hero.scss';

/*
<div className="md-grid md-grid--no-spacing md-cell--middle mdworld-hero">
    <div className="md-grid md-cell--5 mobile-fix">
        <h1>MDWORLD</h1>
        <h2>a webdevelopment blog, since 2003</h2>
    </div>
    <div className="md-grid md-cell--3 mobile-fix">
        <h1>MDWORLD</h1>
        <h2>a webdevelopment blog, since 2003</h2>
    </div>
</div>
*/

class Hero extends React.Component {
    render() {
        return (
          <Grid className="mdworld-hero">
            <Cell size={6} offset={2}>
              <h1>MDWORLD</h1>
              <h2>a webdevelopment blog, since 2003</h2>
            </Cell>
            <Cell size={2}>
                <img src={withPrefix('/logos/logo-192.png')} alt="Logo" />
            </Cell>
          </Grid>
        );
    }
}

export default Hero;
