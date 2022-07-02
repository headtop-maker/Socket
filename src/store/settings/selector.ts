import TState from '../rootType';

export const getAccuracy = (state: TState) =>
  state.settingFormData.settingsForm.accuracy;

export const getGetDeviceId = (state: TState) => state.settingFormData.deviceID;

export const getRemoteDeviceId = (state: TState) =>
  state.settingFormData.remotedeviceID;

export const getShowInputModal = (state: TState) =>
  state.settingFormData.showInputModal;
