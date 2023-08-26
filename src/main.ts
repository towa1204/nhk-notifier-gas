import { fetchProgramGAS, fetchProgramWeeklyGAS } from 'nhk-program-connect/src/lib';
import { notify } from './common';

function doWeekly() {
  notify(fetchProgramWeeklyGAS, '今週、放送される番組の一覧です。', '今週放送される番組はありません。');
}

function doDaily() {
  notify(fetchProgramGAS, '今日、放送される番組の一覧です。', null);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let global: any;
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
global.doWeekly = doWeekly;
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
global.doDaily = doDaily;
