export interface IUserInfo {
  code: string;
  compId: number;
  compName: string;
  createdBy: number;
  deptId: number;
  deptName: string;
  englishName: string;
  isTrial: number;
  loginType: number;
  muteFlag: number;
  name: string;
  officerId: number;
  roleList: string[];
  roleNames: string[];
  supervisorId: number;
  systemVersion: number;
  thirdCompCode: string;
  thirdCompId: number;
  title: string;
  token: string;
  userId: number;
  uuid: string;
  [argName: string]: any;
}
