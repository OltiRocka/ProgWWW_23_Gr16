document.addEventListener("DOMContentLoaded", function () {
  var tablesAppended = false;

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
  var top_links = document.querySelectorAll('a[href="#"]');

  for (var i = 0; i < top_links.length; i++) {
    top_links[i].addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Create stock Tables
  fetch("./assets/stocks.json")
    .then((response) => response.json())
    .then((data) => {
      if (!tablesAppended) {
        const symbols = Object.keys(data);
        symbols.forEach((symbol) => {
          const tableData = data[symbol].slice(0, 6);
          appendDataToDOM(symbol, tableData);
        });
        tablesAppended = true;
      }
    });
});

function appendDataToDOM(symbol, tableData) {
  let tableHTML = `
    <div>
        <h3>${symbol}</h3>
        <table>
            <thead>
                <tr>
                    <th>Month</th>
                    <th>Price</th>
                    <th>Change</th>
                    <th>Change(%)</th>
                </tr>
            </thead>
            <tbody>`;

  tableData.forEach((monthData) => {
    tableHTML += `
            <tr>
                <td>${monthData.month}</td>
                <td>${monthData.close}</td>
                <td>${monthData.change}</td>
                <td>${monthData.changePercentage}</td>
            </tr>`;
  });

  tableHTML += `
            </tbody>
        </table>
    </div>`;

  document.querySelector(".finance_data").innerHTML += tableHTML;
}
