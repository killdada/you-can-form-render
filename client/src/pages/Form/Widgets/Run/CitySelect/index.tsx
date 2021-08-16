import type { FC } from 'react';
import React, { useEffect } from 'react';
import { useSafeState } from 'ahooks';
import { useModel } from 'umi';

import { Cascader } from 'antd';

import { CityService } from '@/service';
import type { ICity } from '@/types';
import type { CascaderOptionType, CascaderValueType } from 'antd/es/cascader';

const formatCityRes = (data: ICity[] = [], isLeaf: boolean): CascaderOptionType[] => {
  const res: CascaderOptionType[] = [];
  data.forEach((item: ICity) => {
    res.push({
      label: item.name,
      value: item.id,
      isLeaf,
    });
  });
  return res;
};

interface formMatOptionsParams {
  provinceId: number;
  cityId: number;
  provinces: ICity[];
  citys: ICity[];
  areas: ICity[];
}

// 三级联动省市区组装
const formatOptions = ({
  provinceId,
  cityId,
  provinces,
  citys,
  areas,
}: formMatOptionsParams): CascaderOptionType[] => {
  const res: CascaderOptionType[] = [];
  provinces.forEach((item: ICity) => {
    const provinceItem: CascaderOptionType = { label: item.name, value: item.id, isLeaf: false };
    if (item.id === provinceId) {
      provinceItem.children = citys.map((city: ICity) => {
        const cityItem: CascaderOptionType = { label: city.name, value: city.id, isLeaf: false };
        if (city.id === cityId) {
          cityItem.children = formatCityRes(areas, true);
        }
        return cityItem;
      });
    }
    res.push(provinceItem);
  });
  return res;
};

const MrCitySelect: FC<Generator.CustomComponentsProp<number[]>> = (props) => {
  const { isDesign } = useModel('configModel', (model) => ({
    isDesign: model.isDesign,
  }));
  const { value = [], onChange, disabled, readOnly, hidden, schema = {} } = props;
  const { props: comProps } = schema;

  const [options, setOptions] = useSafeState<CascaderOptionType[]>([]);

  useEffect(() => {
    if (!isDesign) {
      if (value[2]) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        fetchAllData();
      } else {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        getProvinceList();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesign]);

  const getProvinceList = async () => {
    const { data } = await CityService.fetchProvinces();
    setOptions(formatCityRes(data, false));
  };

  const fetchAllData = async () => {
    const provinceId = value[0];
    const cityId = value[1];
    const [provinceData, cityData, areaData] = await Promise.all([
      CityService.fetchProvinces(),
      CityService.fetchCitysByProvinceId(provinceId),
      CityService.fetchAreasByCityId(cityId),
    ]);
    setOptions(
      formatOptions({
        provinceId,
        cityId,
        provinces: provinceData.data,
        citys: cityData.data,
        areas: areaData.data,
      }),
    );
  };

  const loadData = async (selectedOptions?: CascaderOptionType[]) => {
    if (!selectedOptions || !selectedOptions.length) return;
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    let data: ICity[] = [];
    if (selectedOptions.length === 2) {
      const { data: dataRes } = await CityService.fetchAreasByCityId(targetOption.value || '');
      data = dataRes;
    } else if (selectedOptions.length === 1) {
      const { data: dataRes } = await CityService.fetchCitysByProvinceId(targetOption.value || '');
      data = dataRes;
    }
    targetOption.loading = false;
    targetOption.children = formatCityRes(data, selectedOptions.length === 2);

    setOptions([...options]);
  };

  const onChangeCity = (selectVal: CascaderValueType) => {
    // 只有选中三级的时候才回填数据给组件
    if (selectVal.length === 3) {
      onChange(selectVal);
    }
  };

  if (hidden) return null;

  return (
    <Cascader
      style={{ width: '100%' }}
      disabled={isDesign || disabled || readOnly}
      options={options}
      loadData={loadData}
      value={value}
      onChange={onChangeCity}
      changeOnSelect
      {...comProps}
    />
  );
};

export default MrCitySelect;
