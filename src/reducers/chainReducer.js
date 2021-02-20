const DEFAULT_STATE = {
  web3Instance: null,
  account: null,
  portfolioInstance: null
};

const chainReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case 'SET_WEB3':
      return { ...state, web3Instance: action.data };
    case 'SET_ACCOUNT':
      return { ...state, account: action.data };
    case 'SET_PORTFOLIO_INSTANCE':
      return { ...state, portfolioInstance: action.data };
    default:
      return { ...state };
  }
};

export default chainReducer;
