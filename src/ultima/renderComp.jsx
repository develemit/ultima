import React from 'react';
import { shallow } from 'enzyme';

const renderComp = (props, Component) => shallow(<Component {...props} />);

export default renderComp;
