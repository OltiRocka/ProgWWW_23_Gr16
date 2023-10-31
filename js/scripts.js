document.addEventListener("DOMContentLoaded", function () {
  // Scroll to Section
  var links = document.querySelectorAll('a[href^="#"]');

  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener("click", function (e) {
      e.preventDefault();

      var targetID = this.getAttribute("href");
      var target = document.querySelector(targetID);

      if (targetID === "#") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // Scroll to top
  var links = document.querySelectorAll('a[href="#"]');

  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
