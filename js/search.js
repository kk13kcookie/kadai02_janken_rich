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

// 検索候補をマージ
const allKeywords = [...jobKeywords, ...companyNames];

$(document).ready(function () {
  console.log("Search script loaded - Debug version");

  // 検索関連要素
  const $searchInput = $("#job-search-input");

  let $dropdown = $("#prediction-dropdown");
  console.log("Initial dropdown element found:", $dropdown.length > 0);

  // 検索入力フィールドに予測ドロップダウンが存在することを確認
  // 存在しない場合は作成
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

  // URLからクエリパラメータを取得する関数
  function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  // Jobs.htmlでの検索結果表示
  // 現在のページがjobs.htmlの場合、URLから検索クエリを取得して表示
  if (window.location.pathname.includes("jobs.html")) {
    const searchQuery = getQueryParam("q");
    if (searchQuery) {
      // 検索クエリをデコードして入力欄に設定
      $searchInput.val(decodeURIComponent(searchQuery));

      // 検索クエリを検索バーの下に表示するための要素を追加
      // 要素がまだ存在しない場合にのみ追加
      if ($("#search-query-display").length === 0) {
        const $searchDisplay = $(
          '<div id="search-query-display" class="mt-4 mb-2 p-2 bg-gray-100 rounded-md"></div>'
        );
        const $searchTitle = $(
          '<h2 class="text-xl font-semibold">Search Result: <span class="text-blue-600"></span></h2>'
        );
        $searchTitle.find("span").text(decodeURIComponent(searchQuery));
        $searchDisplay.append($searchTitle);

        //検索クエリを検索バーの下に表示
        $(".col-span-12.space-y-3").before($searchDisplay);
      } else {
        // 既に存在する場合は内容を更新
        $("#search-query-display span").text(decodeURIComponent(searchQuery));
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
    let matchFound = false;
    let matchCount = 0;

    // すべてのjob postingを取得して検索
    const $jobCards = $('.col-span-12.space-y-3 > div[class*="lg:flex"]');
    console.log("Found job cards:" + $jobCards.length);

    // 各求人カードの内容を調査（デバッグ用）
    if ($jobCards.length === 0) {
      console.log("No job cards found! DOM structure:");
      console.log($(".col-span-12.space-y-3").html());
    } else {
      // 最初のカードのHTML構造を出力
      console.log("First job card structure:");
      console.log($jobCards.first().html());
    }

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
        matchFound = true;

        // マッチしたテキストをハイライト
        highlightText($post, query);
      } else {
        // マッチしない場合は非表示
        $post.hide();
      }
    });

    // マッチする結果がない場合のメッセージ
    if (!matchFound) {
      const $noResults = $(
        '<div class="p-4 bg-white rounded-md shadow-sm text-center my-4"><p class="text-gray-600">No Search Result matches with「' +
          query +
          "」</p></div>"
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

    const $selected = $dropdown.find(".bg-gray-500");

    switch (e.which) {
      case 40: //下矢印
        e.preventDefault();
        if ($selected.length) {
          // 次の予測候補を選択
          const $next = $selected.next();
          if ($next.length) {
            $selected.removeClass("bg-gray-500");
            $next.addClass("bg-gray-500");
          }
        } else {
          // 最初の予測候補を選択
          $dropdown.children().first().addClass("bg-gray-500");
        }
        break;

      case 38: // 上矢印
        e.preventDefault();
        if ($selected.length) {
          // 前の予測候補を選択
          const $prev = $selected.prev();
          if ($prev.length) {
            $selected.removeClass("bg-gray-500");
            $prev.addClass("bg-gray-500");
          }
        } else {
          // 最後の予測候補を選択
          $dropdown.children().last().addClass("bg-gray-500");
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
  $("#job-search-form").on("submit", function (e) {
    e.preventDefault(); // フォーム送信をいったん防止

    const searchText = $searchInput.val().trim();

    if (searchText === "") {
      return false;
    }

    // 検索クエリをエンコードしてjobs.htmlに遷移
    window.location.href = "jobs.html?q=" + encodeURIComponent(searchText);

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
              "py-2 px-4 cursor-pointer hover:bg-gray-500 border-b border-gray-100 last:border-b-0"
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

    // Enterキーを押したのと同じ効果を与える（フォーム送信）
    $("#job-search-form").submit();
  }

  // 正規表現のエスケープ処理
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // モバイル用の検索ボタンの表示 - 非表示だったのを表示するように変更
  const $searchButton = $("#job-search-form button[type='submit']");
  $searchButton
    .removeClass("md:inline-flex hidden")
    .addClass("w-full md:w-auto flex justify-center mt-2 md:mt-0");
});
