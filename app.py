import requests
from bs4 import BeautifulSoup
import time
import random
from flask import Flask, jsonify

app = Flask(__name__)


class Scraper:
    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
        }
        self.base_url = "https://edition.cnn.com/"
        self.all_categories = [
            "us",
            "world",
            "politics",
            "business",
            "opinions",
            "health",
            "entertainment",
            "style",
            "travel",
            "sports",
        ]

    def _fetch(self, url):
        response = requests.get(url, headers=headers)
        print(response.status_code)
        return response.content if response.status_code == 200 else ""

    def _generate_unique_id(self):
        return int(time.time() * 1000000) + random.randint(1, 1000000)

    def get_content(self, url):
        bsobj = BeautifulSoup(self._fetch(url))
        time = (
            bsobj.find("div", class_="timestamp").text.split(", ")
            if bsobj.find("div", class_="timestamp")
            else ["", "", ""]
        )
        content = (
            [a.text for a in bsobj.find("div", class_="article__content").find_all("p")]
            if bsobj.find("div", class_="article__content")
            else ""
        )
        return "".join(content), "{} {}".format(
            time[1], time[2].replace("\n", "").replace("  ", "")
        )

    def get_category_news(self, category):
        bsobj = BeautifulSoup(self._fetch(self.base_url + category), "lxml")
        return [
            {
                "id": self._generate_unique_id(),
                "description": c[0].find("img").get("alt"),
                "image": c[0].find("img").get("src"),
                "title": c[1].text.replace("\n", ""),
                "url": "https://edition.cnn.com" + c[1].get("href"),
            }
            for b in bsobj.find_all("div", class_="card")
            for c in [b.find_all("a")]
            if [
                a
                for a in b.find_all("a")
                if a.find_all("span", class_="container__headline-text")
            ]
            if len(c) == 2
        ] + [
            {
                "id": self._generate_unique_id(),
                "description": "",
                "image": "",
                "title": c[0].text.replace("\n", ""),
                "url": "https://edition.cnn.com" + c[0].get("href"),
            }
            for b in bsobj.find_all("div", class_="card")
            for c in [b.find_all("a")]
            if not [
                a
                for a in b.find_all("a")
                if a.find_all("span", class_="container__headline-text")
            ]
            if len(c) == 1
        ]


scraper = Scraper()


@app.route("/category/<string:category>")
def category_news(category):
    news_data = scraper.get_category_news(category)
    return jsonify(news_data)


@app.route("/article/<path:url>")
def article_content(url):
    content, timestamp = scraper.get_content(url)
    return jsonify({"content": content, "timestamp": timestamp})


if __name__ == "__main__":
    app.run(debug=True)
