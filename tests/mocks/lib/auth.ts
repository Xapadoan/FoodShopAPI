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

export const AuthClientMock = {
  initRegister: jest.fn().mockResolvedValue(iniRegisterOutput),
  onRegisterUpload: jest.fn().mockResolvedValue(onRegisterUploadOutput),
  registerSetupSession: jest.fn().mockResolvedValue(registerSessionOutput),
};

export default jest.fn(() => AuthClientMock);
