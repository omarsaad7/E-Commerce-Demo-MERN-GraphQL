import React from 'react';
import ReactLoading from 'react-loading';
import {Styles} from '../General/StaticVariables/Styles.js'

const LoadingIcon = ({ type, color }) => (
    <div style={Styles.loading}>
    <ReactLoading type={type} color={color} height={'20%'} width={'100%'} />
    </div>
);
//  possible type values (
//     blank
//     balls
//     bars
//     bubbles
//     cubes
//     cylon
//     spin
//     spinningBubbles
//     spokes)
export default LoadingIcon;