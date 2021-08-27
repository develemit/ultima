const MockDebug = ({
  title, props, mock, setContext,
}) => {
  console.log(`Current Test Title - ${title}`);
  console.log(`${title} - Props -`, props);
  if (mock && typeof mock === 'function') {
    const mockContents = mock.toString();
    console.log(`${title} Mock Function -`, mockContents);
    mock();
  } else {
    console.log(
      `Ultima-React: "mock" function not present, skipping for test "${title}"`
    );
  }
  if (setContext) {
    if (typeof setContext === 'function') {
      console.log(`${title} -Context values -`, setContext());
    } else {
      console.error(
        `Ultima-React: please ensure "setContext" is a function for test ${title}`
      );
    }
  }
};

export default MockDebug;
