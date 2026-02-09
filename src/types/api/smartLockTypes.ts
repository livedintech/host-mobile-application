export interface smartLockApiResponseType {
  status: string;
  message: string;
  data: {

  };
}

export interface smartLockConnectPayloadType {
  username: string,
  password:string
}

export interface smartLockActiveCodesPayloadType {
  lockId: number
}

export interface smartLockGeneratePasscodePayloadType {
  lockId: number;
  keyboardPwdType?: number | string;
  keyboardPwdName?: string;
  start_date?: string;
  start_time?: string;
  end_date?: string;
  end_time?: string;
}