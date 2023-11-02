document.addEventListener("DOMContentLoaded", function () {
  // Scroll to top
  var top_links = document.querySelectorAll('a[href="#"]');

  for (var i = 0; i < top_links.length; i++) {
    top_links[i].addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
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
function addRadioStations() {
  var radioStations = {
    "Radio Dukagjini": {
      url: "https://s2.voscast.com:8825/radiodukagjini",
      img: "https://www.dukagjini.com/wp-content/uploads/2022/06/RadioDukagjini.jpg",
    },
    "Shqip Radio": {
      url: "https://s1.voscast.com:11605/shqipradio",
      img: "https://www.dukagjini.com/wp-content/uploads/2022/06/RadioShqip.jpg",
    },
    "Love Radio": {
      url: "https://s1.voscast.com:11607/loveradio",
      img: "https://www.dukagjini.com/wp-content/uploads/2022/06/RadioLove.jpg",
    },
  };

  var selectElement = document.getElementById("radio-select");

  for (var name in radioStations) {
    var optionElement = document.createElement("option");
    optionElement.value = radioStations[name].url;
    optionElement.dataset.img = radioStations[name].img;
    optionElement.textContent = name;
    selectElement.appendChild(optionElement);
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

async function getSearch(search, page, sort) {
  const apiUrl = `https://corsproxy.io/?https://search.prod.di.api.cnn.io/content?q=${search}&size=10&from=${
    (page - 1) * 10
  }&page=${page}&sort=${sort}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const pages = Math.round((data["meta"]["of"] + 5) / 10);
    const news = data["result"];
    const meta = data["meta"];

    return { pages, news, meta };
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

function createSearchNews(results) {
  const searchContainer = document.querySelector(".search_results");
  results.forEach((result) => {
    const resultContainer = document.createElement("a");
    const imageContainer = document.createElement("div");
    const textContainer = document.createElement("div");
    const image = document.createElement("img");
    const header = document.createElement("h2");
    const timestamp = document.createElement("em");
    const description = document.createElement("p");

    resultContainer.href = `news.html?id=${result["url"].replace(
      "www",
      "edition"
    )}&desc=${result["body"]}&image=${result["thumbnail"]}&title=${
      result["headline"]
    }`;
    resultContainer.classList.add("search_item");
    textContainer.classList.add("search_info");
    imageContainer.classList.add("image_container");
    image.src = result["thumbnail"];
    header.innerText = result["headline"];
    timestamp.innerText = result["lastModifiedDate"];
    description.innerText = result["body"];

    textContainer.appendChild(header);
    textContainer.appendChild(timestamp);
    textContainer.appendChild(description);

    if (result["url"].includes("videos/")) {
      const videoTag = document.createElement("b");
      videoTag.innerText = "VIDEO";
      imageContainer.appendChild(videoTag);
    }
    imageContainer.appendChild(image);
    resultContainer.appendChild(imageContainer);
    resultContainer.appendChild(textContainer);

    searchContainer.appendChild(resultContainer);
  });
}

function createPagination(totalPages, currentPage, search) {
  const paginationContainer = document.querySelector(".pagination");

  paginationContainer.innerHTML = "";

  const prevLink = document.createElement("a");
  prevLink.href = `?q=${search}&page=${currentPage - 1}`;
  prevLink.textContent = "Previous";
  prevLink.classList.add("prev_back");

  if (currentPage == 1) {
    prevLink.classList.add("disabled");
    prevLink.addEventListener("click", (e) => e.preventDefault());
  }
  paginationContainer.appendChild(prevLink);

  let startPage = 1;
  let endPage = totalPages > 10 ? 10 : totalPages;

  if (currentPage > 5 && totalPages > 10) {
    startPage = currentPage - 4;
    endPage = currentPage + 5;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = totalPages - 9;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageLink = document.createElement("a");
    pageLink.href = `?q=${search}&page=${i}`;
    pageLink.textContent = i;
    if (i === currentPage) {
      pageLink.classList.add("active");
    }
    paginationContainer.appendChild(pageLink);
  }

  const nextLink = document.createElement("a");
  nextLink.href = `?q=${search}&page=${currentPage + 1}`;
  nextLink.textContent = "Next";
  nextLink.classList.add("prev_back");
  if (currentPage == totalPages) {
    nextLink.classList.add("disabled");
    nextLink.addEventListener("click", (e) => e.preventDefault());
  }
  paginationContainer.appendChild(nextLink);
}

function changeSort(buttonElement) {
  const currentSort = buttonElement.value;
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set("sort", currentSort);
  window.location.search = urlParams.toString();
}
