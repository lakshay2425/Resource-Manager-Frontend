let onTokenAuthFailure = null;

export const registerTokenAuthFailureHandler = (handler) => {
  onTokenAuthFailure = handler;
};

export const notifyTokenAuthFailure = () => {
  onTokenAuthFailure?.();
};
