export const iniRegisterOutput = {
  register: 'init',
};

export const onRegisterUploadOutput = {
  register: 'upload',
  webhook: true,
};

export const registerSessionOutput = {
  success: true,
  register: 'session',
};

export const initRestoreOutput = {
  restore: 'init',
};

export const onRestoreUploadOutput = {
  restore: 'upload',
  webhook: true,
};

export const restoreSessionOutput = {
  success: true,
  restore: 'session',
};

export const AuthClientMock = {
  initRegister: jest.fn().mockResolvedValue(iniRegisterOutput),
  onRegisterUpload: jest.fn().mockResolvedValue(onRegisterUploadOutput),
  registerSetupSession: jest.fn().mockResolvedValue(registerSessionOutput),
  initRestore: jest.fn().mockResolvedValue(initRestoreOutput),
  onRestoreUpload: jest.fn().mockResolvedValue(onRestoreUploadOutput),
  restoreSetupSession: jest.fn().mockResolvedValue(restoreSessionOutput),
};

export default jest.fn(() => AuthClientMock);
