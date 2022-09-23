/**
 * Helper Method for TitleCasing Names
 * @param {string} string
 * @returns {string} titlecased
 */
const TitleCase = (str) => {
  str = str
    .toLowerCase()
    .split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
  }
  return str.join(' ');
}


/**
 * Clean the junk out of the filename
 */
const FileNameCleanup = (filename) => {
  const regex = /[0-9_]/g;
  const regex2 = /[.]gcode/g;
  const regex3 = /\b[.]modified\b/g;
  if(!filename) return;

  const fixed = filename
    .toString()
    .replace(regex,``)
    .replace(regex2, ``)
    .replace(regex3, ``)
    .replace(regex2, ``)
  return TitleCase(fixed).replace(` `, ``);
}




const ParseStudents = (list) => {
  let split = list
    .replace(/\s+/g, '')
    .split(/(?=[A-Z])/)
    .filter(x => x != `Removeattendee`)
  // let nameset = [...new Set(split)];
  console.warn(`PRE: ${split}`);
  let firstnames = split
    .filter((x, idx) => (idx % 2 == 0))
    .filter((x, idx) => (idx % 2 == 0))
  let lastnames = split
    .filter((x, idx) => (idx % 2 == 1))
    .filter((x, idx) => (idx % 2 == 0))
  let out = [];
  firstnames.forEach( (firstname, idx) => out.push(`${firstname} ${lastnames[idx]}`));
  console.warn(out)
  return out;
}


const _testListFixer = () => {
  let list = `Andrew Wang Remove attendee Andrew WangJustin Wang Remove attendee Justin WangThanh Tran Remove attendee Thanh TranConstance Angelopoulos Remove attendee Constance AngelopoulosSiheng Yang Remove attendee Siheng YangMark Theis Remove attendee Mark TheisFranky Ohlinger Remove attendee Franky OhlingerCurtis Hu `;
  ParseStudents(list);
}
















