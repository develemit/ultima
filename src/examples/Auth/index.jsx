import React from 'react';
import PropTypes from 'prop-types';

const APPLICATION_ID = 'CCB';

const AuthN = ({
  actionId, successCallBack, failureCallBack, selectedProduct, locale, AuthAction, productsList,
}) => {
  const success = ({ status }) => {
    if (status === 0 || status === 1) {
      successCallBack(status);
    } else {
      failureCallBack(status);
    }
  };
  const product = productsList[selectedProduct];
  const accountNumber = product.account.display_account_number;
  const desc = product.product.description;
  const props = {
    actionId,
    applicationId: APPLICATION_ID,
    cardToken: selectedProduct,
    locale,
    hideHeading: true,
    errorHandler: true,
    onSuccess: success,
    headingClassBg: 'dls-accent-white-01-bg border-b',
    headingClassColor: 'dls-accent-gray-06',
    cardProduct: desc,
    cardLastDigits: accountNumber,
    showLoader: true,
  };
  return (<AuthAction {...props} />);
};
AuthN.propTypes = {
  selectedProduct: PropTypes.string.isRequired,
  actionId: PropTypes.string.isRequired,
  productsList: PropTypes.objectOf(PropTypes.any).isRequired,
  locale: PropTypes.string.isRequired,
  successCallBack: PropTypes.func.isRequired,
  failureCallBack: PropTypes.func.isRequired,
  AuthAction: PropTypes.func.isRequired,
};
export default AuthN;
