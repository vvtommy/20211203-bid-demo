import { spawn } from 'child_process';
import chokidar from 'chokidar';
import Log from 'electron-log';
import { readFileSync as readFile } from 'fs';
import _ from 'lodash';
import { createServer } from 'net';
import { join, resolve } from 'path';

const defaultLog = Log.scope('default');

let encoder = null;

const WORK_DIR = join(resolve(process.cwd()), './work');
const ENCODER_DIR = join(WORK_DIR, './encryption');
const CONFIG_FILE = join(ENCODER_DIR, './config.json');

function readConfig() {
  const log = Log.scope('配置模块');
  log.info(`开始重新读取配置。 config = ${CONFIG_FILE}`);
  let config = {};

  const content = readFile(CONFIG_FILE);

  return JSON.parse(content);
}

function makeCommand({ runner, execute, params }) {
  const abs = join(ENCODER_DIR, execute);
  if (runner === 'jar') {
    return ['java', ['-jar', `${abs}`, `${params}`]];
  }

  if (runner === 'node') {
    return [`node`, [`${abs}`, `${params}`]];
  }

  if (runner === 'python') {
    return [`python3`, [`${abs}`, `${params}`]];
  }

  return [`${abs}`, [`${params}`]];
}

function runCommand(command, message) {
  return new Promise((resolve, reject) => {
    const log = Log.scope('加密模块');
    const child = spawn(...command, { cwd: ENCODER_DIR, env: process.env });
    child.stdin.setDefaultEncoding('utf-8');
    child.stdout.on('data', (data) => {
      log.info(`已经收到密文. result = ${data}`);
      resolve(data);
    });
    child.stdin.write(message);
    child.stdin.end();
  });
}

async function loadEncoder() {
  const log = Log.scope('初始化模块');
  const { runner, execute, params } = readConfig();
  log.info(
    `配置文件读取成功. 运行器 = ${runner}, 加密程序 = ${execute}, 参数 = ${params}`
  );

  const command = makeCommand({ runner, execute, params });
  encoder = async (message) => {
    return await runCommand(command, message);
  };
}

function handleConnection(conn) {
  const log = Log.scope('网络模块');
  log.info(
    `新连接已经建立. 来自地址 = ${conn.remoteAddress}:${conn.remotePort},`
  );
  const onData = async (data) => {
    log.info(`接收到新明文 数据 =  ${data}`);
    if (encoder == null) {
      return;
    }
    const encrypted = await encoder(data);
    if (conn.destroyed) {
      return;
    }
    conn.write(encrypted);
    // conn.close();
  };
  conn.on('data', onData);
  conn.on('end', () => {
    log.info(`连接已经断开. 地址 = ${conn.remoteAddress}:${conn.remotePort}`);
  });
}

function run() {
  const server = createServer();

  server.on('connection', handleConnection);

  server.listen(9000, () => {
    const log = Log.scope('DEMO 服务器');
    log.info(`服务器已经启动, 监听端口 = ${9000}`);
  });
}
loadEncoder();
run();

const watcher = chokidar.watch(WORK_DIR, { followSymlinks: true });
watcher.on('all', _.debounce(loadEncoder, 5e2));
