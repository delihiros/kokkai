/**
 * 院名
 */
export type HouseName = '衆議院' | '参議院' | '両院' | '両院協議会';

/**
 * 検索対象箇所 (議事冒頭・本文指定)
 */
export type SearchRange = '冒頭' | '本文' | '冒頭・本文';

/**
 * 発言者役割
 */
export type SpeakerRole = '証人' | '参考人' | '公述人';

/**
 * 応答形式 (内部的にはJSONを推奨)
 */
export type RecordPacking = 'xml' | 'json';

/**
 * イメージ種別
 */
export type ImageKind = '会議録' | '目次' | '索引' | '附録' | '追録';

/**
 * 基本となる検索パラメータ
 */
export interface BaseSearchParams {
    /** 検索結果の取得開始位置 (1〜) */
    startRecord?: number;
    /** 一回の最大取得件数 */
    maximumRecords?: number;
    /** 院名 */
    nameOfHouse?: HouseName;
    /** 会議名 (部分一致, スペース区切りでOR検索) */
    nameOfMeeting?: string;
    /** 検索語 (発言内容等, 部分一致, スペース区切りでAND検索) */
    any?: string;
    /** 発言者名 (部分一致, スペース区切りでOR検索) */
    speaker?: string;
    /** 開会日付/始点 (YYYY-MM-DD) */
    from?: string;
    /** 開会日付/終点 (YYYY-MM-DD) */
    until?: string;
    /** 追録・附録指定 (true: 限定する) */
    supplementAndAppendix?: boolean;
    /** 目次・索引指定 (true: 限定する) */
    contentsAndIndex?: boolean;
    /** 検索対象箇所 (any指定時) */
    searchRange?: SearchRange;
    /** 閉会中指定 (true: 限定する) */
    closing?: boolean;
    /** 発言番号 (完全一致) */
    speechNumber?: number;
    /** 発言者肩書き (部分一致) */
    speakerPosition?: string;
    /** 発言者所属会派 (部分一致, 正式名称のみ) */
    speakerGroup?: string;
    /** 発言者役割 */
    speakerRole?: SpeakerRole;
    /** 発言ID (会議録ID_発言番号3桁, 完全一致) */
    speechID?: string;
    /** 会議録ID (21桁英数字, 完全一致) */
    issueID?: string;
    /** 国会回次From (単独指定: 完全一致, Toと指定: 範囲) */
    sessionFrom?: number;
    /** 国会回次To (単独指定: 完全一致, Fromと指定: 範囲) */
    sessionTo?: number;
    /** 号数From (単独指定: 完全一致, Toと指定: 範囲, 0は目次等) */
    issueFrom?: number;
    /** 号数To (単独指定: 完全一致, Fromと指定: 範囲, 0は目次等) */
    issueTo?: number;
    /** 応答形式 (クライアント内部で'json'を強制するため通常指定不要) */
    recordPacking?: RecordPacking;
}

/**
 * APIレスポンスの共通部分
 */
interface BaseResponse {
    /** 総結果件数 */
    numberOfRecords: number;
    /** 今回の返戻件数 */
    numberOfReturn: number;
    /** 今回の開始位置 */
    startRecord: number;
    /** 次の検索開始位置 (存在する場合) */
    nextRecordPosition?: number;
}

/**
 * 発言情報 (共通)
 */
interface SpeechRecordBase {
    /** 発言ID */
    speechID: string;
    /** 発言番号 */
    speechOrder: number;
    /** 発言者名 */
    speaker: string;
    /** 発言URL */
    speechURL: string;
}

/**
 * 発言情報 (会議単位簡易出力のspeechRecord)
 */
export type MeetingListSpeechRecord = Pick<SpeechRecordBase, 'speechID' | 'speechOrder' | 'speaker' | 'speechURL'>;

/**
 * 会議録情報 (会議単位簡易出力)
 */
export interface MeetingListItem {
    /** 会議録ID */
    issueID: string;
    /** イメージ種別 */
    imageKind: ImageKind;
    /** 検索対象箇所 */
    searchObject: SearchRange; // API仕様書には「議事冒頭・本文」とあるが、型としてはSearchRangeが適切か
    /** 国会回次 */
    session: number;
    /** 院名 */
    nameOfHouse: string; // API仕様書には型がないが文字列だろう
    /** 会議名 */
    nameOfMeeting: string;
    /** 号数 */
    issue: string; // 文字列として扱うのが安全か (例: "追録")
    /** 開催日付 (YYYY-MM-DD) */
    date: string;
    /** 閉会中フラグ */
    closing?: boolean; // API仕様書にはbooleanとあるが、APIによっては文字列"true"/"false"の可能性も？ 要検証
    /** 発言記録 (any検索した場合のみ含まれる) */
    speechRecord?: MeetingListSpeechRecord[];
    /** 会議録テキスト表示画面のURL */
    meetingURL: string;
    /** 会議録PDF表示画面のURL (存在する場合) */
    pdfURL?: string;
}

/**
 * 会議単位簡易出力API (/meeting_list) のレスポンス型 (JSON)
 */
export interface MeetingListResponse extends BaseResponse {
    meetingRecord: MeetingListItem[];
}

/**
 * 発言情報 (会議単位出力・発言単位出力の詳細)
 */
export interface SpeechRecordDetail extends SpeechRecordBase {
    /** 発言者よみ */
    speakerYomi?: string;
    /** 発言者所属会派 */
    speakerGroup?: string;
    /** 発言者肩書き */
    speakerPosition?: string;
    /** 発言者役割 */
    speakerRole?: SpeakerRole;
    /** 発言本文 */
    speech: string;
    /** 発言掲載開始ページ */
    startPage?: number; // API仕様書には型がないが数値だろう
}

/**
 * 発言情報 (会議単位出力のspeechRecord)
 */
export interface MeetingSpeechRecord extends SpeechRecordDetail {
    /** レコード登録日時 */
    createTime?: string; // ISO 8601形式か？ 要検証
    /** レコード更新日時 */
    updateTime?: string; // ISO 8601形式か？ 要検証
}

/**
 * 会議録情報 (会議単位出力)
 */
export interface MeetingItem extends Omit<MeetingListItem, 'speechRecord'> {
    /** 発言記録 (全発言) */
    speechRecord: MeetingSpeechRecord[];
}

/**
 * 会議単位出力API (/meeting) のレスポンス型 (JSON)
 */
export interface MeetingResponse extends BaseResponse {
    meetingRecord: MeetingItem[];
}


/**
 * 発言情報 (発言単位出力のspeechRecord)
 */
export interface SpeechItemRecord extends SpeechRecordDetail {
    /** 会議録ID */
    issueID: string;
    /** イメージ種別 */
    imageKind: ImageKind;
    /** 検索対象箇所 */
    searchObject: SearchRange;
    /** 国会回次 */
    session: number;
    /** 院名 */
    nameOfHouse: string;
    /** 会議名 */
    nameOfMeeting: string;
    /** 号数 */
    issue: string;
    /** 開催日付 */
    date: string;
    /** 閉会中フラグ */
    closing?: boolean;
    /** 会議録テキスト表示画面のURL */
    meetingURL: string;
    /** 会議録PDF表示画面のURL (存在する場合) */
    pdfURL?: string;
}

/**
 * 発言単位出力API (/speech) のレスポンス型 (JSON)
 */
export interface SpeechResponse extends BaseResponse {
    speechRecord: SpeechItemRecord[];
}

/**
 * エラーレスポンス型 (JSON)
 */
export interface ErrorResponse {
    /** エラーメッセージ */
    message: string;
    /** エラー詳細 (存在する場合) */
    details?: string[];
}

/**
 * エラーレスポンス型 (XMLルート) - XMLパースが必要な場合
 */
export interface XmlErrorResponse {
    data: {
        diagnostics: {
            diagnostic: {
                message: string;
                details?: string | string[]; // XMLでは詳細が単一か複数か不明瞭な場合がある
            }
        }
    }
}

/**
 * クライアント設定オプション
 */
export interface KokkaiClientOptions {
    /** APIのベースURL (デフォルト: https://kokkai.ndl.go.jp/api) */
    baseURL?: string;
    /** リクエストタイムアウト (ミリ秒, デフォルト: 10000) */
    timeout?: number;
    /** リクエスト間の待機時間 (ミリ秒, レートリミット対策, デフォルト: 3000) */
    requestInterval?: number;
    /** User-Agentヘッダー (設定推奨) */
    userAgent?: string;
    /** 追加のHTTPヘッダー */
    headers?: Record<string, string>;
}