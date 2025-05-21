// キーワード候補検索データ（実際はAPIから）
const jobKeywords = [
  "JavaScript Developer",
  "Frontend Engineer",
  "Backend Developer",
  "Full Stack Developer",
  "UI/UX Designer",
  "Product Manager",
  "Data Scientist",
  "DevOps Engineer",
  "React",
  "Node.js",
  "Python",
  "Machine Learning",
  "AI Engineer",
  "Marketing Manager",
  "Content Creator",
  "SEO Specialist",
  "Growth Hacker",
  "Blockchain Developer",
  "Smart Contract Engineer",
  "Project Manager",
  "Sales Representative",
  "Business Development",
  "Customer Success",
  "Human Resources",
  "Recruiter",
  "Finance Manager",
  "Legal Counsel",
  "Remote",
  "Hybrid",
  "Full-time",
  "Part-time",
  "Internship",
  "Contract",
];

// 会社名の候補(実際はデータベースから)
const companyNames = [
  "TechNova",
  "ByteWave",
  "InnoVenture",
  "DataSphere",
  "CodeCraft",
  "NextGen AI",
  "Global Connect",
  "CryptoFusion",
  "CloudScale",
  "AppForge",
  "FinTech Solutions",
  "MarketPulse",
  "EcoTech",
  "MediTech",
  "EduSphere",
];

// スプレッド演算子で検索候補をマージ
const allKeywords = [...jobKeywords, ...companyNames];

// jQueryが読み込まれた後に実行
$(document).ready(function () {
  console.log("Search script loaded - Debug version");

  // jQuery検索関連要素
  const $searchInput = $("#job-search-input");
  const $searchForm = $("#job-search-form");
  const $searchResultDisplay = $("#search-query-display");
  const $searchResultCount = $("#Search-result-count");

  // 初期状態では検索結果表示を非表示
  if ($searchResultDisplay.length > 0 && !isSearchPage()) {
    $searchResultDisplay.hide();
  }

  // 予測ドロップダウンの作成または取得
  let $dropdown = $("#prediction-dropdown");
  if ($dropdown.length === 0) {
    console.log("Creating prediction dropdown");

    // 入力フィールドの親要素の直後にドロップダウンを挿入
    const $inputContainer = $searchInput.closest("label");
    $inputContainer.after(
      '<div id="prediction-dropdown" class="absolute w-full bg-white border border-gray-300 rounded-b-md shadow-lg z-10 hidden max-h-64 overflow-y-auto text-black"></div>'
    );

    // 再度取得
    $dropdown = $("#prediction-dropdown");
    console.log("Created dropdown element:", $dropdown.length > 0);
  }

  // 検索ボタンを常に表示するように修正
  const $searchButton = $searchForm.find("button[type='submit']");
  $searchButton
    .removeClass("md:inline-flex hidden")
    .addClass("w-full md:w-auto flex justify-center mt-2 md:mt-0");

  // 検索ページかどうかを判定する関数
  function isSearchPage() {
    return (
      window.location.search.includes("?q=") ||
      window.location.pathname.includes("jobs.html")
    );
  }

  // URLからクエリパラメータを取得する関数
  function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  // 検索ページの場合は処理を実行
  if (isSearchPage()) {
    const searchQuery = getQueryParam("q");
    if (searchQuery) {
      // 検索クエリをデコードして入力欄に設定
      $searchInput.val(decodeURIComponent(searchQuery));

      // 検索結果を表示
      if ($searchResultDisplay.length > 0) {
        $searchResultDisplay.show();

        // 検索wordをスキルタグと同じスタイルで表示
        const $searchTerm = $searchResultDisplay.find("#search-term span");
        if ($searchTerm.length > 0) {
          $searchTerm.text(decodeURIComponent(searchQuery));
        } else {
          // 古いスタイルのページであれば、単純にテキストを設定
          $searchResultDisplay
            .find("span")
            .text(decodeURIComponent(searchQuery));
        }
      }

      // 検索クエリに基づいてJob postingをフィルタリング
      filterJobPosting(searchQuery);
    }
  }

  // Job postingをフィルタリングする関数
  function filterJobPosting(query) {
    if (!query) return; //クエリがない場合は何もしない

    console.log("Filtering job postings for:", query);
    query = query.toLowerCase();

    // すべてのjob postingを取得して検索
    const $jobCards = $('.col-span-12.space-y-3 > div[class*="lg:flex"]');
    console.log("Found job cards:" + $jobCards.length);

    // 各求人カードの内容を調査（デバッグ用）
    if ($jobCards.length === 0) {
      console.log(
        "No job cards found! DOM structure may be different than expected"
      );
      return;
    }

    let matchCount = 0;

    // すべてのjob postingを取得して検索
    $jobCards.each(function () {
      const $post = $(this);
      const postText = $post.text().toLowerCase();
      const jobTitle = $post.find("a.font-medium.text-lg").text().toLowerCase();
      const companyName = $post.find("p.font-normal.mb-1").text().toLowerCase();
      const skills = [];

      // スキルタグを取得
      $post.find(".border-gray-500.px-1.py-1").each(function () {
        skills.push($(this).text().toLowerCase());
      });

      // タイトル、会社名、スキルのいずれかにクエリが含まれているか確認
      if (
        jobTitle.includes(query) ||
        companyName.includes(query) ||
        skills.some((skill) => skill.includes(query)) ||
        postText.includes(query)
      ) {
        // マッチした場合は表示してハイライト
        $post.show();
        matchCount++;

        // マッチしたテキストをハイライト
        highlightText($post, query);
      } else {
        // マッチしない場合は非表示
        $post.hide();
      }
    });

    // 検索結果数を表示
    if ($searchResultCount.length > 0) {
      $searchResultCount.text(matchCount + " results found");
    }

    // マッチする結果がない場合のメッセージ
    if (matchCount === 0) {
      showNoResultsMessage(query);
    }
  }

  // 検索結果がない場合のメッセージを表示する関数
  function showNoResultsMessage(query) {
    // テンプレート要素を使用
    const $template = $("#no-result-template");

    if ($template.length > 0) {
      // テンプレートからコンテンツを複製
      const $noResults = $($template.html());
      $noResults.find(".query-text").text(query);

      // 既存の「検索結果なし」メッセージを削除
      $(".col-span-12.space-y-3 > div.p-8.bg-white").remove();

      // 新しいメッセージを挿入
      $(".col-span-12.space-y-3").prepend($noResults);
    } else {
      // テンプレートがない場合は単純なメッセージを表示
      const $noResults = $(
        '<div class="p-8 bg-white rounded-lg shadow-sm text-center my-4">' +
          '<p class="text-gray-600">No search results match "' +
          query +
          '"</p>' +
          "</div>"
      );
      $(".col-span-12.space-y-3").prepend($noResults);
    }
  }

  // テキストをハイライトする関数
  function highlightText($element, query) {
    // タイトルとスキルのハイライト
    $element
      .find("a.font-medium.text-lg, .border-gray-500.px-1.py-1")
      .each(function () {
        const $el = $(this);
        const text = $el.text();

        if (text.toLowerCase().includes(query.toLowerCase())) {
          const regex = new RegExp("(" + escapeRegExp(query) + ")", "gi");
          const highlightedText = text.replace(
            regex,
            '<span class="bg-yellow-200">$1</span>'
          );
          $el.html(highlightedText);
        }
      });
  }

  // 検索フィールドの入力イベント
  $searchInput.on("input", function () {
    const searchText = $(this).val().trim();

    if (searchText.length > 1) {
      // 予測候補を作成
      showPredictions(searchText);
    } else {
      hidePredictions();
    }
  });

  // キーボード処理
  $searchInput.on("keydown", function (e) {
    // 予測候補が表示されていない場合は何もしない
    if (!$dropdown.is(":visible")) return;

    const $selected = $dropdown.find(".bg-gray-200");

    switch (e.which) {
      case 40: //下矢印
        e.preventDefault();
        if ($selected.length) {
          // 次の予測候補を選択
          const $next = $selected.next();
          if ($next.length) {
            $selected.removeClass("bg-gray-200");
            $next.addClass("bg-gray-200");
          }
        } else {
          // 最初の予測候補を選択
          $dropdown.children().first().addClass("bg-gray-200");
        }
        break;

      case 38: // 上矢印
        e.preventDefault();
        if ($selected.length) {
          // 前の予測候補を選択
          const $prev = $selected.prev();
          if ($prev.length) {
            $selected.removeClass("bg-gray-200");
            $prev.addClass("bg-gray-200");
          }
        } else {
          // 最後の予測候補を選択
          $dropdown.children().last().addClass("bg-gray-200");
        }
        break;

      case 13: //Enter
        // 予測候補が選択されていれば、それを選択
        if ($selected.length) {
          e.preventDefault();
          selectPrediction($selected.text());
        }
        break;

      case 27: //ESC
        //予測候補を非表示
        hidePredictions();
        break;
    }
  });

  //フォーカスを失ったときに予測候補を非表示（少し遅延させる）
  $searchInput.on("blur", function () {
    setTimeout(hidePredictions, 200);
  });

  // 検索フォームの送信
  $searchForm.on("submit", function (e) {
    e.preventDefault(); // フォーム送信をいったん防止

    const searchText = $searchInput.val().trim();

    if (searchText === "") {
      return false;
    }

    // 検索クエリをエンコードしてjobs.htmlに遷移
    const currentPath = window.location.pathname;
    // 既にjobs.htmlにいる場合はページをリロード、そうでなければjobs.htmlに遷移
    if (currentPath.includes("jobs.html")) {
      window.location.href = "?q=" + encodeURIComponent(searchText);
    } else {
      window.location.href = "jobs.html?q=" + encodeURIComponent(searchText);
    }
    return false; // 通常のフォーム送信を防止
  });

  // 予測候補を表示する関数
  function showPredictions(searchText) {
    // 検索テキストにマッチする予測候補をフィルタリング
    const filteredPredictions = allKeywords
      .filter(function (keyword) {
        return keyword.toLowerCase().includes(searchText.toLowerCase());
      })
      .slice(0, 8); //最大8件まで表示

    if (filteredPredictions.length > 0) {
      // 予測候補をHTMLに追加
      $dropdown.empty();
      $.each(filteredPredictions, function (i, prediction) {
        // Tailwind CSSのクラスを使用して予測候補アイテムをスタイリング
        $dropdown.append(
          $("<div>")
            .addClass(
              "py-2 px-4 cursor-pointer hover:bg-gray-200 border-b border-gray-100 last:border-b-0"
            )
            .text(prediction)
            .on("click", function () {
              selectPrediction(prediction);
            })
        );
      });
      $dropdown.show();
    } else {
      hidePredictions();
    }
  }

  // 予測候補を非表示にする関数
  function hidePredictions() {
    $dropdown.hide().empty();
  }

  // 予測候補を選択する関数
  function selectPrediction(prediction) {
    console.log("Prediction Selected:", prediction);
    $searchInput.val(prediction);
    hidePredictions();

    // フォーカスを戻す
    $searchInput.focus();

    // フォーム送信
    $searchForm.submit();
  }

  // 正規表現のエスケープ処理
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
});
