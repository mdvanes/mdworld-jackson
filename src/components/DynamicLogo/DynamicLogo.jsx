import React from 'react';
import styles from './DynamicLogo.module.scss';

const DynamicLogo = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 694 586"
      className={styles.svg}
    >
      <title>The mdworld.nl logo</title>
      <defs>
        <linearGradient id="b">
          <stop offset="0" stopColor="#1b561b" />
          <stop offset="1" stopColor="#267626" />
        </linearGradient>
        <linearGradient
          id="c"
          x1="351.86"
          x2="350.941"
          y1="657.606"
          y2="508.861"
          gradientTransform="matrix(3.73431 0 0 3.73431 -969.841 -1888.906)"
          gradientUnits="userSpaceOnUse"
          xlinkHref="#b"
        />
      </defs>
      <path
        fill="url(#c)"
        stroke="#232323"
        strokeWidth="17.403"
        d="M163.79 173.12l-35.343 180.715L577.23 16.413l102.027 546.81-343.357-259.901 71.452-57.516 135.87 106.028-36.01-187.382-494.13 400.105L119.111 17.08l222.792 176.046-74.586 56.681z"
      />
    </svg>);
};

export default DynamicLogo;