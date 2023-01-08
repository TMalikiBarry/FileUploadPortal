export interface ApiResponse {
  timeStamp: string
  statusCode: number;
  status: string
  message: string;
  data: Object | Object[];
}
