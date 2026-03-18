export interface TwoFactorSetup {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export interface TwoFactorSetupResponse {
  setup: TwoFactorSetup;
  message: string;
}

export interface TwoFactorVerifyRequest {
  code: string;
}

export interface TwoFactorVerifyResponse {
  verified: boolean;
  message: string;
}

export interface TwoFactorStatus {
  enabled: boolean;
  enabledAt?: string;
  backupCodesRemaining?: number;
}

export interface TwoFactorDisableRequest {
  password: string;
  code?: string;
}

export interface RegenerateBackupCodesResponse {
  backupCodes: string[];
  message: string;
}
