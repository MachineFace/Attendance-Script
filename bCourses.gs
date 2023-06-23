/**
 * ----------------------------------------------------------------------------------------------------------------
 * bCourses Class
 * @NOTIMPLEMENTED
 */
class BCourses {
  constructor() {
    this.token = `1072~WyQLWVWk0exa5l2Y8tpIO6ZRePrc8yrjlGpbz9NpiPag5mJv3SNTub1SA1fiLfax`;
    // this.root = `https://bcourses.berkeley.edu/api/v1`;
    this.root = `https://bcourses.berkeley.edu/courses/1353091`;
    this.id = 5508592;
    this.name = `Cody Glen`;
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
    Log.Debug(`Response Code ---> : ${responseCode} : ${RESPONSECODES[responseCode]}`);

    if(responseCode == 200){
      const response = html.getContentText();
      Log.Info(`Response ---> : ${JSON.stringify(response)}`);
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
    Log.Debug(`Response Code ---> : ${responseCode} : ${RESPONSECODES[responseCode]}`);

    if(responseCode == 200) {
      Log.Info(`Response ---> : ${JSON.stringify(html.getContentText())}`);
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
    Log.Debug(`Response Code ---> : ${responseCode} : ${RESPONSECODES[responseCode]}`);
    Log.Info(html.getContentText())
    if(responseCode < 400) {
      Log.Info(`Response ---> : ${JSON.stringify(html.getContentText())}`);
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





// Configure the service
const GetBCoursesService = () => {
  const service = OAuth2.createService(`bCourses`)
    .setAuthorizationBaseUrl(PropertiesService.getScriptProperties().getProperty(`BCOURSES_ROOT`))
    .setTokenUrl(PropertiesService.getScriptProperties().getProperty(`BCOURSES_ROOT`) + `login/oauth2/`)
    .setClientId(PropertiesService.getScriptProperties().getProperty(`BCOURSES_USER`))
    .setClientSecret(PropertiesService.getScriptProperties().getProperty(`BCOURSES_PASS`))
    .setCallbackFunction((request) => {
      const service = GetBCoursesService();
      const isAuthorized = service.handleCallback(request);
      if (isAuthorized) { 
        return HtmlService
          .createTemplateFromFile("auth_success")
          .evaluate();
      } else {
        return HtmlService
          .createTemplateFromFile("auth_error")
          .evaluate();
      }
    })
    .setPropertyStore(PropertiesService.getUserProperties())
    .setCache(CacheService.getUserCache())
    .setLock(LockService.getUserLock())
    // .setScope('user-library-read playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private');
  // if (!service.hasAccess()) {
  //   throw new Error('Error: Missing bCourses authorization.');
  // }
  console.info(`Access: ${service.hasAccess()}`);
  console.info(service)
  return service;
}

// Logs the redirect URI to register. You can also get this from File > Project Properties
const GetRedirectUri = () => {
  const redirectURI = GetBCoursesService().getRedirectUri();
  console.log(redirectURI);
  return redirectURI;
}











