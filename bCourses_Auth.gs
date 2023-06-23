/**
 * ----------------------------------------------------------------------------------------------------------------
 * IN PROGRESS
 */




const baseAuthUrl = `https://accounts.spotify.com`;
const authUrl = baseAuthUrl + `/authorize`;
const refreshUrl = baseAuthUrl + `/api/token`;

const scope = `user-library-read playlist-read-private playlist-read-collaborative user-top-read user-follow-read`;

/**
 * Get From Deployment
 */
const doGet = (e) => {
  if (e.parameter.error) {
    let template = HtmlService.createTemplateFromFile(`auth_error`);
    template.errorText = e.parameter.error;
    return template.evaluate();
  } else if (!e.parameter.code) {
    return HtmlService.createTemplateFromFile(`auth_steps`).evaluate();
  }

  let authInfo = GetFreshAuth(e.parameter.code);
  StoreAuth(authInfo);
  return HtmlService.createTemplateFromFile(`auth_success`).evaluate();
}

/**
 * Generate Auth URL
 */
const GenerateAuthUrl = () => {
  // Generate URL for requesting authorization
  let url = ScriptApp.getService().getUrl();
  let params = `?response_type=code&client_id=` + Config.CLIENT_ID_SPOTIFY + `&scope=` + scope + `&redirect_uri=` + url;
  return authUrl + encodeURI(params);
}

/**
 * Get Fresh Auth
 */
const GetFreshAuth = async (code) => {
  const now = Date.now() / 1000;
  const options = {
    method : "POST",
    contentType : "application/json",
    payload : {
      grant_type : `authorization_code`,
      code : code,
      redirect_uri : ScriptApp.getService().getUrl(),
      client_id : Config.CLIENT_ID_SPOTIFY,
      client_secret : Config.CLIENT_SECRET_SPOTIFY,
    },
  };

  const response = await UrlFetchApp.fetch(refreshUrl, options);
  const newTokens = JSON.parse(response.getContentText());
  
  const authInfo = {
    accessToken : newTokens.access_token,
    refreshToken : newTokens.refresh_token,
    expiry : now + newTokens.expires_in,
  }

  console.info(`Token : ${JSON.stringify(authInfo.accessToken, null, 3)}`);
  return authInfo;
}

/**
 * Get Refresh Auth
 */
const RefreshAuth = async (refreshToken) => {
  const now = Date.now() / 1000;
  const options = {
    method : "POST",
    contentType : "application/json",
    payload : {
      grant_type : `refresh_token`,
      refresh_token : refreshToken,
      client_id : Config.CLIENT_ID_SPOTIFY,
      client_secret : Config.CLIENT_SECRET_SPOTIFY,
    },
  }

  const response = await UrlFetchApp.fetch(refreshUrl, options);
  const newTokens = JSON.parse(response.getContentText());

  let authInfo = {
    accessToken : newTokens.access_token,
    refreshToken : newTokens.refresh_token,
    expiry : now + newTokens.expires_in,
  }

  return authInfo;
}

/**
 * Store Auth
 * Retrieve refreshable auth info from user properties store
 */
const StoreAuth = (authInfo) => {
  try {
    PropertiesService.getUserProperties()
      .setProperties(authInfo);
    return 0;
  } catch(err) {
    console.error(`"StoreAuth()" failed : ${err}`);
    return 1;
  }
}

/**
 * Retrieve Auth
 * Retrieve refreshable auth info from user properties store
 */
const RetrieveAuth = async () => {
  let userProperties = PropertiesService.getUserProperties();
  let authInfo = userProperties.getProperties();

  // Check if auth info is there
  if (!authInfo.hasOwnProperty(`refreshToken`) || !authInfo.hasOwnProperty(`accessToken`)) {
    // First-time auth missing. Needs to be manually authorised.
    throw new Error(`No access/refresh token. You need to deploy & run first-time authentication.`);
  }

  // Check if the auth token has expired yet
  const now = Date.now() / 1000;
  if (now > authInfo.expiry) {
    console.info(`Access token expired. Refreshing authentication...`);
    authInfo = RefreshAuth(authInfo.refreshToken);
    userProperties.setProperties(authInfo);
  }
  return authInfo.accessToken;
}

