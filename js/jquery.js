$(".back_top").on("click", function () {
  var $this = $(this);
  $this.addClass("animated");

  // Set a timeout to remove the class after 2 seconds
  setTimeout(function () {
    $this.removeClass("animated");
  }, 2000); // 2000 milliseconds = 2 seconds
});
if (window.innerWidth <= 600) {
  $("#searchForm").fadeOut(0);
}

function searchOnPhone() {
  const $form = $("#searchForm");
  const $header = $("header").first();
  const $bar = $("#search_bar");
  const currentMaxHeight = $bar.css("maxHeight");

  if (currentMaxHeight === "0px" || currentMaxHeight === "") {
    $bar.animate({ maxHeight: "500px" }, 200);
    $form
      .slideDown(200)
      .animate({ maxHeight: "500px" }, { queue: false, duration: 200 })
      .fadeIn(200);
    $header.animate({ paddingBottom: "60px" }, 200);
  } else {
    $bar.animate({ maxHeight: "0px" }, 200);
    $form
      .slideUp(200)
      .animate({ maxHeight: "0px" }, { queue: false, duration: 200 })
      .fadeOut("300");
    $header.animate({ paddingBottom: "10px" }, 200);
  }
}
