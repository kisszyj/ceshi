const OSS = require('ali-oss');
const path = require('path');
const fs = require('fs');

require('dotenv').config({
  path: path.resolve(__dirname, '../.env.production'),
});

const client = new OSS({
  region: 'oss-cn-hongkong',
  accessKeyId: process.env.OSS_ACCESS_KEY,
  accessKeySecret: process.env.OSS_ACCESS_SECRET,
  bucket: 'alipay-web',
});

async function traverseDir(relativePath) {
  const currentDirFullPath = path.resolve(__dirname, `../dist/${relativePath}`);
  const fileList = fs.readdirSync(currentDirFullPath);
  for (let i = 0; i < fileList.length; i += 1) {
    const file = fileList[i];
    let fullPath = path.join(currentDirFullPath, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      console.log(fullPath);
      traverseDir(`${relativePath}/${file}`);
    } else {
      const ext = path.extname(file);
      const uploadQuery = {
        header: {
          'Cache-Control': 'max-age=2592000',
        },
      };
      if (ext === '.js') {
        uploadQuery.mime = 'text/javascript';
      }
      if (ext === '.css') {
        uploadQuery.mime = 'text/css';
      }
      console.log(`uploading ${relativePath}/${file}`);
      const uploadResult = await client.put(
        `${relativePath}/${file}`,
        path.resolve(__dirname, `../dist/${relativePath}/${file}`),
        uploadQuery,
      );
      console.log(
        `upload result : ${uploadResult.name}, ${uploadResult.res.status}`,
      );
    }
  }
}

async function start() {
  const result = await client.put(
    'index.html',
    path.resolve(__dirname, '../dist/index.html'),
  );
  console.log(`upload result : ${result.name}, ${result.res.status}`);

  const dir = path.resolve(__dirname, '../dist/static');
  traverseDir('static');
}

start();
