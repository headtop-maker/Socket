interface ISettingsForm {
  accuracy: number;
}
export interface ISettings {
  settingsForm: ISettingsForm;
  remotedeviceID: string;
  deviceID: string;
  showInputModal: boolean;
}
