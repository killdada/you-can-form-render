import type { FC } from 'react';
import React, { useEffect } from 'react';
import { useBoolean, useSafeState } from 'ahooks';
import { useModel } from 'umi';

import { UploadOutlined } from '@ant-design/icons';
import { Upload, Button, message } from 'antd';

import { baseURL } from '@/constants';
import type { UploadListType, UploadFile, UploadChangeParam } from 'antd/es/upload/interface';

import { UploadService } from '@/service';

const path = require('path');

interface UploadFileExtend extends UploadFile {
  [key: string]: any;
  /** @description 当前图片刚上传成功的时间，内网地址是有15分钟内置有效期的 */
  defaultTime?: number;
}

// 接口返回的数据有可能是内网、外网共存的数据，内网的话需要查询接口获取地址，外网不需要
const getFileList = async (fileList: UploadFileExtend[]) => {
  if (!fileList || fileList.length === 0) {
    return [];
  }
  const res: UploadFileExtend[] = [];
  fileList.forEach(async (file) => {
    const { fileName, url } = file;
    let realUrl = url;
    let realFileName = fileName;
    if (url?.includes('aliyuncs.com')) {
      // 外网地址 文件名去后面的后缀当文件名
      realFileName = path.basename(fileName);
    } else {
      // 内网地址通过接口获取真实url地址
      const { data } = await UploadService.getFileUrl(fileName as string);
      realUrl = data;
    }
    res.push({
      ...file,
      url: realUrl,
      fileName: realFileName,
      // 接口存储的是上一次操作的时候，这里重新刷新了内网图片的地址，有效期也需要刷新
      defaultTime: Date.now(),
    });
  });
  return res;
};

const MrUpload: FC<Generator.CustomComponentsProp<UploadFileExtend[]>> = (props) => {
  const { isDesign } = useModel('configModel', (model) => ({
    isDesign: model.isDesign,
  }));
  const { setErrorFields, removeErrorField } = useModel('fieldsModel', (model) => ({
    setErrorFields: model.setErrorFields,
    removeErrorField: model.removeErrorField,
  }));
  const { value = [], onChange, disabled, readOnly, hidden, schema = {}, addons } = props;
  const {
    props: comProps, // 默认图片类型
    fileType = 'img',
    // 默认公用外网接口
    isPublic = true,
  } = schema;
  const [fileList, setFileList] = useSafeState<UploadFileExtend[]>(value);
  const [isInited, { setTrue }] = useBoolean(false);

  const updateFileList = async (fileData: UploadFileExtend[]) => {
    const files = await getFileList(fileData);
    setFileList(files);
  };

  useEffect(() => {
    // 后续的filechange onchange() 也会导致value的改变，但是实际不需要刷新获取url的值，这是第一次初始化完成以后需要获取值
    if (value && !isInited) {
      updateFileList(value);
      setTrue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, isInited]);

  const removeFile = () => {
    // 这里后续可以增加以前的检验
    return true;
  };

  const beforeUpload = (file: UploadFile) => {
    if (!file) return false;
    const { size = 0, type = '' } = file;
    const imgAccept = ['image/png', 'image/jpeg', 'image/jpg'];
    if (fileType === 'img' && !imgAccept.includes(type)) {
      // 图片
      message.info('上传文件应为图片类型,png,jpeg,jpg，请重新上传！');
      // addons.setErrorFields([
      //   { name: addons.dataPath, error: ['上传文件应为图片类型,png,jpeg,jpg，请重新上传！'] },
      // ]);
      removeFile();
      return false;
    }

    if (size / 1024 / 1024 > 50) {
      message.warn('单个文件允许最大为50M，请重新上传。');
      // addons.setErrorFields([
      //   { name: addons.dataPath, error: ['单个文件允许最大为50M，请重新上传。'] },
      // ]);
      return false;
    }
    return true;
  };

  // 在下载前判断链接是否过期
  const previewFile = (file: UploadFileExtend) => {
    // 如果是内网的url地址，那么内网的临时打开页面之后的图片有效时间是15分钟
    if (file.status === 'uploading') {
      message.error('正在上传中请上传成功以后再预览。', 3);
    } else if (file.status === 'error') {
      message.error('图片上传失败，请检查或者重新上传', 3);
    } else if (
      !file.url?.includes('aliyuncs.com') &&
      file.defaultTime &&
      Date.now() - file.defaultTime > 15 * 60 * 1000
    ) {
      message.error('当前链接过期，请刷新页面后下载！', 3);
    } else {
      window.open(file.url);
    }
  };

  const updateErrorFields = (files: UploadFile[]) => {
    // 如果有一个status error | uploading 那么就直接抛出错误
    const hasError = files.some((item) => item.status === 'error' || item.status === 'uploading');
    if (hasError) {
      setErrorFields([
        { name: addons.dataPath, error: ['有文件上传类型错误或者正在上传中上传失败等！'] },
      ]);
      // addons.setErrorFields([
      //   { name: addons.dataPath, error: ['有文件上传类型错误或者正在上传中上传失败等！'] },
      // ]);
    } else {
      // addons.removeErrorField(addons.dataPath);
      removeErrorField(addons.dataPath);
    }
  };

  const onFileChange = async (params: UploadChangeParam) => {
    const { name, url, status, response, uid } = params.file;
    let curFile;
    // 图片有url地址，或者正在上传中，当前file赋值即可
    if ((name && url) || status === 'uploading') {
      curFile = params.file;
    } else if (response && status === 'done') {
      // 图片上传成功
      let realUrl = response.data;
      const fileName = isPublic ? path.basename(response.data) : response.data;
      if (!isPublic) {
        // 内网地址通过接口获取真实url地址
        const { data } = await UploadService.getFileUrl(response.data);
        realUrl = data;
      }
      curFile = {
        name,
        fileName,
        uid,
        url: realUrl,
        defaultTime: Date.now(),
        status: response.status === 0 ? 'done' : 'error',
        linkProps: `{"download": "${name}"}`,
      };
    } else {
      // 图片上传失败
      curFile = {
        name,
        uid: `${Date.now()}-${name}`,
        status: 'error',
        fileName: '',
        url: '',
      };
    }

    const fileIndex = fileList.findIndex((item) => item.uid === uid);
    if (status === 'removed') {
      fileList.splice(fileIndex, 1);
    } else if (fileIndex !== -1) {
      fileList[fileIndex] = curFile as UploadFileExtend;
    } else {
      fileList.push(curFile as UploadFileExtend);
    }
    setFileList([...fileList]);
    onChange([...fileList]);
    updateErrorFields(fileList);
  };

  const uploadProps = {
    listType: (fileType === 'img' ? 'picture' : 'text') as UploadListType,
    action: `${baseURL}${isPublic ? '/api/v1/uploadPublicPicture' : '/api/v1/uploadFile'}`,
    multiple: true,
    withCredentials: true,
    fileList,
    onChange: onFileChange,
    beforeUpload,
    onRemove: removeFile,
    onPreview: previewFile,
  };

  if (hidden) return null;

  const isDisabled = isDesign || disabled || readOnly || fileList.length >= 5;

  return (
    <div className="fr-upload-mod">
      <Upload {...uploadProps} {...comProps} className="fr-upload-file" disabled={isDisabled}>
        <Button icon={<UploadOutlined />} disabled={isDisabled}>
          上传
        </Button>
      </Upload>
    </div>
  );
};

export default MrUpload;
