import renderComp from './renderComp';

const findComp = ({ Component, props }, find) => {
  const comp = renderComp(props, Component);
  let target = comp;
  let name;
  if (Array.isArray(find)) {
    find.forEach((f) => {
      if (typeof f === 'function') ({ name } = f);
      target = target.find(name || f);
    });
  } else {
    if (typeof f === 'function') ({ name } = find);
    target = target.find(name || find);
  }
  return target;
};

const getComponent = ({
  Component, props, find, changeFind,
}) => {
  let comp = renderComp(props, Component);
  if (find) comp = findComp({ Component, props }, find);
  if (changeFind) comp = findComp({ Component, props }, changeFind);
  return comp;
};

const changeHelper = ({
  find,
  changeFind,
  Component,
  mock,
  props = {},
  event,
  value,
  at,
  simulate: simulateArgs,
  changeTitle,
}) => {
  if (mock) {
    mock();
    mock();
  }
  const comp = getComponent({
    Component,
    props,
    find,
    changeFind,
    changeTitle,
  });
  let compProps;
  try {
    if (at >= 0 && simulateArgs) {
      comp.at(at).simulate(...simulateArgs);
      return comp;
    }

    if (at >= 0) compProps = comp.at(at).props();
    else compProps = comp.props();

    if (!compProps) throw new Error('Ultima: Unable to find Component!');

    if (Array.isArray(value)) {
      compProps[event](...value);
    } else if (event) {
      compProps[event](value);
    }
  } catch (e) {
    console.error(
      'Ultima Error ->',
      e?.message,
      '\nthe test ->',
      changeTitle,
      '\nthe component ->',
      Component?.name,
      '\nthe props ->',
      compProps,
      '\nthe event ->',
      JSON.stringify(event)
    );
  }
  return comp;
};

export default changeHelper;
