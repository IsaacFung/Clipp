import React from "react";
import renderer from 'react-test-renderer';

import ImageUpload from './image_upload'

it('renders correctly', () => {
    const tree = renderer.create(<ImageUpload/>).toJSON();
    expect(tree).toMatchSnapshot();
});