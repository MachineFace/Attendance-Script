/**
 * ----------------------------------------------------------------------------------------------------------------
 * bCourses Class
 * @NOTIMPLEMENTED
 */
class BCourses {
  constructor() {
    this.token = `1072~bXyBuND4sPQniJVJYHRxVOP4gCMrhpUq0BMEVExytR1g4Kaznlm6cGzR5gk872AU`;
    this.root = `https://bcourses.berkeley.edu/api/v1`;
    this.id = 5508592;
    this.name = `Cody Glen`;
    // const repo = `/gradebook`;
  }

  /**
   * Create bCourses Service
   */
  CreateService() {
    const service = OAuth2.createService(`bCourses`)
      .setAuthorizationBaseUrl(PropertiesService.getScriptProperties().getProperty(`BCOURSES_ROOT`))
      .setTokenUrl(PropertiesService.getScriptProperties().getProperty(`BCOURSES_ROOT`) + `login/oauth2/auth?`)
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

  async TestPOST() {
    try {
      let payload = {};

      // Stuff payload into postParams
      let params = {
        method : "POST",
        headers : { "Authorization": "Bearer " + Utilities.base64EncodeWebSafe(this.token) },
        contentType : "application/json",
        payload : payload,
        followRedirects : true,
        muteHttpExceptions : true,
      };

      // POST
      const response = await UrlFetchApp.fetch(this.root + repo, params);
      const responseCode = response.getResponseCode();
      if (responseCode != 200) throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);

      Log.Info(`Response ---> : ${JSON.stringify(response, null, 3)}`);

      return {
        responseCode : response.getResponseCode(),
        headers : response.getHeaders(),
        response : response.getContentText()
      }
    } catch(err) {
      console.error(`"TestPOST()" failed : ${err}`);
      return 1;
    }
  }

  async TestGET() {
    try {
      const repo = "/courses/1353091/"

      const params = {
        method : "GET",
        headers : { "Authorization" : "Bearer " +  this.token},
        contentType : "application/json",
        muteHttpExceptions : true,
        followRedirects : true,
      };

      const response = await UrlFetchApp.fetch(this.root + repo, params);
      const responseCode = response.getResponseCode();
      if (responseCode != 200) throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);

      const res = JSON.parse(response.getContentText());
      console.info(JSON.stringify(res, null, 3));
      return res;
    } catch(err) {
      console.error(`"TestGET()" failed : ${err}`);
      return 1;
    }
      
  }

  async GetUsers() {
    try {
      const repo = "/courses/1353091" + `/users` + `?per_page=100`;

      const params = {
        method : "GET",
        headers : { "Authorization" : "Bearer " +  this.token},
        contentType : "application/json+canvas-string-ids",
        muteHttpExceptions : true,
        followRedirects : true,
      };

      const response = await UrlFetchApp.fetch(this.root + repo, params);
      const responseCode = response.getResponseCode();
      if (responseCode != 200) throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);

      const res = JSON.parse(response.getContentText());

      console.info(JSON.stringify(res, null, 3));
      return res;
    } catch(err) {
      console.error(`"GetGradebook()" failed : ${err}`);
      return 1;
    }
      
  }



}

const _testbCourses = () => {
  new BCourses().GetUsers();
}





/**
 * Create Service
 */
const CreateBCoursesService = () => {
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







