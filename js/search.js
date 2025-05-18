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
  const $searchInput = $("#job-search-input");
  const $dropdown = $("#prediction-dropdown");

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

      case 38: // うえ矢印
        e.preventDefault();
        if ($selected.length) {
          // 前の予測候補を選択
          const $prev = $selected.prev();
          if ($prev.length) {
            $selected.removeClass("bg-gray-500");
            prev.addClass("bg-gray-500");
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
          $selectPrediction($selected.text());
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
    const searchText = $searchInput.val().trim();

    if (searchText === "") {
      e.preventDefault();
      return false;
    }

    // 通常のフォーム送信を許可（search-results.htmlにリダイレクト）
    return true;
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
              "py-2 px-4 cursor-pointer hover:bg-gray-300 border-b border-gray-100 last:border-b-0"
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
    $searchInput.val(prediction);
    hidePredictions();
    // フォーカスを戻す
    $searchInput.focus();
  }
});
