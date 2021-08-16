import type React from 'react';

export interface IApproveLogItem {
  actName: string;
  activityId: string;
  approveStatus: number;
  approveStatusName: string;
  assignee: string;
  assigneesName: string;
  businessId: number;
  comment: string | any;
  createAt: string;
  delayedTime: number;
  formId: number;
  id: number;
  lastApproveTime: string;
  piId: string;
  status: number;
  tableName: string;
  updateAt: string;
  key: React.Key;
}

export interface IOPINION {
  createAt: string;
  createBy: number;
  id: number;
  opinionInfo: string;
  status: number;
  updateAt: string;
  userId: number;
}

export interface ITASKLIST {
  activityId: string;
  activityName: string;
  formId: number;
}
