import { LogAction } from "./LogAction";

export class TimeLog{
	id:number;
	time:Date;
	action: LogAction;
  userName:string;
  message:string;
  parkHouseId:number;
  parkHouseFreePlCount:number;
	parkHouseOccupiedPlCount:number;
}
