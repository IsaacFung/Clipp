import React from "react";
import renderer from 'react-test-renderer';

import MatchScreen from './match_screen'

it('renders correctly', () => {
    const tree = renderer.create(<MatchScreen/>).toJSON();
    expect(tree).toMatchSnapshot();
});