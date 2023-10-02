import argparse
import logging
import sys
import requests
import datetime
import json

from kokkai import __version__

__author__ = "delihiros"
__copyright__ = "delihiros"
__license__ = "MIT"

_logger = logging.getLogger(__name__)

def client(args):
    date_from = datetime.datetime.strptime(args.date_from, "%Y-%m-%d")
    date_until = datetime.datetime.strptime(args.date_until, "%Y-%m-%d")
    if args.command == "meetings":
        return list_meetings(start_record=args.start_record,
                             maximum_records=args.maximum_records,
                             name_of_house=args.name_of_house,
                             name_of_meeting=args.name_of_meeting,
                             any=args.any,
                             speaker=args.speaker,
                             date_from=date_from, # type: ignore
                             date_until=date_until, # type: ignore
                             supplement_and_appendix=args.supplement_and_appendix == "true",
                             contents_and_index=args.contents_and_index == "true",
                             search_range=args.search_range,
                             closing=args.closing == "true",
                             speech_number=args.speech_number,
                             speaker_position=args.speaker_position,
                             speaker_group=args.speaker_group,
                             speaker_role=args.speaker_role,
                             speech_id=args.speech_id,
                             issue_id=args.issue_id,
                             session_from=args.session_from,
                             session_to=args.session_to,
                             issue_from=args.issue_from,
                             issue_to=args.issue_to)

    if args.command == "meeting":
        return meeting(start_record=args.start_record,
                       maximum_records=args.maximum_records,
                       name_of_house=args.name_of_house,
                       name_of_meeting=args.name_of_meeting,
                       any=args.any,
                       date_from=date_from, # type: ignore
                       date_until=date_until, # type: ignore
                       speaker=args.speaker,
                       supplement_and_appendix=args.supplement_and_appendix == "true",
                       contents_and_index=args.contents_and_index == "true",
                       search_range=args.search_range,
                       closing=args.closing == "true",
                       speech_number=args.speech_number,
                       speaker_position=args.speaker_position,
                       speaker_group=args.speaker_group,
                       speaker_role=args.speaker_role,
                       speech_id=args.speech_id,
                       issue_id=args.issue_id,
                       session_from=args.session_from,
                       session_to=args.session_to,
                       issue_from=args.issue_from,
                       issue_to=args.issue_to)

    if args.command == "speech":
        return speech(start_record=args.start_record,
                      maximum_records=args.maximum_records,
                      name_of_house=args.name_of_house,
                      name_of_meeting=args.name_of_meeting,
                      any=args.any,
                      speaker=args.speaker,
                      date_from=date_from, # type: ignore
                      date_until=date_until, # type: ignore
                      supplement_and_appendix=args.supplement_and_appendix == "true",
                      contents_and_index=args.contents_and_index == "true",
                      search_range=args.search_range,
                      closing=args.closing == "true",
                      speech_number=args.speech_number,
                      speaker_position=args.speaker_position,
                      speaker_group=args.speaker_group,
                      speaker_role=args.speaker_role,
                      speech_id=args.speech_id,
                      issue_id=args.issue_id,
                      session_from=args.session_from,
                      session_to=args.session_to,
                      issue_from=args.issue_from,
                      issue_to=args.issue_to)


def list_meetings(start_record=1, maximum_records=30, name_of_house=None,
                   name_of_meeting=None, any=None, speaker=None,
                   date_from=datetime.date(1000, 1, 1),
                   date_until=datetime.date(9999, 12, 31),
                   supplement_and_appendix=False, contents_and_index=False,
                   search_range=None, closing=False, speech_number=None,
                   speaker_position=None, speaker_group=None, speaker_role=None,
                   speech_id=None, issue_id=None, session_from=None, session_to=None,
                   issue_from=None, issue_to=None
                   ):
    """
    {
      "numberOfRecords": 総結果件数 ,
      "numberOfReturn": 返戻件数 ,
      "startRecord": 開始位置 ,
      "nextRecordPosition": 次開始位置 ,
      "meetingRecord":[
        {
          "issueID": 会議録ID ,
          "imageKind": イメージ種別（会議録・目次・索引・附録・追録） ,
          "searchObject": 検索対象箇所（議事冒頭・本文） ,
          "session": 国会回次 ,
          "nameOfHouse": 院名 ,
          "nameOfMeeting": 会議名 ,
          "issue": 号数 ,
          "date": 開催日付 ,
          "closing": 閉会中フラグ ,
          "speechRecord":[
            {
              "speechID": 発言ID ,
              "speechOrder": 発言番号 ,
              "speaker": 発言者名 ,
              "speakerYomi": 発言者よみ（※会議単位出力のみ） ,
              "speakerGroup": 発言者所属会派（※会議単位出力のみ） ,
              "speakerPosition": 発言者肩書き（※会議単位出力のみ） ,
              "speakerRole": 発言者役割（※会議単位出力のみ） ,
              "speech": 発言（※会議単位出力のみ） ,
              "startPage": 発言が掲載されている開始ページ（※会議単位出力のみ） ,
              "createTime": レコード登録日時（※会議単位出力のみ） ,
              "updateTime": レコード更新日時（※会議単位出力のみ） ,
              "speechURL": 発言URL ,
            },
            {
              （次の発言情報）
            }
          ],
          "meetingURL": 会議録テキスト表示画面のURL ,
          "pdfURL": 会議録PDF表示画面のURL（※存在する場合のみ） ,
        },
        {
          （次の会議録情報）
        }
      ]
    }
    """

    url = "https://kokkai.ndl.go.jp/api/meeting_list?"

    params={ "recordPacking": "json" }

    params["startRecord"] = str(start_record)
    params["maximumRecords"] = str(maximum_records)
    params["from"] = date_from.strftime("%Y-%m-%d")
    params["until"] = date_until.strftime("%Y-%m-%d")
    params["supplementAndAppendix"] = "true" if supplement_and_appendix else "false"
    params["contentsAndIndex"] = "true" if contents_and_index else "false"
    params["searchRange"] = search_range if search_range else "冒頭・本文"
    params["closing"] = "true" if closing else "false"


    if name_of_house:
        params["nameOfHouse"] = name_of_house
    if name_of_meeting:
        params["nameOfMeeting"] = name_of_meeting
    if any:
        params["any"] = any
    if speaker:
        params["speaker"] = speaker
    if speech_number:
        params["speechNumber"] = str(speech_number)
    if speaker_position:
        params["speakerPosition"] = speaker_position
    if speaker_group:
        params["speakerGroup"] = speaker_group
    if speaker_role:
        params["speakerRole"] = speaker_role
    if speech_id:
        params["speechID"] = speech_id
    if issue_id:
        params["issueID"] = issue_id
    if session_from:
        params["sessionFrom"] = session_from
    if session_to:
        params["sessionTo"] = session_to
    if issue_from:
        params["issueFrom"] = issue_from
    if issue_to:
        params["issueTo"] = issue_to

    r = requests.get(url, params=params)
    print(r.url)
    print(params)
    return requests.get(url, params=params).json()


def speech(start_record=1, maximum_records=30, name_of_house=None,
                   name_of_meeting=None, any=None, speaker=None,
                   date_from=datetime.date(1000, 1, 1),
                   date_until=datetime.date(9999, 12, 31),
                   supplement_and_appendix=False, contents_and_index=False,
                   search_range=None, closing=False, speech_number=None,
                   speaker_position=None, speaker_group=None, speaker_role=None,
                   speech_id=None, issue_id=None, session_from=None, session_to=None,
                   issue_from=None, issue_to=None
                   ):
    """
    {
      "numberOfRecords": 総結果件数 ,
      "numberOfReturn": 返戻件数 ,
      "startRecord": 開始位置 ,
      "nextRecordPosition": 次開始位置 ,
      "speechRecord":[
        {
          "speechID": 発言ID ,
          "issueID": 会議録ID ,
          "imageKind": イメージ種別（会議録・目次・索引・附録・追録） ,
          "searchObject": 検索対象箇所（議事冒頭・本文） ,
          "session": 国会回次 ,
          "nameOfHouse": 院名 ,
          "nameOfMeeting": 会議名 ,
          "issue": 号数 ,
          "date": 開催日付 ,
          "closing": 閉会中フラグ ,
          "speechOrder": 発言番号 ,
          "speaker": 発言者名 ,
          "speakerYomi": 発言者よみ ,
          "speakerGroup": 発言者所属会派 ,
          "speakerPosition": 発言者肩書き ,
          "speakerRole": 発言者役割 ,
          "speech": 発言 ,
          "startPage": 発言が掲載されている開始ページ ,
          "speechURL": 発言URL ,
          "meetingURL": 会議録テキスト表示画面のURL ,
          "pdfURL": 会議録PDF表示画面のURL（※存在する場合のみ） ,
        },
        {
          （次の発言情報）
        }
      ]
    }
    """

    url = "https://kokkai.ndl.go.jp/api/speech?"

    params={ "recordPacking": "json" }

    params["startRecord"] = str(start_record)
    params["maximumRecords"] = str(maximum_records)
    params["from"] = date_from.strftime("%Y-%m-%d")
    params["until"] = date_until.strftime("%Y-%m-%d")
    params["supplementAndAppendix"] = "true" if supplement_and_appendix else "false"
    params["contentsAndIndex"] = "true" if contents_and_index else "false"
    params["searchRange"] = search_range if search_range else "冒頭・本文"
    params["closing"] = "true" if closing else "false"


    if name_of_house:
        params["nameOfHouse"] = name_of_house
    if name_of_meeting:
        params["nameOfMeeting"] = name_of_meeting
    if any:
        params["any"] = any
    if speaker:
        params["speaker"] = speaker
    if speech_number:
        params["speechNumber"] = str(speech_number)
    if speaker_position:
        params["speakerPosition"] = speaker_position
    if speaker_group:
        params["speakerGroup"] = speaker_group
    if speaker_role:
        params["speakerRole"] = speaker_role
    if speech_id:
        params["speechID"] = speech_id
    if issue_id:
        params["issueID"] = issue_id
    if session_from:
        params["sessionFrom"] = session_from
    if session_to:
        params["sessionTo"] = session_to
    if issue_from:
        params["issueFrom"] = issue_from
    if issue_to:
        params["issueTo"] = issue_to

    return requests.get(url, params=params).json()
    

def meeting(start_record=1, maximum_records=3, name_of_house=None,
                   name_of_meeting=None, any=None, speaker=None,
                   date_from=datetime.date(1000, 1, 1),
                   date_until=datetime.date(9999, 12, 31),
                   supplement_and_appendix=False, contents_and_index=False,
                   search_range=None, closing=False, speech_number=None,
                   speaker_position=None, speaker_group=None, speaker_role=None,
                   speech_id=None, issue_id=None, session_from=None, session_to=None,
                   issue_from=None, issue_to=None
                   ):
    """
    {
      "numberOfRecords": 総結果件数 ,
      "numberOfReturn": 返戻件数 ,
      "startRecord": 開始位置 ,
      "nextRecordPosition": 次開始位置 ,
      "meetingRecord":[
        {
          "issueID": 会議録ID ,
          "imageKind": イメージ種別（会議録・目次・索引・附録・追録） ,
          "searchObject": 検索対象箇所（議事冒頭・本文） ,
          "session": 国会回次 ,
          "nameOfHouse": 院名 ,
          "nameOfMeeting": 会議名 ,
          "issue": 号数 ,
          "date": 開催日付 ,
          "closing": 閉会中フラグ ,
          "speechRecord":[
            {
              "speechID": 発言ID ,
              "speechOrder": 発言番号 ,
              "speaker": 発言者名 ,
              "speakerYomi": 発言者よみ（※会議単位出力のみ） ,
              "speakerGroup": 発言者所属会派（※会議単位出力のみ） ,
              "speakerPosition": 発言者肩書き（※会議単位出力のみ） ,
              "speakerRole": 発言者役割（※会議単位出力のみ） ,
              "speech": 発言（※会議単位出力のみ） ,
              "startPage": 発言が掲載されている開始ページ（※会議単位出力のみ） ,
              "createTime": レコード登録日時（※会議単位出力のみ） ,
              "updateTime": レコード更新日時（※会議単位出力のみ） ,
              "speechURL": 発言URL ,
            },
            {
              （次の発言情報）
            }
          ],
          "meetingURL": 会議録テキスト表示画面のURL ,
          "pdfURL": 会議録PDF表示画面のURL（※存在する場合のみ） ,
        },
        {
          （次の会議録情報）
        }
      ]
    }
    """

    url = "https://kokkai.ndl.go.jp/api/meeting?"

    params={ "recordPacking": "json" }

    params["startRecord"] = str(start_record)
    params["maximumRecords"] = str(maximum_records)
    params["from"] = date_from.strftime("%Y-%m-%d")
    params["until"] = date_until.strftime("%Y-%m-%d")
    params["supplementAndAppendix"] = "true" if supplement_and_appendix else "false"
    params["contentsAndIndex"] = "true" if contents_and_index else "false"
    params["searchRange"] = search_range if search_range else "冒頭・本文"
    params["closing"] = "true" if closing else "false"


    if name_of_house:
        params["nameOfHouse"] = name_of_house
    if name_of_meeting:
        params["nameOfMeeting"] = name_of_meeting
    if any:
        params["any"] = any
    if speaker:
        params["speaker"] = speaker
    if speech_number:
        params["speechNumber"] = str(speech_number)
    if speaker_position:
        params["speakerPosition"] = speaker_position
    if speaker_group:
        params["speakerGroup"] = speaker_group
    if speaker_role:
        params["speakerRole"] = speaker_role
    if speech_id:
        params["speechID"] = speech_id
    if issue_id:
        params["issueID"] = issue_id
    if session_from:
        params["sessionFrom"] = session_from
    if session_to:
        params["sessionTo"] = session_to
    if issue_from:
        params["issueFrom"] = issue_from
    if issue_to:
        params["issueTo"] = issue_to

    return requests.get(url, params=params).json()
    



# ---- CLI ----
# The functions defined in this section are wrappers around the main Python
# API allowing them to be called directly from the terminal as a CLI
# executable/script.


def parse_args(args):
    """Parse command line parameters

    Args:
      args (List[str]): command line parameters as list of strings
          (for example  ``["--help"]``).

    Returns:
      :obj:`argparse.Namespace`: command line parameters namespace
    """
    parser = argparse.ArgumentParser(description="国会会議録検索システムの検索用APIのクライアント")
    parser.add_argument(
        "--version",
        action="version",
        version=f"kokkai {__version__}",
    )

    parser.add_argument(dest="command", help="サブコマンド - meetings | meeting | speech", type=str, metavar="STR", choices=["meetings", "meeting", "speech"])
    parser.add_argument("--start_record", help="検索結果の取得開始位置", type=int, metavar="INT", default=1)
    parser.add_argument("--maximum_records", help="一回の最大取得件数", type=int, metavar="INT", default=30)
    parser.add_argument("--name_of_house", help="院名。「衆議院」「参議院」「両院」のいずれか", type=str, metavar="STR", default="両院")
    parser.add_argument("--name_of_meeting", help="会議名。本会議、委員会等の会議名（ひらがな可）", type=str, metavar="STR")
    parser.add_argument("--any", help="発言内容等に含まれる言葉", type=str, metavar="STR")
    parser.add_argument("--speaker", help="発言者名（議員名はひらがな可）", type=str, metavar="STR")
    parser.add_argument("--date_from", help="検索対象とする会議の開催日の始点。YYYY-MM-DDの形式", type=str, metavar="STR", default="1000-01-01")
    parser.add_argument("--date_until", help="検索対象とする会議の開催日の終点。YYYY-MM-DDの形式", type=str, metavar="STR", default="9999-12-31")
    parser.add_argument("--supplement_and_appendix", help="検索対象を追録・附録に限定するか否かを「true」「false」で指定", type=str, metavar="BOOL", default="false")
    parser.add_argument("--contents_and_index", help="検索対象を目次・索引に限定するか否かを「true」「false」で指定", type=str, metavar="BOOL", default="false")
    parser.add_argument("--search_range", help="検索語（パラメータ名：any）を指定して検索する際の検索対象箇所を「冒頭」「本文」「冒頭・本文」のいずれかで指定可能。", type=str, metavar="STR", default="冒頭・本文")
    parser.add_argument("--closing", help="検索対象を閉会中の会議録に限定するか否かを「true」「false」で指定", type=str, metavar="BOOL", default="false")
    parser.add_argument("--speech_number", help="発言番号", type=str, metavar="STR")
    parser.add_argument("--speaker_position", help="発言者の肩書きを指定", type=str, metavar="STR")
    parser.add_argument("--speaker_group", help="発言者の所属会派を指定", type=str, metavar="STR")
    parser.add_argument("--speaker_role", help="発言者の役割として「証人」「参考人」「公述人」のいずれかを指定", type=str, metavar="STR")
    parser.add_argument("--speech_id", help="発言を一意に識別するIDとして、「会議録ID（パラメータ名：issueID。21桁の英数字）_発言番号（会議録テキスト表示画面で表示されている各発言に付されている、先頭に0を埋めて3桁にした数字", type=str, metavar="STR")
    parser.add_argument("--issue_id", help="会議録（冊子）を一意に識別するIDとして、会議録テキスト表示画面の「会議録テキストURLを表示」リンクで表示される21桁の英数字で指定", type=str, metavar="STR")
    parser.add_argument("--session_from", help="検索対象とする国会回次の始まり（開始回）を3桁までの自然数で指定", type=int, metavar="INT")
    parser.add_argument("--session_to", help="検索対象とする国会回次の終わり（終了回）を3桁までの自然数で指定", type=int, metavar="INT")
    parser.add_argument("--issue_from", help="検索対象とする号数の始まり（開始号）を3桁までの整数で指定", type=int, metavar="INT")
    parser.add_argument("--issue_to", help="検索対象とする号数の終わり（終了号）を3桁までの整数で指定可能", type=int, metavar="INT")
    parser.add_argument(
        "-v",
        "--verbose",
        dest="loglevel",
        help="set loglevel to INFO",
        action="store_const",
        const=logging.INFO,
    )
    parser.add_argument(
        "-vv",
        "--very-verbose",
        dest="loglevel",
        help="set loglevel to DEBUG",
        action="store_const",
        const=logging.DEBUG,
    )
    return parser.parse_args(args)


def setup_logging(loglevel):
    """Setup basic logging

    Args:
      loglevel (int): minimum loglevel for emitting messages
    """
    logformat = "[%(asctime)s] %(levelname)s:%(name)s:%(message)s"
    logging.basicConfig(
        level=loglevel, stream=sys.stdout, format=logformat, datefmt="%Y-%m-%d %H:%M:%S"
    )


def main(args):
    """Wrapper allowing :func:`client` to be called with string arguments in a CLI fashion

    Instead of returning the value from :func:`client`, it prints the result to the
    ``stdout`` in a nicely formatted message.

    Args:
      args (List[str]): command line parameters as list of strings
          (for example  ``["--verbose", "42"]``).
    """
    args = parse_args(args)
    setup_logging(args.loglevel)
    out = json.dumps(client(args), ensure_ascii=False)
    print(out)


def run():
    """Calls :func:`main` passing the CLI arguments extracted from :obj:`sys.argv`

    This function can be used as entry point to create console scripts with setuptools.
    """
    main(sys.argv[1:])


if __name__ == "__main__":
    # ^  This is a guard statement that will prevent the following code from
    #    being executed in the case someone imports this file instead of
    #    executing it as a script.
    #    https://docs.python.org/3/library/__main__.html

    # After installing your project with pip, users can also run your Python
    # modules as scripts via the ``-m`` flag, as defined in PEP 338::
    #
    #     python -m kokkai.client meetings
    #
    run()
