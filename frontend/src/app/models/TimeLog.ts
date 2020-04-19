import { LogAction } from "./LogAction";

export class TimeLog{
	id:number;
	time:Date;
	action: LogAction;
  userName:string;
  message:string;
	plateNumber?:string;
	carOwnerName?:string;
	parkingLotName?:string;
	sectorName?:string;
	parkHouseName?:string;
}
