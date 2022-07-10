export interface ISettingsForm {
  accuracy: number;
}

export interface IConnectionState {
  ipAddress: string;
  isConnected: boolean;
  isInternetReachable: boolean;
  isWifiEnabled: boolean;
  type: string;
}

export interface ISettings {
  settingsForm: ISettingsForm;
  remotedeviceID: string;
  deviceID: string;
  showInputModal: boolean;
  connectionSate: IConnectionState;
}
