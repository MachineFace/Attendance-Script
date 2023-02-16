/**
 * return an object describing what was passed
 * @param {*} ob the thing to analyze
 * @return {object} object information
 */
const GetObjectType = (ob) => {
  let stringify;
  try {
    // test for an object
    if (ob !== Object(ob)) {
        return {
          type : typeof ob,
          value : ob,
          length : typeof ob === `string` ? ob.length : null 
        } ;
    }
    else {
      try {
        stringify = JSON.stringify(ob);
        console.warn(stringify);
      }
      catch (err) {
        stringify = `{ "result" : "unable to stringify" }`
        console.error(stringify);
      }
      return {
        type : typeof ob ,
        value : stringify,
        name : ob.constructor ? ob.constructor.name : null,
        nargs : ob.constructor ? ob.constructor.arity : null,
        length : Array.isArray(ob) ? ob.length:null
      };       
    }
  }
  catch (err) {
    return { type : `indeterminate type`, } ;
  }
}




/**
 * Clean the junk out of the filename
 */
const FileNameCleanup = (filename) => {
  if (typeof filename !== `string`) filename = filename.toString();

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



/**
 * Parse Students
 * @DEFUNCT
 *
const ParseStudents = (list) => {
  if (typeof list !== `string`) list = list.toString();

  let split = list
    .replace(/\s+/g, '')
    .split(/(?=[A-Z])/)
    .filter(x => x != `Removeattendee`)
  console.error(`DOGSHIT: ${list}`)
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
*/



/**
 * Parse Students
 * @param {string} fucked up list
 * @returns {[string]} repaired array.
 */
const ParseStudents = (list) => {
  if (typeof list !== `string`) list = list.toString();
  // console.error(`DOGSHIT: ${list}`)

  let l = list
    .replace(/\s+/g, '')
    .split(`Removeattendee`)
  let r = [];
  [...l].forEach(x => r.push(x.split(/(?=[A-Z])/)));

  let g = [r[0]];
  for (let i = 0; i < r.length - 1; i++) {
    let firstgroup = r[i];
    let next = r[i + 1];
    let n = [];
    next.forEach(name => {
      if(firstgroup.indexOf(name) == -1) {
        n.push(name);
      }
    });
    g.push(n);
  }
  let merged = [];
  g.forEach(cluster => merged.push(cluster.join(` `)));
  console.warn(merged);
  return merged;
}





const _testListFixer = () => {
  // let list = `Andrew Wang Remove attendee Andrew WangJustin Wang Remove attendee Justin WangThanh Tran Remove attendee Thanh TranConstance Angelopoulos Remove attendee Constance AngelopoulosSiheng Yang Remove attendee Siheng YangMark Theis Remove attendee Mark TheisFranky Ohlinger Remove attendee Franky OhlingerCurtis Hu `;
  // ParseStudents(list);

  let list2 = `Issam Bourai Remove attendee Issam BouraiLydia Moog Remove attendee Lydia MoogJoshua Michael Duarte Remove attendee Joshua Michael DuarteDerek Shah Remove attendee Derek ShahJohn Jacobs Remove attendee John JacobsJohn Roberts Remove attendee John RobertsNoah Johnson Remove attendee Noah JohnsonFlorian Kristof Remove attendee Florian KristofParth Behani`;
  ParseStudents(list2);


}
















