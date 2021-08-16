import React from 'react';

import { Link } from 'react-router-dom';

import styles from './index.less';

const demos = [
  {
    id: 1,
    text: '新建实体券号',
  },
  {
    id: 2,
    text: '表格',
  },
  {
    id: 3,
    text: '数据联动',
  },
  {
    id: 4,
    text: '完整例子',
  },
  {
    id: 5,
    text: '审批表',
    query: '?businessId=1&taskId=13907651',
    link: '/run',
  },
];

const Demo = () => {
  return (
    <div className={styles['form-render-demo']}>
      {demos.map((item) => {
        return (
          <Link
            key={item.id}
            to={{
              search: `${item.query || ''}`,
              pathname: `${item.link || '/design'}/${item.id}`,
            }}
          >
            {item.text}
          </Link>
        );
      })}
    </div>
  );
};

export default Demo;
