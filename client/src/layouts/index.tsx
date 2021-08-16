import React, { Component } from 'react';

import Demo from '@/demo';
import '@/less/base';
import '../less/global.less';

export default class MainLayout extends Component {
  render() {
    const { pathname = '' } = (this.props as any).location || {};
    if (pathname === '/') return <Demo></Demo>;
    return <>{this.props.children}</>;
  }
}
