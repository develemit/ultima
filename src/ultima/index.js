import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import noChange from './noChange';
import expectArray from './expectArray';
import MockDebug from './MockDebug';

Enzyme.configure({ adapter: new Adapter() });
// process.on('unhandledRejection', (err) => null);
/**
 * Customizable test runner
 * @constructor
 * @typedef {object} ultimaConfig
 * @param {Component} ultimaConfig.Component component to test
 * @param {object} ultimaConfig.mockContextValues default values for your context
 * @param {function} ultimaConfig.setContext mocked function used to invoke your context
 * @param {function} ultimaConfig.beforeEach function to be executed before each test suite
 * @param {object} [ultimaConfig.defaultProps="{}"] Props to be provided to your mock scenarios
 * @param {object} [ultimaConfig.config="{}"] default values for your tests
 * @returns {object} { ultima, mockSetContext, mockUseState}
 * @typedef {function} ultima
 * }
 */

function Ultima(ultimaConfig = {}) {
  try {
    const {
      Component,
      mockContextValues = {},
      setContext = undefined,
      defaultProps = {},
      config: defaultConfig = {},
      beforeEach: userBeforeEach = () => null,
      afterEach: userAfterEach = () => null,
      useState,
    } = ultimaConfig;

    const mockSetContext = setContext
      ? (customStoreState) => {
        const newContext = {
          ...mockContextValues,
          ...customStoreState,
        };
        setContext.mockImplementationOnce(() => newContext);
      }
      : () => console.error('No setContext Provided for mocking.');

    const mockUseState = (...mockStates) => {
      useState.mockClear();
      mockStates.forEach(([key, val]) => {
        try {
          return useState.mockImplementationOnce(() => [key, val || jest.fn()]);
        } catch (e) {
          return console.error(
            'Ultima-React: "useState" appears to not be mocked. Please mock "useState" and include it as a key in the \'ultimaConfig\' argument of "Ulitma".'
          );
        }
      });
    };
    return {
      ultima: (tests) => tests.forEach((config) => {
        const testFunc = () => {
          const {
            mock,
            debug,
            title,
            find,
            id,
            props: testProps,
            beforeEach: changesBeforeEach = () => null,
            changes = [],
            expectParam,
            expectProp,
            expectFunc = 'toHaveBeenCalledWith',
            expected,
            render,
          } = { ...defaultConfig, ...config };

          describe(`${Component.name || 'Ultima Test'}`, () => {
            beforeEach(() => {
              try {
                userBeforeEach();
              } catch (e) {
                console.error('Ultima-React: beforeEach error ->', e);
              }
              if (setContext) {
                setContext.mockImplementation(() => mockContextValues);
              }
            });
            afterEach(() => {
              try {
                userAfterEach();
              } catch (e) {
                console.error('Ultima-React: afterEach error ->', e);
              }
            });
            const CleanComp = Component;
            const cleanTitle = title;
            const cleanId = id;
            const cleanFind = find;
            const cleanChanges = changes;
            const cleanProps = testProps;
            const cleanConfig = config;
            const cleanMock = mock;
            const cleanDebug = debug;
            const cleanExpectFunc = expectFunc;
            const cleanExpectParam = expectParam;
            const cleanExpectProp = expectProp;
            const cleanExpected = expected;
            const cleanRender = render;

            const props = { ...defaultProps, ...cleanProps };

            if (cleanDebug) {
              MockDebug({
                title: cleanTitle,
                props,
                mock: cleanMock,
                setContext,
              });
            }

            if (cleanChanges.length > 0) {
              describe(cleanTitle, () => {
                expectArray(
                  {
                    ...defaultConfig,
                    ...cleanConfig,
                    title: cleanTitle,
                    find:
                        cleanFind || (cleanId && `#${cleanId}`) || undefined,
                    changesBeforeEach,
                    changes: cleanChanges,
                    expectFunc: cleanExpectFunc,
                    props,
                    setContext,
                    mock: cleanMock,
                    mockContextValues,
                    expectParam: cleanExpectParam,
                    expected: cleanExpected,
                    render: cleanRender,
                  },
                  CleanComp
                );
              });
              return undefined;
            }

            it(cleanTitle, () => {
              if (changes.length === 0) {
                noChange({
                  title: cleanTitle,
                  find: cleanFind || (cleanId && `#${cleanId}`) || undefined,
                  mock: cleanMock,
                  props,
                  Component: CleanComp,
                  expectFunc: cleanExpectFunc,
                  expectProp: cleanExpectProp,
                  expectParam: cleanExpectParam,
                  render: cleanRender,
                  expected,
                });
                return undefined;
              }
              return undefined;
            });
            return undefined;
          });
        };
        testFunc();
      }),
      mockSetContext,
      mockUseState,
    };
  } catch (e) {
    console.log('\u001B[32m', '\u001B[3m', 'Ultima Catch Error:', e);
  }
}

export default Ultima;
