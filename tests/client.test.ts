import { KokkaiClient } from '../src/client';
import { HouseName, MeetingListResponse, MeetingResponse, SpeechResponse } from '../src/types';

describe('KokkaiClient', () => {
  const client = new KokkaiClient();

  it('会議のリストを取得できる (getMeetingList)', async () => {
    const params = {
      nameOfHouse: '衆議院' as HouseName,
      from: '2023-01-01',
      until: '2023-12-31',
      maximumRecords: 5,
    };

    const response: MeetingListResponse = await client.getMeetingList(params);

    expect(response).toBeDefined();
    expect(response.numberOfRecords).toBeGreaterThan(0);
    expect(response.meetingRecord).toBeInstanceOf(Array);
    expect(response.meetingRecord.length).toBeGreaterThan(0);

    const firstMeeting = response.meetingRecord[0];
    expect(firstMeeting).toHaveProperty('issueID');
    expect(firstMeeting).toHaveProperty('nameOfHouse', '衆議院');
    expect(firstMeeting).toHaveProperty('date');
  });

  it('会議の詳細を取得できる (getMeeting)', async () => {
    const params = {
      issueID: '121205254X01220231213', // 適切な issueID を指定してください
    };

    const response: MeetingResponse = await client.getMeeting(params);

    expect(response).toBeDefined();
    expect(response.meetingRecord).toBeDefined();
    expect(response.meetingRecord[0]).toHaveProperty('issueID', '121205254X01220231213');
  });

  it('発言のリストを取得できる (getSpeech)', async () => {
    const params = {
      nameOfHouse: '参議院' as HouseName,
      from: '2023-01-01',
      until: '2023-12-31',
      maximumRecords: 5,
    };

    const response: SpeechResponse = await client.getSpeech(params);

    expect(response).toBeDefined();
    expect(response.numberOfRecords).toBeGreaterThan(0);
    expect(response.speechRecord).toBeInstanceOf(Array);
    expect(response.speechRecord.length).toBeGreaterThan(0);

    const firstSpeech = response.speechRecord[0];
    expect(firstSpeech).toHaveProperty('speechID');
    expect(firstSpeech).toHaveProperty('nameOfHouse', '参議院');
    expect(firstSpeech).toHaveProperty('speaker');
  });
});