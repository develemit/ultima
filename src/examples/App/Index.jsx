import React, { useState } from 'react';
import { string } from 'prop-types';
import { useStore } from '../../hooks/useStore';

function App({ testParam }) {
  // function App({ name, setName, age, setAge }) {
  const [testOne, setTestOne] = useState(null);
  const [testTwo, _setTestTwo] = useState(null);
  const {
    name, setName, age, setAge,
  } = useStore();
  if (testOne) {
    setTestOne('abc');
    return <div>Booga</div>;
  }
  if (testTwo) return <div>Ooga</div>;
  if (testParam) return <div>testing prop</div>;
  return (
    <div className="App">
      <header className="App-header">
        <img src={null} className="App-logo" alt="logo" />
        <p style={{ color: 'white' }}>Hello {name} is this in a container!</p>
        <span>Not your name? Change it below!</span>
        <input
          id="name"
          value={name}
          onChange={({ target: { value } }, { thing }) => setName(value, thing)}
        />
        <input
          id="age"
          value={age}
          onChange={({ target: { value } }) => setAge(value)}
        />
      </header>
    </div>
  );
}

App.propTypes = {
  testParam: string.isRequired,
};

export default App;
