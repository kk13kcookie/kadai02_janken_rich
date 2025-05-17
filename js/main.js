// DOMコンテンツが読み込まれた後に実行
document.addEventListener('DOMContentLoaded', function(){
  // 要素取得
  const openBtn = document.querySelector("#button-open");
  const closeBtn = document.querySelector("#button-close")
  const menu = document.querySelector("#mobile-menu");
  const links = document.querySelectorAll(".hum-links");

  // ハンバーガメニュー開く
  if (openBtn) {
    openBtn.addEventListener('click', function(){
      console.log('open');
      menu.classList.remove("hidden");
    });
  }

  // 閉じるバツボタンで
  if (closeBtn) {
    closeBtn.addEventListener('click', function(){
      console.log('close');
      menu.classList.add("hidden");
    });
  }

  // ハンバーガメニュー閉じる、リンククリック時
  links.forEach(function(link){
    link.addEventListener('click', function(){
      console.log('link clicked');
      menu.classList.add("hidden");
    });
  });

  // ウィンドウリサイズ時にMenu非表示
  window.addEventListener('resize', function(){
    if(this.window.innerWidth >= 1024){
      menu.classList.add("hidden");
    }
  });

  //初期表示時にもチェック
  if (window.innerWidth >= 1024) {
    menu.classList.add("hidden");
  }
});

