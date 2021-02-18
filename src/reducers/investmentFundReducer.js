const DEFAULT_STATE = {
  investmentFundInstance: null
};

const investmentFundReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case 'SET_INVESTMENT_FUND_INSTANCE':
      return { ...state, investmentFundInstance: action.data };
    default:
      return { ...state };
  }
};

export default investmentFundReducer;
