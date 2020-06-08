import React from "react";
import renderer from 'react-test-renderer';

import LandingScreen from './landing_screen'

it('renders correctly', () => {
    const tree = renderer.create(<LandingScreen/>).toJSON();
    expect(tree).toMatchSnapshot();
});