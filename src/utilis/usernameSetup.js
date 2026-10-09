let onUsernameSetupRequired = null;

export const registerUsernameSetupRequiredHandler = (handler) => {
  onUsernameSetupRequired = handler;
};

export const notifyUsernameSetupRequired = (suggestedUsername) => {
  onUsernameSetupRequired?.(suggestedUsername);
};

export const isUsernameSetupRequiredError = (error) =>
  error?.response?.data?.code === 'USERNAME_SETUP_REQUIRED';
