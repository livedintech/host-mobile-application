export interface smartLockApiResponseType {
  status: string;
  message: string;
  data: {

  };
}

export interface smartLockConnectPayloadType {
  username: string,
  password:string,
  timezone: string;
}

export interface smartLockMappingAssignPayloadType {
  lock_id: number,
  listing_id:string,
  account_id:number
}
export interface smartLockMappingUnAssignPayloadType {
  lock_id: number,

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