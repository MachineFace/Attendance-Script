
/**
 * Parse Students
 * @param {string} fucked up list
 * @returns {[string]} repaired array.
 */
const ParseStudents = (list = []) => {
  if (typeof list !== `string`) list = list.toString();
  // console.error(`DOGSHIT: ${list}`)

  let l = list
    .replace(/\s+/g, '')
    .split(`Removeattendee`)
  let r = [...l.map(x => x.split(/(?=[A-Z])/))];

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




/**
 * 
 */
const _testListFixer = () => {
  // let list = `Andrew Wang Remove attendee Andrew WangJustin Wang Remove attendee Justin WangThanh Tran Remove attendee Thanh TranConstance Angelopoulos Remove attendee Constance AngelopoulosSiheng Yang Remove attendee Siheng YangMark Theis Remove attendee Mark TheisFranky Ohlinger Remove attendee Franky OhlingerCurtis Hu `;
  // ParseStudents(list);

  let list2 = `Issam Bourai Remove attendee Issam BouraiLydia Moog Remove attendee Lydia MoogJoshua Michael Duarte Remove attendee Joshua Michael DuarteDerek Shah Remove attendee Derek ShahJohn Jacobs Remove attendee John JacobsJohn Roberts Remove attendee John RobertsNoah Johnson Remove attendee Noah JohnsonFlorian Kristof Remove attendee Florian KristofParth Behani`;
  ParseStudents(list2);

}
















