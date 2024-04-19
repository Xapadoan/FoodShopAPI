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

export const initResetOutput = {
  reset: 'init',
};

export const onResetConfirmOutput = 'confirm-token';

export const onResetUploadOutput = {
  reset: 'upload',
};

export const resetSessionOutput = {
  success: true,
  restore: 'session',
};

export const readSessionOutput = '42';

export const AuthClientMock = {
  initRegister: jest.fn().mockResolvedValue(iniRegisterOutput),
  onRegisterUpload: jest.fn().mockResolvedValue(onRegisterUploadOutput),
  registerSetupSession: jest.fn().mockResolvedValue(registerSessionOutput),
  initRestore: jest.fn().mockResolvedValue(initRestoreOutput),
  onRestoreUpload: jest.fn().mockResolvedValue(onRestoreUploadOutput),
  restoreSetupSession: jest.fn().mockResolvedValue(restoreSessionOutput),
  initReset: jest.fn().mockResolvedValue(initResetOutput),
  onResetConfirm: jest.fn().mockResolvedValue(onResetConfirmOutput),
  onResetUpload: jest.fn().mockResolvedValue(onResetUploadOutput),
  resetSetupSession: jest.fn().mockResolvedValue(resetSessionOutput),
  deleteSession: jest.fn().mockResolvedValue(1),
  readSession: jest.fn().mockResolvedValue(readSessionOutput),
};

export default jest.fn(() => AuthClientMock);
