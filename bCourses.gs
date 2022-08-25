/**
 * ----------------------------------------------------------------------------------------------------------------
 * bCourses Class
 */
class BCourses
{
  constructor() {
    this.token = `1072~WyQLWVWk0exa5l2Y8tpIO6ZRePrc8yrjlGpbz9NpiPag5mJv3SNTub1SA1fiLfax`;
    // this.root = `https://bcourses.berkeley.edu/api/v1`;
    this.root = `https://bcourses.berkeley.edu/courses/1353091`;
    this.id = 5508592;
    this.name = `Cody Glen`;
    this.writer = new WriteLogger();
    // const repo = `/gradebook`;
  }

  async TestPOST() {
    let payload = {};

    // Stuff payload into postParams
    let params = {
      "method" : "POST",
      "headers" : { "Authorization": "Bearer " + Utilities.base64EncodeWebSafe(this.token) },
      "contentType" : "application/json",
      "payload" : payload,
      followRedirects : true,
      muteHttpExceptions : true
    };

    // POST
    const html = await UrlFetchApp.fetch(this.root + repo, params);
    const responseCode = html.getResponseCode();
    this.writer.Debug(`Response Code ---> : ${responseCode} : ${RESPONSECODES[responseCode]}`);

    if(responseCode == 200){
      const response = html.getContentText();
      this.writer.Info(`Response ---> : ${JSON.stringify(response)}`);
    }

    return {
      responseCode : html.getResponseCode(),
      headers : html.getHeaders(),
      response : html.getContentText()
    }
  }

  async TestGET () {

    const repo = "/courses/1353091/"

    const params = {
      "method" : "GET",
        "headers" : {
          "access_token": this.token,
          "token_type": "Bearer",
          "user": {"id": this.id, "name": this.name},
        },
      "contentType" : "application/json",
      followRedirects : true,
      muteHttpExceptions : true
    };

    // GET
    const html = await UrlFetchApp.fetch(this.root + repo, params);
    const responseCode = html.getResponseCode();
    this.writer.Debug(`Response Code ---> : ${responseCode} : ${RESPONSECODES[responseCode]}`);

    if(responseCode == 200) {
      this.writer.Info(`Response ---> : ${JSON.stringify(html.getContentText())}`);
    }
    return {
      responseCode : html.getResponseCode(),
      headers : html.getHeaders(),
      response : html.getContentText()
    }
      
  }

  async Login() {

    const address = `${this.root}/gradebook`;

    // const payload = {
    //   "access_token": this.token,
    //   "token_type": "Bearer",
    //   "grant_type" : "code",
    //   "user": {"id": this.id, "name": this.name},
    //   "expires_in": 3600,
    // };

    // const params = {
    //   "method" : "POST",
    //   "headers" : { "Authorization": `Bearer ${this.token} ` },
    //   "contentType" : "application/json",
    //   "payload" : payload,
    //   followRedirects : true,
    //   muteHttpExceptions : true
    // };

    const params = {
      "method" : "GET",
      "headers" : { "Authorization": `Basic` },
      "contentType" : "application/json",
      followRedirects : true,
      muteHttpExceptions : true
    };

    // GET
    const html = await UrlFetchApp.fetch(address, params);
    const responseCode = html.getResponseCode();
    this.writer.Debug(`Response Code ---> : ${responseCode} : ${RESPONSECODES[responseCode]}`);
    this.writer.Info(html.getContentText())
    if(responseCode < 400) {
      this.writer.Info(`Response ---> : ${JSON.stringify(html.getContentText())}`);
    }
    return {
      responseCode : html.getResponseCode(),
      headers : html.getHeaders(),
      response : html.getContentText()
    }
      
  }

}

const _testbCourses = () => {
  const b = new BCourses();
  b.Login();
}












