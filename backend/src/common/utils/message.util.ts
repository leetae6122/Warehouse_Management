//////    Error message    //////
export const MSG_TOKEN_DOES_NOT_MATCH = 'Token does not match';
export const MSG_INVALID_TOKEN = 'Invalid token';
export const MSG_REFRESH_TOKEN_DOES_NOT_MATCH = 'Refresh Token does not match';
export const MSG_ERROR_CREATE_TOKEN = 'Token generation error';
export const MSG_EMPTY_HASH_DATA = 'Empty hash data';
export const MSG_ERROR_HASHING_DATA = 'Error hashing data';
export const MSG_EMPTY_COMPARE_DATA = 'Empty compare data';
export const MSG_UPDATE_FAIL = 'Update fail';
export const MSG_DATABASE_ERROR = 'Database operation failed';
////// COMMON  //////
export const MSG_NOT_FOUND = (e: string) => `${e} not found`;
export const MSG_CREATED_SUCCESSFUL = (e: string) =>
  `${e} created successfully`;
export const MSG_UPDATED_SUCCESSFUL = (e: string) =>
  `${e} updated successfully`;
export const MSG_DELETED_SUCCESSFUL = (e: string) =>
  `${e} deleted successfully`;
////// AUTH API //////
// Success messages
export const MSG_LOGIN_SUCCESSFUL = 'Logged in successfully';
export const MSG_REGISTER_SUCCESSFUL = 'Account created successfully!';
export const MSG_LOGOUT_SUCCESSFUL = 'Successful logout';
export const MSG_REFRESH_TOKEN_SUCCESSFUL = 'Refresh token successful';
// Error messages
export const MSG_WRONG_LOGIN_INFORMATION =
  'Your username/password is incorrect';
export const MSG_USERNAME_EMPTY =
  'The username cannot be empty. Please enter your username';
export const MSG_PASSWORD_EMPTY =
  'The password cannot be empty.. Please enter your password';
////// USER API //////
// Success messages

// Error messages
// export const MSG_CURRENT_PASS_MUST_DIFFERENT_NEW_PASS =
//   'New Password must be different from your Current Password';
// export const MSG_CURRENT_PASSWORD_INCORRECT = 'Current password incorrect!';
export const MSG_USER_EXISTS = 'User already exists';
export const MSG_USER_NOT_OWNER = 'You are not the owner of this user';
