export interface ISettingsForm {
  accuracy: number;
}

export interface IModalState {
  showModal: boolean;
  message: string;
}

export interface IConnectionState {
  ipAddress: string;
  isConnected: boolean;
  isInternetReachable: boolean;
  isWifiEnabled: boolean;
  type: string;
}

export interface ICurrentFileParams {
  fileName: string;
  fileType: string;
  fileByteSize: number;
  fileUri: string;
}

export interface ISettings {
  settingsForm: ISettingsForm;
  remotedeviceID: string;
  deviceID: string;
  showInputModal: boolean;
  connectionSate: IConnectionState;
  currentFileParams: ICurrentFileParams;
  modalState: IModalState;
}
