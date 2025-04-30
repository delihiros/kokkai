import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import {
  BaseSearchParams,
  MeetingListResponse,
  MeetingResponse,
  SpeechResponse,
  KokkaiClientOptions,
  ErrorResponse,
} from './types';
import { KokkaiError, handleApiError } from './errors';

const DEFAULT_BASE_URL = 'https://kokkai.ndl.go.jp/api';
const DEFAULT_TIMEOUT = 10000; // 10 seconds
const DEFAULT_REQUEST_INTERVAL = 3000; // 3 seconds

export class KokkaiClient {
  private httpClient: AxiosInstance;
  private lastRequestTime: number = 0;
  private requestInterval: number;

  constructor(options: KokkaiClientOptions = {}) {
    const {
      baseURL = DEFAULT_BASE_URL,
      timeout = DEFAULT_TIMEOUT,
      requestInterval = DEFAULT_REQUEST_INTERVAL,
      userAgent,
      headers = {},
    } = options;

    this.requestInterval = requestInterval;

    const axiosConfig: AxiosRequestConfig = {
      baseURL,
      timeout,
      headers: {
        'Accept': 'application/json',
        ...(userAgent && { 'User-Agent': userAgent }),
        ...headers,
      },
    };

    this.httpClient = axios.create(axiosConfig);
  }

  /**
   * 会議単位簡易出力 API (/meeting_list)
   * @param params 検索パラメータ
   * @returns 会議録情報のリスト
   */
  public async getMeetingList(params: Omit<BaseSearchParams, 'recordPacking'>): Promise<MeetingListResponse> {
    const apiParams = this.applyDefaultParams(params, 30, 100);
    this.validateCommonParams(apiParams);
    return this.request<MeetingListResponse>('/meeting_list', apiParams);
  }

  /**
   * 会議単位出力 API (/meeting)
   * @param params 検索パラメータ
   * @returns 会議録情報と全発言のリスト
   */
  public async getMeeting(params: Omit<BaseSearchParams, 'recordPacking'>): Promise<MeetingResponse> {
    const apiParams = this.applyDefaultParams(params, 3, 10);
    this.validateCommonParams(apiParams);
    return this.request<MeetingResponse>('/meeting', apiParams);
  }

  /**
   * 発言単位出力 API (/speech)
   * @param params 検索パラメータ
   * @returns 発言情報のリスト
   */
  public async getSpeech(params: Omit<BaseSearchParams, 'recordPacking'>): Promise<SpeechResponse> {
    const apiParams = this.applyDefaultParams(params, 30, 100);
    this.validateCommonParams(apiParams);
    return this.request<SpeechResponse>('/speech', apiParams);
  }

  private async request<T>(endpoint: string, params: BaseSearchParams): Promise<T> {
    await this.enforceRateLimit();

    const queryParams = this.serializeParams(params);

    try {
      const response = await this.httpClient.get<T | ErrorResponse>(endpoint, { params: queryParams });
      const responseData = response.data;

      if (this.isErrorResponse(responseData)) {
        throw new KokkaiError(responseData.message, undefined, responseData.details);
      }

      return responseData as T;
    } catch (error: unknown) {
      throw handleApiError(error);
    }
  }

  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const waitTime = this.requestInterval - timeSinceLastRequest;

    if (waitTime > 0) {
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    this.lastRequestTime = Date.now();
  }

  private validateCommonParams(params: BaseSearchParams): void {
    if (params.startRecord !== undefined && params.startRecord < 1) {
      throw new KokkaiError('startRecord must be 1 or greater.', 'ValidationError');
    }
    if (params.from) this.validateDateFormat(params.from, 'from');
    if (params.until) this.validateDateFormat(params.until, 'until');
    this.validateDateRange(params.from, params.until);

    const hasSearchCondition = [
      params.nameOfHouse, params.nameOfMeeting, params.any, params.speaker,
      params.from, params.until, params.speechNumber, params.speakerPosition,
      params.speakerGroup, params.speakerRole, params.speechID, params.issueID,
      params.sessionFrom, params.sessionTo, params.issueFrom, params.issueTo
    ].some(p => p !== undefined && p !== null && p !== '');

    if (!hasSearchCondition) {
      throw new KokkaiError('At least one search condition parameter is required.', 'ValidationError', ['19007']);
    }
  }

  private validateDateFormat(date: string, fieldName: string): void {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      throw new KokkaiError(`"${fieldName}" date must be in YYYY-MM-DD format.`, 'ValidationError');
    }
  }

  private validateDateRange(from?: string, until?: string): void {
    if (from && until && from > until) {
      throw new KokkaiError('Date range is invalid: "from" date cannot be after "until" date.', 'ValidationError');
    }
  }

  private applyDefaultParams(params: BaseSearchParams, defaultMax: number, maxLimit: number): BaseSearchParams {
    return {
      ...params,
      maximumRecords: Math.min(params.maximumRecords ?? defaultMax, maxLimit),
    };
  }

  private serializeParams(params: BaseSearchParams): Record<string, string | number | boolean> {
    const queryParams: Record<string, string | number | boolean> = {};
    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        const value = params[key as keyof BaseSearchParams];
        if (value !== undefined && value !== null && value !== '') {
          queryParams[key] = value;
        }
      }
    }
    queryParams['recordPacking'] = 'json'; // Always enforce JSON response
    return queryParams;
  }

  private isErrorResponse(data: unknown): data is ErrorResponse {
    return typeof data === 'object' && data !== null && 'message' in data && !('numberOfRecords' in data);
  }
}