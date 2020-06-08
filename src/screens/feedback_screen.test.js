import React from "react";
import renderer from 'react-test-renderer';

import FeedbackScreen from './feedback_screen'

it('renders correctly', () => {
    const tree = renderer.create(<FeedbackScreen/>).toJSON();
    expect(tree).toMatchSnapshot();
});