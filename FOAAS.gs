

/**
 * ----------------------------------------------------------------------------------------------------------------
 * Fuck Off as a Service
 */
class FuckOffAsAService
{
  constructor({
    username : username = `Me`,
    name : name = `Whatever-your-name-is`,
    company : company = `Whatever-your-dumb-company-is`,
    tool : tool = `Google Apps-Script`,
    something : something = `Eat it`,
    behavior : behavior = `Always asking questions`,
  }) {
    this.root = `https://foass.1001010.com`;     // `http://foaas.com`
    this.username = username;
    this.name = name;
    this.company = company;
    this.tool = tool;
    this.something = something;
    this.behavior = behavior;
    this.reference = `http://google.com`;
    this.endpoints = this.Endpoints();
    this.randomEndpoint = this.endpoints[Math.floor(Math.random() * this.endpoints.length)];

    this.params = {
      "method" : "GET",
      "headers" : { "authorization" : "basic ", "content-type" : "application/json"},
      "content-type" : "application/json",
      "muteHttpExceptions" : true,
    };
  }

  Endpoints () {
    return [
      `/everyone/${this.username}`,
      `/thanks/${this.username}`,
      `/ity/${this.name}/${this.username}`,
      `/linus/${this.name}/${this.username}`,
      `/bag/${this.name}/${this.username}`,
      `/pink/${this.name}`,
      `/given/${this.name}`,
      `/bag/${this.name}/${this.username}`,
      `/bowl/${this.name}/${this.username}`,
      `/everything/${this.username}`,
      `/shakespeare/${this.name}/${this.username}`,
      `/you/${this.name}/${this.username}`,
      `/life/${this.username}`,
      `/that/${this.username}`,
      `/chainsaw/${this.name}/${this.username}`,
      `/eat/${this.name}/${this.username}`,
      `/king/${this.name}/${this.username}`,
      `/lawn/${this.name}/${this.username}`,
      `/off/${this.name}/${this.username}`,
      `/this/${this.username}`,
      `/donut/${this.name}/${this.username}`,
    ]
  }



  async GetRandom () {
    let repo = this.randomEndpoint;

    let html = await UrlFetchApp.fetch(this.root + repo, this.params);
    let responseCode = html.getResponseCode();
    console.info(`Response Code : ${responseCode} ---> ${RESPONSECODES[responseCode]}`);
    if (responseCode !== 200 && responseCode !== 201) {
      console.error(`${responseCode} ---> ${RESPONSECODES[responseCode]} : Failed to Do Dat`);
      return false;
    }
    let content = html.getContentText();
    let parsed = this.Parse(content).title;
    return parsed;
  }

  /**
   * Parse html content.
   * @param {string} html
   * @return {{}} {title : string, subtitle : string}
   */
  Parse (content) {
    content = content.toString();
    const titleStart = content.search(`<h1>`);
    const titleEnd = content.search(`</h1>`);
    const subStart = content.search(`<em>`);
    const subEnd = content.search(`</em>`);
    let title = content.substring(titleStart + 4, titleEnd);
    title = decodeURI(title);
    const sub = content.substring(subStart + 4, subEnd);
    // console.info(`Title : ${title}, Subtitle : ${sub}`);
    return {
      title : title,
      subtitle : sub,
    } 
  }


}


const _testFuckOff = async () => {
  const x = await new FuckOffAsAService({ name : `Mike Roch`}).GetRandom();
  console.info(x);
}

const DoFuckOff = async () => {
  const names = GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.name);
  const absentIndexes = GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.absent);
  for(let i = 0; i < absentIndexes.length; i++) {
    console.info(`Index: ${i + 2}, Item: ${absentIndexes[i]}`);
    if(absentIndexes[i] == true) {
      const fuckoff = await new FuckOffAsAService({ name : names[i] }).GetRandom();
      SetByHeader(SHEETS.Main, HEADERNAMES.fuckOff, i + 2, fuckoff);
    }
  }
}
