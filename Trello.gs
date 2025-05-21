

/**
 * ----------------------------------------------------------------------------------------------------------------
 * Fuck Off as a Service
 */
class TrelloService {
  constructor() {
    /** @private */
    this.root = `https://api.trello.com/1`;   
    /** @private */
    this.key = PropertiesService.getScriptProperties().getProperty(`TRELLO_KEY`);  
    /** @private */
    this.secret = PropertiesService.getScriptProperties().getProperty(`TRELLO_SECRET`);  
  }


  /**
   * Get Random Fact
   * @return {string} random fact
   */
  async GetBoards() {
    // `curl 'https://api.trello.com/1'`
    const repo = `${this.root}/boards/b3XlrJtj?key=${this.key}&token=${this.secret}`;
    const params = {
      'method' : "GET",
      'headers' : { 
        'ContentType' : "application/json",
        "Authorization" : "Basic " + Utilities.base64EncodeWebSafe(this.key + ":" + this.secret)
      },
      'muteHttpExceptions' : true,
    }

    try {
      const response = await UrlFetchApp.fetch(this.root + repo, params);
      const responseCode = response.getResponseCode();
      if (![200, 201].includes(responseCode)) {
        throw new Error(`Bad response from server : ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
      }
      const content = response.getContentText();
      // console.info(response.getAllHeaders())
      console.info(HtmlService.createHtmlOutput(content).getContent());
      return content;
    } catch(err) {
      console.error(`"GetBoards()" failed : ${err}`);
      return 1;
    }
  }




}


const do_test = async () => {
  const t = new TrelloService()
  t.GetBoards();
}







/**
 * Create Service
 * @NOTIMPLEMENTED
 */
const CreateTrelloService = () => {
  const service = OAuth2.createService(`Trello`)
    .setAuthorizationBaseUrl(PropertiesService.getScriptProperties().getProperty(`TRELLO_ROOT`))
    .setTokenUrl(PropertiesService.getScriptProperties().getProperty(``))
    .setClientId(PropertiesService.getScriptProperties().getProperty(`TRELLO_KEY`))
    .setClientSecret(PropertiesService.getScriptProperties().getProperty(`TRELLO_SECRET`))
    .setCallbackFunction((request) => {
      const service = CreateTrelloService();
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
    .setScope('user-library-read playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private');
  // if (!service.hasAccess()) {
  //   throw new Error('Error: Missing trello authorization.');
  // }
  console.info(`Access: ${service.hasAccess()}`);
  console.info(service)
  return service;
}

/**
 * Logs the redirect URI to register. You can also get this from File > Project Properties
 */
const GetRedirectUri = () => {
  const redirectURI = CreateBCoursesService().getRedirectUri();
  console.log(redirectURI);
  return redirectURI;
}

/**
 * Reset Service
 */
const ResetOAuth = () => {
  CreateBCoursesService().reset();
}

/**
 * Attempts to access a non-Google API using a constructed service
 * @param {String} url         The URL to access.
 * @param {String} method_opt  The HTTP method. Defaults to GET.
 * @param {Object} headers_opt The HTTP headers. Defaults to an empty object. The Authorization field is added to the headers in this method.
 * @return {HttpResponse} the result from the UrlFetchApp.fetch() call.
 */
const AccessProtectedResource = (url) => {
  const service = CreateBCoursesService();
  let isAuth = service.hasAccess();
  if(!isAuth) {
    CardService.newAuthorizationException()
      .setAuthorizationUrl(service.getAuthorizationUrl())
      .setResourceDisplayName("Display name to show to the user")
      .throwException();
    return;
  }
  // A token is present, but it may be expired or invalid. Make a request and check the response code to be sure.
  const accessToken = service.getAccessToken();
  const params = {
    method : "GET",
    headers : { "Authorization": "Bearer " + Utilities.base64EncodeWebSafe(accessToken) },
    contentType : "application/json",
    muteHttpExceptions : true,
  }

  const response = UrlFetchApp.fetch(url, params);
  const responseCode = response.getResponseCode();
  if (responseCode <= 200 || responseCode >= 300) throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
  if (responseCode == 401 || responseCode == 403) isAuth = false; 
  return response.getContentText("utf-8"); // Success
}
