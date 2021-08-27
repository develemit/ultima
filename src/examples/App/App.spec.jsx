import { useState } from 'react';
import { useStore } from '../../hooks/useStore';
import App from '.';
import Ultima from '../../ultima';

const setName = jest.fn();
const setAge = jest.fn();

const mockContextValues = {
  name: 'bobo',
  setName,
  setAge,
};

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn((initial, fn = jest.fn()) => [initial, fn]),
}));

jest.mock('../../hooks/useStore', () => ({
  useStore: jest.fn().mockImplementation(() => mockContextValues),
}));

const { ultima, mockUseState, mockSetContext } = new Ultima({
  Component: App,
  mockContextValues,
  setContext: useStore,
  useState,
  config: {
    expectParam: setName,
  },
});

const tests = [
  {
    title: 'prop test',
    props: { testProp: 'dingo' },
    expectProp: 'testProp',
    expectFunc: 'toHaveBeenCalledWith',
    expected: 'dingo',
  },
  {
    title: 'name',
    find: '#name',
    debug: true,
    changes: [
      {
        title: 'to bob',
        event: 'onChange',
        debug: true,
        value: [{ target: { value: 'bob' } }, { thing: 'bingo' }],
      },
      {
        title: 'to blah',
        event: 'onChange',
        value: [{ target: { value: 'blah' } }, { thing: 'bingo' }],
      },
    ],
    expected: [{ args: ['bob', 'bingo'] }, { args: ['blah', 'bingo'] }],
  },
  {
    title: 'age',
    find: '#age',
    changes: [
      {
        title: 'to 40',
        event: 'onChange',
        value: { target: { value: 40 } },
      },
    ],
    expectParam: setAge,
    expected: 40,
  },
  {
    title: 'exports a function by default',
    mock: 'error mock',
    expectParam: App,
    expectFunc: 'toBeTruthy',
  },
  {
    title: 'returns Booga ',
    mock: () => mockUseState([true, jest.fn()], [false, jest.fn()]),
    render: ({ comp }) => expect(comp.text()).toEqual('Booga'),
  },
  {
    title: 'returns Ooga ',
    mock: () => mockUseState([false, jest.fn()], [true, jest.fn()]),
    render: ({ comp }) => expect(comp.text()).toEqual('Ooga'),
  },
  {
    title: 'testing context ',
    mock: () => mockSetContext({ name: 'Bingo' }),
    render: () => {
      const { name } = mockSetContext({ name: 'Bingo' });
      expect(name).toEqual('Bingo');
    },
  },
];
ultima(tests);
