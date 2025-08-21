export interface StampInfo {
  logo: string;
  name: string;
}

export interface VisitResponseData {
  coffeecoins_earned: number;
  stamp: StampInfo;
}

export interface ValidateVisitResponse {
  message: string;
  data: VisitResponseData;
}

export interface ValidateVisitInput {
  branchId: string;
  latitude: number;
  longitude: number;
}