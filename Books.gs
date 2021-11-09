class BookLookup
{
  constructor() {
    this.root = `https://openlibrary.org/`;
    this.writer = new WriteLogger();
  }
  
  async LookupBySubject () {
    const repo = `search.json?q=science+fiction`;
    const fields = `&fields=title,author,isbn&limit=500`;

    const params = {
      "method" : "GET",
      "headers" : { "Authorization": `Basic` },
      "contentType" : "application/json",
      followRedirects : true,
      muteHttpExceptions : true
    };

    // GET
    const html = await UrlFetchApp.fetch(this.root + repo + fields, params);
    const responseCode = html.getResponseCode();
    this.writer.Debug(`Response Code ---> : ${responseCode} : ${RESPONSECODES[responseCode]}`);
    if(responseCode < 400) {
      this.writer.Info(`Response ---> : ${html.getContentText()}`);
    }
    return {
      responseCode : html.getResponseCode(),
      headers : html.getHeaders(),
      response : html.getContentText()
    }
  }
}

const _testBookLooker = async () => {
  const b = new BookLookup();
  b.LookupBySubject();
}