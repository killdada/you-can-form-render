/**
 * @export
 * @interface IDataBase
 */
export interface IDataBase {
  tableName: string;
  tableComment: string;
}

/**
 * @export
 * @interface IDataBase
 */
export interface IDataBaseParams {
  paramName: string;
  paramComment: string;
}

/**
 * @export
 * @interface IThirdDataBase
 */
export interface IThirdDataBase {
  id: number;
  appName: string;
  appUrl: string;
  remark: string;
  createBy: number;
  createAt: string;
  updateAt: string;
  status: number;
}

/**
 * @export
 * @interface IThirdDataBaseApis
 */
export interface IThirdDataBaseApis {
  appId: number;
  createAt: string;
  createBy: number;
  id: number;
  interfaceMethod: number;
  interfaceName: string;
  interfaceNamePy: string;
  interfaceUrl: string;
  isUsed: number;
  remark: string;
  status: number;
  updateAt: string;
}

export interface IFormCategory {
  id: number;
  categoryName: string;
  isEnable: number;
  sort: number;
  remark: string;
  createBy: number;
  createAt: string;
  updateAt: string;
  status: number;
}
export interface IFormITEM {
  id: number;
  formKey: string;
  formName: string;
  formCategory: number;
  tableName: string;
  formType: number;
  formDesc: string;
  relFormId: number;
  relTableName: string;
  processDefinitionId: string;
  appId: number;
  modelId: string;
  isEdit: number;
  createBy: number;
  createAt: string;
  updateAt: string;
  status: number;
  isNeedApprove: number;
  modelName: string;
  isEnabled: number;
  isDefine: number;
  modelCategory: number;
}

export interface IFormConfig {
  businessData: any;
  processRecord: any;
  formInfo: {
    id: number;
    formKey: string;
    formName: string;
    formNamePy: string;
    formCategory: number;
    tableName: string;
    formType: number;
    formDesc: string;
    relFormId: number;
    relTableName: string;
    formStr: string;
    sourceStr: string;
    processDefinitionId: string;
    appId: number;
    modelId: string;
    isEdit: number;
    createBy: number;
    createAt: string;
    updateAt: string;
    status: number;
    isNeedApprove: number;
    gridValue: string;
    modelName: string;
    modelNamePy: string;
    isEnabled: number;
    isDefine: number;
    modelCategory: number;
    thirdStr: string;
    backStr: string;
    specialStr: string;
  };
  formPage: {
    fileText: string;
  };
}
