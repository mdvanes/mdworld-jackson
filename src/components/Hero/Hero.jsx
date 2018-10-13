import React from 'react';
import {Grid, Cell} from 'react-md';
import DynamicLogo from '../DynamicLogo/DynamicLogo';
import './Hero.scss';

// TODO use custom font Delicious
class Hero extends React.Component {
    render() {
        return (
          <Grid className="mdworld-hero">
            <Cell size={6} desktopOffset={2}>
              <h1>MDWORLD</h1>
              <h2 style={{marginLeft:'0.4rem'}}>a webdevelopment blog, since 2003</h2>
            </Cell>
            <Cell size={2} tabletSize={8} phoneSize={6} className="img-wrapper">
              <DynamicLogo />
            </Cell>
          </Grid>
        );
    }
}

export default Hero;
