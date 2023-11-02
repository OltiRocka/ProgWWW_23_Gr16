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
function playSelectedStation() {
  const radioSelect = document.getElementById("radio-select");
  const radioPlayer = document.getElementById("radio-player");
  const radioLogo = document.getElementById("radio-logo");
  const selectedOption = radioSelect.options[radioSelect.selectedIndex];
  const selectedValue = selectedOption.value;
  const selectedDataImg = selectedOption.getAttribute("data-img");
  if (selectedValue) {
    radioPlayer.src = selectedValue;
    radioPlayer.load();
    radioPlayer.play();

    radioLogo.src = selectedDataImg;
    radioLogo.style.display = "block";
  } else {
    radioPlayer.src = "";
    radioPlayer.pause();
    radioLogo.style.display = "none";
  }
}

function getVideos() {
  const base_url = "https://edition.cnn.com";
  const url = `${base_url}/videos`;
  return fetch(url)
    .then((response) => response.text())
    .then((html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const newsData = [];
      const section = doc.querySelector("#featured");
      console.log(section);
      const cardElements = section.querySelectorAll(".cn__column ");
      cardElements.forEach((card) => {
        const headlineElement = card.querySelector("h3");
        const imgElement = card.querySelector("img");
        const aElement = card.querySelector("a");

        if (headlineElement && imgElement) {
          const id = Date.now() + Math.random();
          const title = headlineElement.textContent.trim();
          const description = "";
          const image = imgElement.getAttribute("data-src-large");
          const articleURL = base_url + aElement.getAttribute("href");
          newsData.push({
            id,
            title,
            description,
            image,
            url: articleURL,
          });
        }
      });

      return newsData;
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
}

function getCategoryNews(category) {
  const base_url = "https://edition.cnn.com";
  const url = `${base_url}/${category}`;

  return fetch(url)
    .then((response) => response.text())
    .then((html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const newsData = [];

      const cardElements = doc.querySelectorAll(".card");
      cardElements.forEach((card) => {
        const headlineElement = card.querySelector(".container__headline-text");
        const imgElement = card.querySelector("img");
        const aElement = card.querySelector("a");

        if (headlineElement && imgElement) {
          const id = Date.now() + Math.random();
          const title = headlineElement.textContent.trim();
          const description = imgElement.getAttribute("alt");
          const image = imgElement.getAttribute("src");
          const articleURL = base_url + aElement.getAttribute("href");
          newsData.push({
            id,
            title,
            description,
            image,
            url: articleURL,
          });
        }
      });

      return newsData;
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
}

async function getArticleContent(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${url}`);
    }
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    let content = "";
    let timestamp = "";
    let vidUrl = "";

    if (url.includes("videos/")) {
      const vidApi = doc
        .querySelector(".video-resource")
        .getAttribute("data-uri");
      const vidResponse = await fetch(
        "https://fave.api.cnn.io/v1/video?&stellarUri=" + vidApi
      );
      const vidData = await vidResponse.json();
      vidUrl = vidData["files"][0]["fileUri"];
      const contentElement = doc.querySelector(".video-resource__description");
      content = contentElement ? contentElement.textContent.trim() : "";
    } else {
      const contentElement = doc.querySelector(".article__content");
      const timestampElement = doc.querySelector(".timestamp");
      content = contentElement ? contentElement.textContent.trim() : "";
      timestamp = timestampElement ? timestampElement.textContent.trim() : "";
    }

    return { content, timestamp, vidUrl };
  } catch (error) {
    console.error("An error occurred:", error);
    return {
      error: "An error occurred while fetching data.",
      content: "",
      timestamp: "",
      vidUrl: "",
    };
  }
}
