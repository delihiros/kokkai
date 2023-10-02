.. These are examples of badges you might want to add to your README:
   please update the URLs accordingly

    .. image:: https://api.cirrus-ci.com/github/delihiros/kokkai.svg?branch=main
        :alt: Built Status
        :target: https://cirrus-ci.com/github/delihiros/kokkai
    .. image:: https://readthedocs.org/projects/kokkai/badge/?version=latest
        :alt: ReadTheDocs
        :target: https://kokkai.readthedocs.io/en/stable/
    .. image:: https://img.shields.io/coveralls/github/delihiros/kokkai/main.svg
        :alt: Coveralls
        :target: https://coveralls.io/r/delihiros/kokkai
    .. image:: https://img.shields.io/pypi/v/kokkai.svg
        :alt: PyPI-Server
        :target: https://pypi.org/project/kokkai/
    .. image:: https://img.shields.io/conda/vn/conda-forge/kokkai.svg
        :alt: Conda-Forge
        :target: https://anaconda.org/conda-forge/kokkai
    .. image:: https://pepy.tech/badge/kokkai/month
        :alt: Monthly Downloads
        :target: https://pepy.tech/project/kokkai
    .. image:: https://img.shields.io/twitter/url/http/shields.io.svg?style=social&label=Twitter
        :alt: Twitter
        :target: https://twitter.com/delihiros

.. image:: https://img.shields.io/badge/-PyScaffold-005CA0?logo=pyscaffold
    :alt: Project generated with PyScaffold
    :target: https://pyscaffold.org/

|

======
kokkai
======


    国会会議録検索システムの検索用APIクライアントです。


国会会議録検索システム（ウェブサイト）での検索と同等の検索、返戻機能を有しています。
データをJSON形式で取得することができます。

.. code-block::

        $ kokkai -h
        usage: kokkai [-h] [--version] [--start_record INT] [--maximum_records INT] [--name_of_house STR] [--name_of_meeting STR] [--any STR] [--speaker STR] [--date_from STR] [--date_until STR] [--supplement_and_appendix BOOL] [--contents_and_index BOOL] [--search_range STR]
                      [--closing BOOL] [--speech_number STR] [--speaker_position STR] [--speaker_group STR] [--speaker_role STR] [--speech_id STR] [--issue_id STR] [--session_from INT] [--session_to INT] [--issue_from INT] [--issue_to INT] [-v] [-vv]
                      STR
        
        国会会議録検索システムの検索用APIのクライアント
        
        positional arguments:
          STR                   サブコマンド - meetings | meeting | speech
        
        optional arguments:
          -h, --help            show this help message and exit
          --version             show program's version number and exit
          --start_record INT    検索結果の取得開始位置
          --maximum_records INT
                                一回の最大取得件数
          --name_of_house STR   院名。「衆議院」「参議院」「両院」のいずれか
          --name_of_meeting STR
                                会議名。本会議、委員会等の会議名（ひらがな可）
          --any STR             発言内容等に含まれる言葉
          --speaker STR         発言者名（議員名はひらがな可）
          --date_from STR       検索対象とする会議の開催日の始点。YYYY-MM-DDの形式
          --date_until STR      検索対象とする会議の開催日の終点。YYYY-MM-DDの形式
          --supplement_and_appendix BOOL
                                検索対象を追録・附録に限定するか否かを「true」「false」で指定
          --contents_and_index BOOL
                                検索対象を目次・索引に限定するか否かを「true」「false」で指定
          --search_range STR    検索語（パラメータ名：any）を指定して検索する際の検索対象箇所を「冒頭」「本文」「冒頭・本文」のいずれかで指定可能。
          --closing BOOL        検索対象を閉会中の会議録に限定するか否かを「true」「false」で指定
          --speech_number STR   発言番号
          --speaker_position STR
                                発言者の肩書きを指定
          --speaker_group STR   発言者の所属会派を指定
          --speaker_role STR    発言者の役割として「証人」「参考人」「公述人」のいずれかを指定
          --speech_id STR       発言を一意に識別するIDとして、「会議録ID（パラメータ名：issueID。21桁の英数字）_発言番号（会議録テキスト表示画面で表示されている各発言に付されている、先頭に0を埋めて3桁にした数字
          --issue_id STR        会議録（冊子）を一意に識別するIDとして、会議録テキスト表示画面の「会議録テキストURLを表示」リンクで表示される21桁の英数字で指定
          --session_from INT    検索対象とする国会回次の始まり（開始回）を3桁までの自然数で指定
          --session_to INT      検索対象とする国会回次の終わり（終了回）を3桁までの自然数で指定
          --issue_from INT      検索対象とする号数の始まり（開始号）を3桁までの整数で指定
          --issue_to INT        検索対象とする号数の終わり（終了号）を3桁までの整数で指定可能
          -v, --verbose         set loglevel to INFO
          -vv, --very-verbose   set loglevel to DEBUG
        
        
