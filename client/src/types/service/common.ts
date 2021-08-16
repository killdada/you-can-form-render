export interface IStaff {
  code: string;
  compId: number | string;
  compName: string;
  deptId: number | string;
  deptName: string;
  englishName: string;
  id: number | string;
  name: string;
}

export interface IOrg {
  compId: number;
  compName: string;
  id: number | string;
  name: string;
  parentDeptId: number | string;
}
