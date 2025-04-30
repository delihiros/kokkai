import { AxiosError, isAxiosError } from 'axios';

/**
 * 国会APIクライアント固有のエラー
 */
export class KokkaiError extends Error {
  /** エラーコード (API仕様のエラーコードとは異なる場合がある) */
  public code?: string | number;
  /** APIからのエラー詳細メッセージ */
  public details?: string[];
  /** 元となったエラー (AxiosErrorなど) */
  public originalError?: Error | AxiosError;

  constructor(message: string, code?: string | number, details?: string[], originalError?: Error | AxiosError) {
    super(message);
    this.name = 'KokkaiError';
    this.code = code;
    this.details = details;
    this.originalError = originalError;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, KokkaiError);
    }

    Object.setPrototypeOf(this, KokkaiError.prototype);
  }
}

/**
 * APIからのエラーレスポンスを処理し、KokkaiErrorを生成する
 * @param error AxiosエラーオブジェクトまたはAPIエラーレスポンス
 * @returns KokkaiErrorインスタンス
 */
export function handleApiError(error: unknown): KokkaiError {
  if (error instanceof KokkaiError) {
    return error; // すでに処理済みならそのまま返す
  }

  let message = 'An unexpected error occurred.';
  let code: string | number | undefined;
  let details: string[] | undefined;
  let originalError: Error | AxiosError | undefined;

  if (isAxiosError(error)) {
    originalError = error;
    message = `Request failed: ${error.message}`;
    code = error.code || error.response?.status;

    if (error.response?.data) {
      const errorData = error.response.data;
      ({ message, details } = extractErrorDetails(errorData, message));
    }
  } else if (error instanceof Error) {
    originalError = error;
    message = error.message;
  }

  return new KokkaiError(message, code, details, originalError);
}

/**
 * エラーデータから詳細情報を抽出する
 * @param errorData APIからのエラーデータ
 * @param defaultMessage デフォルトのエラーメッセージ
 * @returns 抽出されたエラーメッセージと詳細
 */
function extractErrorDetails(errorData: unknown, defaultMessage: string): { message: string; details?: string[] } {
  if (typeof errorData === 'object' && errorData !== null) {
    if ('message' in errorData && typeof errorData.message === 'string') {
      defaultMessage = errorData.message;
    }
    if ('details' in errorData && Array.isArray(errorData.details)) {
      return { message: defaultMessage, details: errorData.details.filter((d): d is string => typeof d === 'string') };
    }
    if (isXmlErrorResponse(errorData)) {
      return extractXmlErrorDetails(errorData, defaultMessage);
    }
  }
  return { message: defaultMessage };
}

/**
 * XML形式のエラーレスポンスかどうかを判定する
 * @param data エラーデータ
 * @returns XML形式のエラーレスポンスである場合はtrue
 */
function isXmlErrorResponse(data: unknown): data is { data: { diagnostics: { diagnostic: { message: string; details?: unknown } } } } {
  return (
    typeof data === 'object' &&
    data !== null &&
    'data' in data &&
    typeof (data as any).data === 'object' &&
    'diagnostics' in (data as any).data &&
    typeof (data as any).data.diagnostics === 'object' &&
    'diagnostic' in (data as any).data.diagnostics &&
    typeof (data as any).data.diagnostics.diagnostic === 'object'
  );
}

/**
 * XML形式のエラーレスポンスから詳細情報を抽出する
 * @param errorData XML形式のエラーデータ
 * @param defaultMessage デフォルトのエラーメッセージ
 * @returns 抽出されたエラーメッセージと詳細
 */
function extractXmlErrorDetails(
  errorData: { data: { diagnostics: { diagnostic: { message: string; details?: unknown } } } },
  defaultMessage: string
): { message: string; details?: string[] } {
  const diagnostic = errorData.data.diagnostics.diagnostic;
  let message = defaultMessage;
  let details: string[] | undefined;

  if ('message' in diagnostic && typeof diagnostic.message === 'string') {
    message = diagnostic.message;
  }
  if ('details' in diagnostic) {
    if (typeof diagnostic.details === 'string') {
      details = [diagnostic.details];
    } else if (Array.isArray(diagnostic.details)) {
      details = diagnostic.details.filter((d): d is string => typeof d === 'string');
    }
  }

  return { message, details };
}