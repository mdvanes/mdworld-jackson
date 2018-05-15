import React from 'react';
import {Grid, Cell} from 'react-md';
import './Hero.scss';
import logo from './logo.png';

class Hero extends React.Component {
    render() {
        return (
          <Grid className="mdworld-hero">
            <Cell size={6} desktopOffset={2}>
              <h1>MDWORLD</h1>
              <h2>a webdevelopment blog, since 2003</h2>
            </Cell>
            <Cell size={2} tabletSize={8} phoneSize={6} className="img-wrapper">
              <img src={logo} alt="Logo" />
            </Cell>
          </Grid>
        );
    }
}

export default Hero;
