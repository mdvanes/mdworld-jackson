import React from 'react';
import {Grid, Cell} from 'react-md';
import DynamicLogo from '../DynamicLogo/DynamicLogo';
import styles from './Hero.module.scss';

// TODO use custom font Delicious
class Hero extends React.Component {
    render() {
        return (
          <Grid className={styles.hero}>
            <Cell size={6} desktopOffset={2}>
              <h1>MDWORLD</h1>
              <h2 style={{}}>a webdevelopment blog, since 2003</h2>
            </Cell>
            <Cell size={2} tabletSize={8} phoneSize={6} className={styles.imgWrapper}>
              <DynamicLogo />
            </Cell>
          </Grid>
        );
    }
}

export default Hero;
