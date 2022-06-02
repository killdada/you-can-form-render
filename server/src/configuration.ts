import * as unittestConfig from './config/config.unittest';
import * as localConfig from './config/config.local';
import * as defaultConfig from './config/config.default';
import * as webFramework from '@midwayjs/web';
import * as crossDomain from '@midwayjs/cross-domain';

import { App, Configuration } from '@midwayjs/decorator';
import { ILifeCycle } from '@midwayjs/core';
import { Application } from 'egg';

@Configuration({
  importConfigs: [
    { default: defaultConfig, local: localConfig, unittest: unittestConfig },
  ],
  conflictCheck: true,
  imports: [crossDomain, webFramework],
})
export class ContainerLifeCycle implements ILifeCycle {
  @App()
  app: Application;

  async onReady() { }
}
