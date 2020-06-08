import React from "react";
import renderer from 'react-test-renderer';

import UploadScreen from './upload_screen'

it('renders correctly', () => {
    const tree = renderer.create(<UploadScreen/>).toJSON();
    expect(tree).toMatchSnapshot();
});