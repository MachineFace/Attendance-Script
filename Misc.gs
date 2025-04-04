
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
      }       
    }
  }
  catch (err) {
    return { type : `indeterminate type`, } ;
  }
}

/**
 * Find an index in an array
 * @param {any} search
 * @returns {int} index
 */
Array.prototype.findIndex = (search) => {
  if (search == "") return false;
  for (let i = 0; i < this.length; i++)
    if (this[i].toString().indexOf(search) > -1) return i;
  return -1;
}

/**
 * Find Missing Elements in Array
 * @param {[]} array 1
 * @param {[]} array 2
 * @return {[]} difference
 */
const FindMissingElementsInArrays = (array1, array2) => {
  let indexes = [];
  array1.forEach( item => {
    let i = array2.indexOf(item);
    indexes.push(i);
  })
  return indexes;
}

// ------------------------------------------------------------------------------------------------

/**
 * Helper Method for TitleCasing Names
 * @param {string} string
 * @returns {string} titlecased
 */
const TitleCase = (str) => {
  if (typeof str !== `string`) str = str.toString();
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
 * Validate an email string
 * @param {string} email
 * @returns {bool} boolean
 */
const ValidateEmail = (email) => {
  const regex = new RegExp(/^[a-zA-Z0-9+_.-]+@[berkeley.edu]+$/);
  let match = regex.test(email);
  console.warn(`Email is valid? : ${match}`)
  return match;
}



// ------------------------------------------------------------------------------------------------

/**
 * Sleep function to wait for execution
 * @param {number} milliseconds
 */
const Sleep = (ms) => Utilities.sleep(ms);










