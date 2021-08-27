import Ultima from '../../ultima';
import AuthN from '.';

const successCallBack = jest.fn();
const failureCallBack = jest.fn();

const defaultProps = {
  actionId: '',
  successCallBack,
  failureCallBack,
  selectedProduct: 'aa11',
  locale: '',
  AuthAction: () => null,
  productsList: { aa11: { account: {}, product: { description: '' } } },
};

const { ultima } = new Ultima({
  Component: AuthN,
  defaultProps,
});

const tests = [
  {
    title: 'successCallBack',
    find: 'AuthAction',
    changes: [
      {
        title: 'status',
        event: 'onSuccess',
        values: [{ status: 1 }, { status: 1 }, { status: 2 }],
        expectParam: [successCallBack, successCallBack, failureCallBack],
        expected: [1, 1, 2],
      },
    ],
  },
];

ultima(tests);
