export function setInvestmentFundInstance(data) {
  return (dispatch) => {
    dispatch({
      type: 'SET_INVESTMENT_FUND_INSTANCE',
      data
    });
  };
}
