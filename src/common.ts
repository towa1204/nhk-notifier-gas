import { Program, UserProgramListReq } from 'nhk-program-connect';
import { ResponseError } from 'nhk-program-connect/src/internal/exception';

export function convertToNotifyTimeFormat(beginTime: string, endTime: string) {
  const options: Intl.DateTimeFormatOptions = { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  const date1 = new Date(beginTime);
  const date2 = new Date(endTime);

  const formattedBeginTime = date1.toLocaleString('ja-JP', options);
  const formattedEndTime = date2.toLocaleString('ja-JP', options);

  return formattedBeginTime + ' ~ ' + formattedEndTime;
}

export function convertMessages(programs: Program[]): string {
  return programs
    .map((programs, i) => {
      const airtime = convertToNotifyTimeFormat(programs.start_time, programs.end_time);
      return `[${i + 1}] ${airtime}\n ${programs.title}`;
    })
    .join('\n\n');
}

export function postMessages(messages: string) {
  const prop = PropertiesService.getScriptProperties().getProperties();

  const url = 'https://api.line.me/v2/bot/message/push';
  const payload = {
    to: prop.LINE_USERID,
    messages: [{ type: 'text', text: messages }],
  };

  const params: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: `Bearer ${prop.LINE_ACCESSTOKEN}`,
    },
    payload: JSON.stringify(payload),
  };

  UrlFetchApp.fetch(url, params);
}

export function notify(
  fetchPrograms: (subProgramTitles: string[], userReqParam: UserProgramListReq) => Program[],
  prefixMessage: string | null,
  errorMessage: string | null
) {
  const prop = PropertiesService.getScriptProperties().getProperties();
  const param: UserProgramListReq = {
    area: prop.NHKAPI_AREA,
    services: ['g1', 'e1'],
    date: new Date(),
    apikey: prop.NHKAPI_KEY,
  };

  let subscribePrograms = null;
  try {
    subscribePrograms = fetchPrograms(['ブラタモリ', '１００分ｄｅ名著'], param);
  } catch (error) {
    if (error instanceof ResponseError) {
      console.error(error.statusCode);
    }
    if (error instanceof Error) {
      console.error(error.message);
    }
    throw new Error('unexpected error');
  }

  let messages = null;
  if (subscribePrograms.length === 0 && errorMessage == null) {
    return;
  } else if (subscribePrograms.length === 0 && errorMessage != null) {
    messages = errorMessage;
  } else {
    messages = convertMessages(subscribePrograms);
    if (prefixMessage != null) {
      messages = `${prefixMessage}\n\n${messages}`;
    }
  }
  postMessages(messages);
}
