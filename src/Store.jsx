/* eslint-disable react/no-children-prop */
import React, { useState, createContext } from 'react';
import { oneOfType, arrayOf, shape } from 'prop-types';

export const StoreContext = createContext({});

const Store = ({ children }) => {
  const [name, setName] = useState('billy');
  const [age, setAge] = useState(50);
  const context = {
    name,
    setName,
    age,
    setAge,
  };
  return <StoreContext.Provider value={context} children={children} />;
};

Store.propTypes = {
  children: oneOfType([arrayOf(shape({})), shape({})]),
};
Store.defaultProps = {
  children: <div />,
};

export default Store;
