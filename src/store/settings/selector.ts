import TState from '../rootType';

export const getAccuracy = (state: TState) =>
  state.settingFormData.settingsForm.accuracy;

export const getGetDeviceId = (state: TState) => state.settingFormData.deviceID;

export const getRemoteDeviceId = (state: TState) =>
  state.settingFormData.remotedeviceID;

export const getShowInputModal = (state: TState) =>
  state.settingFormData.showInputModal;

export const getConnectionType = (state: TState) =>
  state.settingFormData.connectionSate.type;

export const getConnectionConnected = (state: TState) =>
  state.settingFormData.connectionSate.isConnected;

export const getIpAddress = (state: TState) =>
  state.settingFormData.connectionSate.ipAddress;
