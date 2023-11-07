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
  let max_pag;
  if (window.innerWidth <= 600) {
    max_pag = 3;
  } else {
    max_pag = 10;
  }
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
  let endPage = totalPages > max_pag ? max_pag : totalPages;

  if (currentPage > 5 && totalPages > max_pag) {
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
async function getChannelData(channel) {
  const channelList = [
    { name: "", url: "./assets/onhold.jpg", img: "" },
    {
      name: "RTK 1",
      abbr: "RTK",
      url: "https://video.gjirafa.com/embed/rtk1?autoplay=true",
      img: "https://ub1doy938d.gjirafa.net/media/zykxzq/thumbnails/standart.jpg",
    },
    {
      name: "RTV 21",
      abbr: "RTV 21",
      url: "https://video.gjirafa.com/embed/rtv-21-live?autoplay=true",
      img: "https://ub1doy938d.gjirafa.net/media/zy1zzz/thumbnails/standart.jpg",
    },
    {
      name: "KTV",
      abbr: "KOHA Net",
      url: "https://video.gjirafa.com/embed/ktv-live?autoplay=true",
      img: "https://ub1doy938d.gjirafa.net/media/zxzk11/thumbnails/standart.jpg",
    },
    {
      name: "T7",
      abbr: "T7",
      url: "https://video.gjirafa.com/embed/t7-live?autoplay=true",
      img: "https://ub1doy938d.gjirafa.net/media/yzg0yt/thumbnails/standart.jpg",
    },
    {
      name: "Big Brother VIP 1",
      abbr: "Big Brother",
      url: await fetch(
        "https://corsproxy.io/?https://bigbrothervipkosovalive.com/kanali-1/"
      )
        .then((response) => response.text())
        .then((html) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          const iframeSrc = doc.querySelector("iframe").getAttribute("src");
          return iframeSrc;
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
        }),
      img: "https://media.anabelmagazine.com/o.anabel.al/media3/-785-0-637be0bbd8b8e.jpg",
    },
    {
      name: "Big Brother VIP 2",
      abbr: "Big Brother",
      url: await fetch(
        "https://corsproxy.io/?https://bigbrothervipkosovalive.com/kanali-2/"
      )
        .then((response) => response.text())
        .then((html) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          const iframeSrc = doc.querySelector("iframe").getAttribute("src");
          return iframeSrc;
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
        }),
      img: "https://media.anabelmagazine.com/o.anabel.al/media3/-785-0-637be0bbd8b8e.jpg",
    },
    {
      name: "SYRI VISION",
      abbr: "TV SYRI VISION",
      url: "https://video.gjirafa.com/embed/syrivision?autoplay=true",
      img: "https://ub1doy938d.gjirafa.net/media/y10z1k/thumbnails/standart.jpg",
    },
    {
      name: "RTK 2",
      abbr: "RTK",
      url: "https://video.gjirafa.com/embed/rtk2?autoplay=true",
      img: "https://ub1doy938d.gjirafa.net/media/zykxz0/thumbnails/standart.jpg",
    },
    {
      name: "ATV LIVE",
      abbr: "ATV",
      url: "https://video.gjirafa.com/embed/atv-live-tv?autoplay=true",
      img: "https://ub1doy938d.gjirafa.net/media/zyq001/thumbnails/standart.jpg",
    },
    {
      name: "RTK 3",
      abbr: "RTK",
      url: "https://video.gjirafa.com/embed/rtk3?autoplay=true",
      img: "https://ub1doy938d.gjirafa.net/media/zykxzk/thumbnails/standart.jpg",
    },
    {
      name: "RTK 4",
      abbr: "RTK",
      url: "https://video.gjirafa.com/embed/rtk4?autoplay=true",
      img: "https://ub1doy938d.gjirafa.net/media/zykxgt/thumbnails/standart.jpg",
    },
    {
      name: "A2 CNN",
      abbr: "A2 CNN",
      url: "https://video.gjirafa.com/embed/a2-cnn-live?autoplay=true",
      img: "https://ub1doy938d.gjirafa.net/media/y11g0y/thumbnails/standart.jpg",
    },
    {
      name: "ZICO TV",
      abbr: "ZICO TV",
      url: "https://video.gjirafa.com/embed/zico-tv-live?autoplay=true",
      img: "https://ub1doy938d.gjirafa.net/media/y1k0kk/thumbnails/standart.jpg",
    },
    {
      name: "PRO1",
      abbr: "PRO1",
      url: "https://video.gjirafa.com/embed/pro1-tv-2?autoplay=true",
      img: "https://ub1doy938d.gjirafa.net/media/zzgyqg/thumbnails/standart.jpg",
    },
    {
      name: "Arta News",
      abbr: "KOHA Net",
      url: "https://video.gjirafa.com/embed/arta-news?autoplay=true",
      img: "https://ub1doy938d.gjirafa.net/media/yt1q1x/thumbnails/standart.jpg",
    },
    {
      name: "RTV Besa",
      abbr: "RTV Besa",
      url: "https://video.gjirafa.com/embed/rtv-besa-live-2?autoplay=true",
      img: "https://ub1doy938d.gjirafa.net/media/zztyzt/thumbnails/standart.jpg",
    },
    {
      name: "TV News",
      abbr: "TV News",
      url: "https://video.gjirafa.com/embed/tv-news-live?autoplay=true",
      img: "https://ub1doy938d.gjirafa.net/media/zzy1kt/thumbnails/standart.jpg",
    },
    {
      name: "TV Teuta",
      abbr: "TV Teuta",
      url: "https://video.gjirafa.com/embed/tv-teuta-live?autoplay=true",
      img: "https://ub1doy938d.gjirafa.net/media/zty1gq/thumbnails/standart.jpg",
    },
  ];
  const data = channelList.filter((i) => i.name === channel)[0];
  return { data, channelList };
}

function getFormattedDate() {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date().toLocaleDateString("en-US", options);
}

function updateLocationText(city, country) {
  document.getElementById(
    "today"
  ).innerText = `${getFormattedDate()} - ${city}, ${country}`;
}

async function getLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          const city =
            data.address.city ||
            data.address.village ||
            data.address.town ||
            "Unknown city";
          const country = data.address.country || "Unknown country";

          updateLocationText(city, country);
        } catch (error) {
          console.error("Geocoding error:", error);
          updateLocationText("Location not available", "");
        }
      },
      (error) => {
        console.warn(`ERROR(${error.code}): ${error.message}`);
        updateLocationText("Location permission denied", "");
      }
    );
  } else {
    updateLocationText("Geolocation not supported", "");
  }
}
function searchOnPhone() {
  const form = document.getElementById("searchForm");
  const header = document.getElementsByTagName("header")[0];
  const bar = document.getElementById("search_bar");
  const currentMaxHeight = window.getComputedStyle(bar).maxHeight;

  if (currentMaxHeight === "0px" || currentMaxHeight === "") {
    bar.style.maxHeight = "500px";
    form.style.maxHeight = "500px";
    header.style.paddingBottom = "60px";
    setTimeout(() => {
      form.style.opacity = "1";
    }, 10);
  } else {
    bar.style.maxHeight = "0";
    form.style.maxHeight = "0";
    header.style.paddingBottom = "10px";
    form.style.opacity = "0";
  }
}
