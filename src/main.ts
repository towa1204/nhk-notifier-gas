import { ProgramListReq } from 'nhk-program-connect';
import { ResponseError } from 'nhk-program-connect/src/internal/exception';
import { fetchProgramGAS } from 'nhk-program-connect/src/lib';

// 関数名が適当すぎる
// https://zenn.dev/someone7140/articles/d48c8750e8a951
function getToday() {
  const today = new Date();
  const formatted = today
    .toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .split('/')
    .join('-');

  return formatted;
}

function main() {
  const prop = PropertiesService.getScriptProperties().getProperties();
  const param: ProgramListReq = {
    area: prop.NHKAPI_AREA,
    service: 'g1',
    date: getToday(),
    apikey: prop.NHKAPI_KEY,
  };

  let subscribePrograms = null;
  try {
    subscribePrograms = fetchProgramGAS(['ＮＨＫ'], param);
  } catch (error) {
    if (error instanceof ResponseError) {
      console.error(error.statusCode);
    }
    if (error instanceof Error) {
      console.error(error.message);
    }
    throw new Error('unexpected error');
  }
  if (subscribePrograms.length == 0) {
    console.log('該当する番組は見つかりませんでした。');
  }
  console.log(subscribePrograms);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let global: any;
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
global.main = main;
