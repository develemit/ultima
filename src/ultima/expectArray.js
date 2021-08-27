/* eslint-disable complexity */
import changeHelper from './changeHelper';
import renderComp from './renderComp';
import MockDebug from './MockDebug';

const expectArray = (args, Component) => {
  const {
    mock: parentMock,
    title,
    find: parentFind,
    changes,
    expectParam,
    changesBeforeEach,
    expectFunc = ['toHaveBeenCalledWith'],
    expected,
    mockContextValues,
    setContext,
    props: parentProps,
    render,
  } = args;
  const compsArray = [];
  try {
    beforeEach(() => {
      changesBeforeEach();
    });
    changes.forEach(
      (
        {
          title: changeTitle,
          find: changeFind,
          event,
          value,
          values,
          props: changeProps,
          mock: changeMock,
          debug,
          expectParam: changeExpectParam,
          expectFunc: changeExpectFunc = expectFunc,
          expected: changeExpected,
          ...rest
        },
        i
      ) => {
        const props = { ...parentProps, ...changeProps };
        const mock = changeMock || parentMock;
        if (debug) {
          const combinedTitle = `${title} -> ${changeTitle}`;
          MockDebug({
            title: combinedTitle,
            props,
            mock: changeMock,
            setContext,
          });
        }

        const changeHelperArgs = {
          changeTitle,
          find: parentFind || undefined,
          changeFind,
          Component,
          mock,
          event,
          value,
          props,
          ...rest,
        };

        if (render) {
          const comp = changeHelper(changeHelperArgs);

          compsArray.push({
            comp,
            main: renderComp(props, Component),
            raw: Component,
            props,
          });
          return undefined;
        }

        if (values) {
          describe(changeTitle || event, () => {
            values.forEach((val, k) => {
              if (
                !changeExpectFunc
                || !Array.isArray(changeExpectParam)
                || (typeof changeExpectFunc !== 'string'
                  && !Array.isArray(changeExpectFunc))
                || (!changeExpected && changeExpected !== undefined)
                || (changeExpected && !Array.isArray(changeExpected))
              ) {
                throw new Error(
                  'Ultima-React: If you are using "values" in your changes,',
                  'you need to provide an array for "expectParam/expected" and "expectFunc" if applicable.'
                );
              }
              const valueTitle = JSON.stringify(val);

              it(`${
                valueTitle.length > 20
                  ? `${valueTitle.slice(0, 20)}...`
                  : valueTitle
              }`, () => {
                if (changeExpectParam && Array.isArray(changeExpectParam)) {
                  changeExpectParam[k].mockClear();
                }
                changeHelper({ ...changeHelperArgs, value: val });

                if (render) {
                  let comp = renderComp(props, Component);
                  if (parentFind) comp = comp.find(parentFind);

                  compsArray.push({
                    comp,
                    main: renderComp(props, Component),
                    raw: Component,
                  });
                  return compsArray;
                }

                let changeExpectedFunc = changeExpectFunc;
                if (Array.isArray(changeExpectFunc)) {
                  changeExpectedFunc = changeExpectFunc[k];
                }
                if (changeExpected) {
                  expect(changeExpectParam[k])[changeExpectedFunc](
                    changeExpected[k]
                  );
                } else expect(changeExpectParam[k])[changeExpectedFunc]();

                return undefined;
              });
            });
          });
          return undefined;
        }

        it(changeTitle || event, () => {
          let expectedParam = expectParam;
          let expectedFunc = expectFunc;
          let expectedResult = expected;
          if (changes.length > 1) {
            if (Array.isArray(expectFunc)) {
              expectedFunc = expectFunc[i];
            }
            if (Array.isArray(expected)) expectedResult = expected[i];
            if (expectedParam) {
              if (Array.isArray(expectedParam)) {
                expectedParam = expectedParam[i];
              }
            }
            if (typeof expectedParam === 'string') {
              expectedParam = mockContextValues[expectedParam];
            }
          }
          if (expectedParam && expectedParam.mockClear) {
            expectedParam.mockClear();
          }

          const comp = changeHelper(changeHelperArgs);

          if (render) {
            compsArray.push({
              comp,
              main: renderComp(props, Component),
              raw: Component,
            });
            return compsArray;
          }
          if ('expected' in args) {
            if (
              typeof expectedResult === 'object'
              && 'args' in expectedResult
              && expectedResult.args.length > 0
            ) {
              expect(expectedParam)[expectedFunc](...expectedResult.args);
            } else {
              expect(expectedParam)[expectedFunc](expectedResult);
            }
          } else {
            expect(expectedParam)[expectedFunc]();
          }
          return undefined;
        });
        return undefined;
      }
    );
  } catch (e) {
    console.log('Error with expectArray!', e);
  }
  if (render) {
    return render(compsArray);
  }
  return undefined;
};

export default expectArray;
