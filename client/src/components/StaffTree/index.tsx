import type { FC } from 'react';
import { memo, useState, useEffect } from 'react';

import { useSessionStorageState } from 'ahooks';
import { TreeSelect, message } from 'antd';
import type { CustomFormItemProps, IOrg, IStaff } from '@/types';
import { CommonService } from '@/service/CommonService';

import { pinyin } from '@/utils';

interface ITreeData extends Partial<IOrg> {
  key?: React.Key;
  label?: string;
  value?: string | number;
  title?: string;
  children?: ITreeData[];
}

const getChrild = (val: ITreeData, list: IOrg[] = []) => {
  const treeData: ITreeData = {
    value: `d${typeof val.value === 'undefined' ? val.id : val.value}`,
    title: typeof val.title === 'undefined' ? val.name : val.title,
    parentDeptId: val.parentDeptId || '',
    children: [],
  };
  // 使用递归将部门分好
  list.forEach((item) => {
    if (
      `d${item.parentDeptId}` === val.value ||
      `d${item.parentDeptId}` === val.id ||
      item.parentDeptId === val.value ||
      item.parentDeptId === val.id
    ) {
      treeData?.children?.push(getChrild(item, list));
    }
  });
  return treeData;
};

// 采用深度优先搜索将数据放入数组中
// eslint-disable-next-line consistent-return
const deepTraversal = (item: IStaff, treeData: ITreeData) => {
  if (!treeData.children) return false;
  const len = treeData.children.length;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < len; i++) {
    if (treeData.children[i].value === `d${item.deptId}`) {
      treeData.children[i].children?.push({
        value: item.id,
        label: item.name,
        key: item.id,
      });
      break;
    } else {
      deepTraversal(item, treeData.children[i]);
    }
  }
};

// 公司组织架构人员树结构
const StaffTree: FC<CustomFormItemProps<(string | number)[]>> = ({ value = '', onChange }) => {
  // 处理人员数列表数据
  const [staffList, setStaffList] = useState<ITreeData[]>([]);
  const [staffValue, setStaffValue] = useState<(string | number)[]>([]);
  // 直接把staffList结果缓存到sessionStorage中，在登录区间这些信息一般不会变动，也不需要每次刷新都获取，退出登录的时候清除掉即可
  const [staffCache, setStaffCache] = useSessionStorageState<ITreeData[]>('staffList', []);

  useEffect(() => {
    if (!staffCache.length) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      initData();
    } else {
      setStaffList(staffCache);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staffCache]);

  const getDepartmentRelation = async () => {
    const { data = [] } = await CommonService.fetchOrgs();
    const treeData: ITreeData = {
      value: 'd0',
      title: data[0].compName,
      children: [],
    };
    treeData.children?.push(getChrild(treeData, data));
    return treeData;
  };

  const getStaff = async (treeData: ITreeData) => {
    const { data = [] } = await CommonService.fetchStaff();
    data.forEach((item) => {
      deepTraversal(item, treeData);
    });
    setStaffList(treeData.children || []);
    setStaffCache(treeData.children || []);
  };

  const initData = async () => {
    try {
      const data = await getDepartmentRelation();
      await getStaff(data);
    } catch (error) {
      message.error(error.msg || `${error}`, 5);
    }
  };

  // 更新勾选的处理人员数组
  const staffValueChange = (values: (string | number)[]) => {
    if (!Number.isInteger(parseInt(values[values.length - 1] as string, 10))) {
      values.pop();
    }
    if (values.length > 5 && values.length <= 10) {
      message.info('你选择需要处理的人员已超过5个，请确认选择是否正确!');
    }
    if (values.length > 10) {
      // eslint-disable-next-line no-param-reassign
      value = value.slice(0, 10);
      message.warning('选择需要处理的人员不能超过10个，如需更改人员，请删除后再选择！', 3);
    }
    // console.log('处理人员选择更改', value);
    setStaffValue(values);
    if (onChange) {
      onChange(values);
    }
  };

  const tProps = {
    showSearch: true,
    dropdownStyle: { maxHeight: 400, overflow: 'auto' },
    multiple: true,
    allowClear: true,
    treeData: staffList,
    value: staffValue,
    onChange: staffValueChange,
    showCheckedStrategy: TreeSelect.SHOW_PARENT,
    placeholder: '请选择处理人员',
    filterTreeNode: (input: string, treeNode: any) => {
      return (
        pinyin(treeNode.title).toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
        treeNode.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
  };
  return <TreeSelect style={{ width: '100%' }} {...tProps} />;
};

export default memo(StaffTree);
