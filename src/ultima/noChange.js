import renderComp from './renderComp';

const noChange = (args) => {
  const {
    // title,
    find,
    mock,
    props = {},
    Component,
    expectFunc,
    // expectProp,
    expectParam,
    render,
  } = args;
  if (mock) mock();
  let comp = renderComp(props, Component);
  if (find) comp = comp.find(find);

  if (render) {
    return render({
      comp,
      main: renderComp(props, Component),
      raw: Component,
    });
  }

  // if (expectProp) { // * A future enhancement
  //   expect(comp.props()[expectProp])[expectFunc](args.expected);
  //   return undefined;
  // }
  if ('expected' in args) {
    expect(expectParam || comp)[expectFunc](args.expected);
    return undefined;
  }
  expect(expectParam || comp)[expectFunc]();
  return undefined;
};

export default noChange;
