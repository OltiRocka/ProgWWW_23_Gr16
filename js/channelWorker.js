self.onmessage = async (e) => {
  const { action, url } = e.data;

  if (action === "fetchIframeSrc") {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const srcRegex = /<iframe.*?src="(.*?)"/i;
      const match = srcRegex.exec(html);
      const iframeSrc = match ? match[1] : null;

      if (iframeSrc) {
        self.postMessage({ success: true, iframeSrc });
      } else {
        throw new Error("Iframe src not found");
      }
    } catch (error) {
      self.postMessage({ success: false, error: error.message });
    }
  }
};
