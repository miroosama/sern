export function setWeb3(data) {
  return (dispatch) => {
    dispatch({
      type: 'SET_WEB3',
      data
    });
  };
}

export function setAccount(data) {
  return (dispatch) => {
    dispatch({
      type: 'SET_ACCOUNT',
      data
    });
  };
}

export function setPortfolioInstance(data) {
  return (dispatch) => {
    dispatch({
      type: 'SET_PORTFOLIO_INSTANCE',
      data
    });
  };
}
