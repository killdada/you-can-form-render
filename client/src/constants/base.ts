import { get } from 'lodash-es';
import { deviceInfo } from '@/utils/base';

/**
 * @description 存储在sessionStorages里面的用户信息key
 */
export const USER_KEY = 'form-render-user';

/**
 * @description 是否dev开发模式
 */
export const IS_DEV_MODE = process.env.NODE_ENV === 'development';

/** @description 设计时删除表单是否是物理删除，默认否 （以前表单和流程等绑定很多强关联，删除字段可能会带来一堆问题，因此以前的删除字段只是类似的隐藏功能） */
export const IS_PHYSICAL_DEL = false;

/** @description 是否是手机端 */
export const isPhone = get(deviceInfo, 'os.phone', false);
