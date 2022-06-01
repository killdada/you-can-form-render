import multer from 'multer';
import bodyParser from 'body-parser';
import glob from 'glob';
import { pathToRegexp } from 'path-to-regexp';
import { existsSync, readdir } from 'fs';
import { join } from 'path';

const BODY_PARSED_METHODS = ['post', 'put', 'patch', 'delete'];


function winPath(path: any) {
  const isExtendedLengthPath = /^\\\\\?\\/.test(path);
  if (isExtendedLengthPath) {
    return path;
  }

  return path.replace(/\\/g, '/');
}

const normalizeConfig = (config) => {
  return Object.keys(config).reduce((memo, key) => {
    const handler = config[key];
    const { method, path } = parseKey(key);
    const keys = [];
    const re = pathToRegexp(path, keys);
    memo.push({
      method,
      path,
      re,
      keys,
      handler: createHandler(method, path, handler),
    });
    return memo;
  }, []);
};

const getMockConfig = (files) => {
  return files.reduce((memo, mockFile) => {
    try {
      const m = require(mockFile); // eslint-disable-line
      // eslint-disable-next-line no-param-reassign
      memo = {
        ...memo,
        ...(m.default || m),
      };
      return memo;
    } catch (e) {
      throw new Error(e.stack);
    }
  }, {});
};

/**
 * mock/*
 * .umirc.mock.js
 * .umirc.mock.ts
 * src/** or pages/**
 *
 * @param param
 */
const getMockData = ({ cwd, ignore = [] }) => {
  let mockPaths = [
    ...(glob.sync('mock/**/*.[jt]s', {
      cwd,
      ignore,
    }) || []),
  ];

  console.info('当前参数', cwd);

  console.info('当前mock数据,本地vercel dev的时候指向的mock目录', JSON.stringify(mockPaths));

  if (!mockPaths.length) {
    mockPaths = [
      ...(glob.sync('mock-dist/**/*.[jt]s', {
        cwd,
        ignore,
      }) || []),
    ];
    console.info('当前mock数据,本地vercel 构建的时候指向的mock目录', JSON.stringify(mockPaths));
  }

  readdir(cwd, (err, files) => {
    if (err) {
      console.log('当前目录没有', err);
      throw err;
    }

    // files object contains all files names
    // log them on console
    files.forEach((file) => {
      console.log('当前目录下的所有文件', file);
    });
  });

  mockPaths = mockPaths.map((path) => join(cwd, path));
  mockPaths = mockPaths.filter((path) => path && existsSync(path) && !path.includes('util'));
  mockPaths = mockPaths.map((path) => winPath(path));
  console.info(`load mock data including files ${JSON.stringify(mockPaths)}`);


  // get mock data
  const mockData = normalizeConfig(getMockConfig(mockPaths));

  const mockWatcherPaths = [...(mockPaths || []), join(cwd, 'mock')]
    .filter((path) => path && existsSync(path))
    .map((path) => winPath(path));

  return {
    mockData,
    mockPaths,
    mockWatcherPaths,
  };
};

function parseKey(key) {
  let method = 'get';
  let path = key;
  if (/\s+/.test(key)) {
    const splited = key.split(/\s+/);
    method = splited[0].toLowerCase();
    path = splited[1]; // eslint-disable-line
  }

  return {
    method,
    path,
  };
}

function createHandler(method, path, handler) {
  return function (req, res, next) {
    if (BODY_PARSED_METHODS.includes(method)) {
      bodyParser.json({ limit: '5mb', strict: false })(req, res, () => {
        bodyParser.urlencoded({ limit: '5mb', extended: true })(req, res, () => {
          sendData();
        });
      });
    } else {
      sendData();
    }

    function sendData() {
      if (typeof handler === 'function') {
        multer().any()(req, res, () => {
          handler(req, res, next);
        });
      } else {
        res.json(handler);
      }
    }
  };
}

function decodeParam(val) {
  if (typeof val !== 'string' || val.length === 0) {
    return val;
  }
  try {
    return decodeURIComponent(val);
  } catch (err) {
    if (err instanceof URIError) {
      err.message = `Failed to decode param ' ${val} '`;
      // @ts-ignore
      err.status = 400;
      // @ts-ignore
      err.statusCode = 400;
    }
    throw err;
  }
}

const matchMock = (req, mockData) => {
  const { path: targetPath, method } = req;
  const targetMethod = method.toLowerCase();
  // eslint-disable-next-line no-restricted-syntax
  for (const mock of mockData) {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { method, re, keys } = mock;
    if (method === targetMethod) {
      const match = re.exec(targetPath || req.url);
      if (match) {
        const params = {};
        for (let i = 1; i < match.length; i += 1) {
          const key = keys[i - 1];
          const prop = key.name;
          const val = decodeParam(match[i]);
          // @ts-ignore
          if (val !== undefined || !hasOwnProdperty.call(params, prop)) {
            params[prop] = val;
          }
        }
        req.params = params;

        return mock;
      }
    }
  }
  return undefined;
};

export {
  getMockData,
  matchMock,
  winPath,
};
