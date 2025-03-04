
/**
 * Parse Students
 * @param {string} fucked up list
 * @returns {[string]} repaired array.
 */
const ParseStudents = (list = []) => {
  if (typeof list !== `string`) list = list.toString();
  // console.error(`DOGSHIT: ${list}`)

  // Clean and split the input
  const clusters = list
    .replace(/\s+/g, '') // Remove whitespace
    .split('Removeattendee') // Split by "Removeattendee"
    .map(cluster => cluster.split(/(?=[A-Z])/)); // Split names within each cluster

  // Deduplicate and reconstruct groups
  const repairedGroups = clusters.reduce((result, current, i) => {
    if (i === 0) {
      result.push(current); // Add the first group
    } else {
      // Add only names not already in previous groups
      const previous = result.flat();
      result.push(current.filter(name => !previous.includes(name)));
    }
    return result;
  }, []);

  // Merge groups into strings
  return repairedGroups.map(group => group.join(' '));
}




/**
 * 
 */
const _testListFixer = () => {
  let list = `Andrew Wang Remove attendee Andrew WangJustin Wang Remove attendee Justin WangThanh Tran Remove attendee Thanh TranConstance Angelopoulos Remove attendee Constance AngelopoulosSiheng Yang Remove attendee Siheng YangMark Theis Remove attendee Mark TheisFranky Ohlinger Remove attendee Franky OhlingerCurtis Hu `;
  let x = ParseStudents(list);
  console.info(x);

  let list2 = `Issam Bourai Remove attendee Issam BouraiLydia Moog Remove attendee Lydia MoogJoshua Michael Duarte Remove attendee Joshua Michael DuarteDerek Shah Remove attendee Derek ShahJohn Jacobs Remove attendee John JacobsJohn Roberts Remove attendee John RobertsNoah Johnson Remove attendee Noah JohnsonFlorian Kristof Remove attendee Florian KristofParth Behani`;
  x = ParseStudents(list2);
  console.info(x);
}
















