/**
 * ----------------------------------------------------------------------------------------------------------------
 * bCourses Class
 * @NOTIMPLEMENTED
 * sources:
 * https://bcourses.berkeley.edu/doc/api/index.html
 * https://docs.github.com/en/rest/guides/using-pagination-in-the-rest-api?apiVersion=2022-11-28
 * https://gist.github.com/bennettscience/2484d00b8d3f918c75b82bdef99e0bef
 * https://github.com/ucfopen/canvasapi
 * https://github.com/bennettscience/canvas-lms-mastery-helper
 */
class BCourses {
  constructor() {
    this.token = `1072~bXyBuND4sPQniJVJYHRxVOP4gCMrhpUq0BMEVExytR1g4Kaznlm6cGzR5gk872AU`;
    this.root = `https://bcourses.berkeley.edu/api/v1`;
    /** @private */
    this.course = `/courses/1353091`;
    /** @private */
    this.id = '5508592';
    /** @private */
    this.name = `Chris Parsell`;
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

  async GetUsers(pageNumber = 1,) {
    try {
      const repo = "/courses/1353091" + `/users` + `?page=${pageNumber}` + `&per_page=100`;

      const params = {
        method : "GET",
        headers : { "Authorization" : "Bearer " +  this.token},
        contentType : "application/json+canvas-string-ids",
        muteHttpExceptions : true,
        followRedirects : true,
      };
      Sleep(50); // Wait a sec....
      const response = await UrlFetchApp.fetch(this.root + repo, params);
      const responseCode = response.getResponseCode();
      if (responseCode != 200) throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);

      const res = JSON.parse(response.getContentText());
      return res;
    } catch(err) {
      console.error(`"GetGradebook()" failed : ${err}`);
      return 1;
    }
      
  }

  async GetAllUsers() {
    let users = [];
    for(let i = 1; i < 11; i++) {
      let u = await this.GetUsers();
      users.push(...u);
    }
    console.info(`User Count ---> ${users.length}`);
    const filtered = this._FilterBadUsers(users);
    console.info(`User Count ---> ${filtered.length}`);
    filtered.forEach(user => console.info(user));
  }

  _FilterUsers(users) {
    const yr = new Date(new Date().getFullYear() - 5, 1, 1);
    let filtered = [];
    users.forEach(user => {
      let { id, name, created_at, sortable_name, short_name, sis_user_id, integration_id, login_id, email } = user;
      if(!String(login_id).includes(`inactive`) && new Date(created_at) > yr) {
        // console.info(`CreatedAt: ${new Date(created_at)}`);
        // console.info(`Found User: ${name}`);
        filtered.push(user);
      }
    });
    console.info(filtered);
    return filtered;
  }

  _FilterBadUsers(users) {
    const yr = new Date(new Date().getFullYear() - 5, 1, 1);
    return users.filter(user => {
      let { id, name, created_at, sortable_name, short_name, sis_user_id, integration_id, login_id, email } = user;
      if(String(login_id).includes(`inactive`) && new Date(created_at) < yr) return user;
    });
  }

  /**
   * Fetch from API. Returns data as an object. Assumes no pagination needed.
   * @private
   * @param {string} url
   * @param {object} params defaults to "GET" but you can replace with your own params object
   * @return {object} {key: value}
   */
  async _GetData(url) {
    try {
      const params = {
        method : "GET",
        headers : { "Authorization" : "Bearer " +  this.token},
        contentType : "application/json",
        muteHttpExceptions : true,
        followRedirects : true,        
      };

      const response = await UrlFetchApp.fetch(url, params);
      const responseCode = response.getResponseCode();
      if (responseCode != 200) throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);

      const content = response.getContentText();
      console.info(JSON.stringify(content, null, 3));      

      return JSON.parse(content);
    } catch(err) {
      console.error(`"_GetData()" failed : ${err}`);
      return 1;
    }
  }

  /**
   * Get Paginated Data
   * Fetch from API and handle paginated data. Returns data as an object.
   * @param {string} url
   * @param {object} params defaults to "GET" but you can replace with your own params object
   * @return {object} {key: value}
   */
  async GetPaginatedData(url) {
    const params = {
      method : "GET",
      headers : { "Authorization" : "Bearer " +  this.token},
      contentType : "application/json",
      muteHttpExceptions : true,
      followRedirects : true,        
    }
    const nextPattern = /(?<=<)([\S]*)(?=>; rel="Next")/i;
    let pagesRemaining = true;
    let data = {};
    try {
      while (pagesRemaining) {
        let newData = {};
        const response = await UrlFetchApp.fetch(url, params);
        const responseCode = response.getResponseCode();
        if (responseCode != 200) throw new Error(`Bad response from server: ${responseCode} ---> ${RESPONSECODES[responseCode]}`);

        let headers = response.getHeaders();
        let content = response.getContentText();
        let parsedData = JSON.parse(content);
        console.info(content);

        for(const key of Object.keys(parsedData)) { 
          newData[key] = parsedData[key];
        }

        data = {...data, ...newData};
        const linkHeader = headers['Link'];

        pagesRemaining = linkHeader && linkHeader.includes(`rel=\"next\"`);

        if (pagesRemaining) {
          url = linkHeader.match(nextPattern)[0];
        }
      }
      return data;
    } catch (err) {
      console.error(`GetPaginatedData() failed : ${err}`);
      return 1;
    }
  }

  /**
   * Get Appointment
   * @param {string} equipment
   * @param {Date} date
   * @return {object} {key: value}
   */
  async GetAppointment(apptgroup, date = new Date()) {
    try {
      const endpoint = `/appointment_groups/${apptgroup}/`;
      let data = await this.GetPaginatedData(this.root + endpoint);

      let appts = [...data.appointments];
      appts.forEach ((appt, idx) => {
        const startTime = new Date(appt.start_at);
        const sameDay = startTime.getFullYear() === date.getFullYear() && startTime.getMonth() === date.getMonth() && startTime.getDate() === date.getDate();
        if (sameDay) {
          console.info(`Found an appointment on date ${date}`);
          return appt;
        }
      });
      console.info(`No appointment found for the date ${date}`)
      return appts;
    } catch(err) {
      console.error(`GetAppointment() failed : ${err}`);
      return 1;
    }
  }

  /**
   * ------------------------------------------------------------------------------------------------------
   * GetEnrollments
   * Return a list of enrollments
   * @param {string} equipment
   * @param {Date} date
   * @returns {object} {key: value}
   */
  static async GetEnrollments (searchterm, pages = "all") {
    const endpoint = `${ENROLLMENTS}?search_term=${encodeURI(searchterm)}`
    try {
      const results = await this.GetPaginatedData(endpoint, pages)
      // Log.Info('GetJacobsUsers() results', results);
      return results;
    } catch (err) {
      console.error(`SearchUsers(searchterm: ${searchterm}, pages: ${pages}) error: ${err}`);
      return [];
    }
  }

  /**
   * ------------------------------------------------------------------------------------------------------
   * GetInactiveUsers
   * Return users marked as inactive and older than 5 years.
   * @returns {array} [{key: value},{key: value}]
   */
  static async GetInactiveUsers () {
    try {
    const results = await this.GetEnrollments("inactive", 5);
    
    const filtered = this.FilterBadUsers(results);
    // Logger.log(`unfiltered results`);
    // Log.Info('results', results);
    Logger.log(`filtered`);
    Log.Info('filtered inactive users', filtered);
    Logger.log(`GetInactiveUsers() - ${results.length} total "inactive"`);
    Logger.log(`GetInactiveUsers() - ${filtered.length} total "inactive" older than 5 year`);
    } catch (err) {
      console.error(`GetInactiveUsers() error: ${err}`);
    }
  }



  /**
   * ------------------------------------------------------------------------------------------------------
   * GetTrainingAttendees
   * For a
   * @param {string} url url for specific training appointment
   * @returns {array} [{header: value}]
   */
  async GetTrainingAttendees (url) {
    try {
      // url = `${APPT_GROUPS}/${apptgroup}/users`;

      const data = await this.GetPaginatedData(url);
      let students = new Array;
      data[0].child_events.forEach(event => {
        Log.Debug(`GetTrainingAttendees() - Attendee: ${event.user}`);
        students.push({name: event.user.name, id: event.user.id});
      })
      for (let i=0; i<students.length;i++){
        let search = await this.SearchUsers(students[i].id);
        // Log.Debug(`Found email: ${search[0].email}`);
        if (search.length>0) students[i].email = search[0].email;
      }
      return students;
    } catch(err) {
      console.error(`GetTrainingAttendees(URL: ${url}) error: ${err}`);
      return [];
    }
  }

  /**
   * Get Training Attendees
   * @param {string} url url for specific training appointment
   * @return {array} [{header: value}]
   */
  async GetTrainingAttendees(url) {
    try {
      const data = await this.GetPaginatedData(url);
      let students = [];
      data?.child_events.forEach(event => {
        console.info(`User signed up for appointment: ${event.user}`);
        students.push({ name: event.user.name, id: event.user.id });
      })
      return students;
    } catch(err) {
      console.error(`GetTrainingAttendees() failed : ${err}`);
      return 1;
    }
  }

  /**
   * Get User - Fetch user data from API. Returns data as an object.
   * @param {string} id
   * @return {object} {key: value}
   */
  async GetUser(id) {
    const url = this.root + `${this.course}/users/${id}`;
    try {
      let data = await this._GetData(url);
      return data;
    } catch(err) {
      console.error(`GetUser() failed to get user for ID: ${id} : ${err}`);
      return 1;
    }
  }

  /**
   * Is Assignment Complete
   * Check if student has completed a quiz or hands-on training
   * @param {string} assignmentId ID, eg. TRAINING["Form 3"].quiz
   * @param {string} id user's bCourses ID
   * @return {bool} 
   */
  async IsAssignmentComplete(assignmentId, id) {
    try {

      let url = `/courses/1353091/assignments/${assignmentId}/submissions/${id}`;
      // Find out student's grade for quiz
      const data = await this._GetData(this.root + url);
      let grade = data.score;

      // Find out how many points are possible in quiz      
      url = `/courses/1353091/assignments/${assignmentId}`;
      let quizData = await this._GetData(this.root + url);

      let pointsPossible = quizData.points_possible;
      return (grade == pointsPossible);
    } catch (err) {
      console.error(`IsAssignmentComplete() failed to get quiz ${equipmentName} grade for ID: ${id}: ${err}`);
      return 1;
    }
  }
  


  /**
   * ----------------------------------------------------------------------------------------------------------------
   * SearchForID
   * Search for ID of a user. If 1 result is found, it assumes this is correct. 
   * If >1 results and equipment name is provided, then it will assume the 
   * user who also completed the quiz for that equipment is 
   * @param {string} term
   * @param {string} assignment eg. "Markforged" or "Othermill"
   * @return {string} id
   */
  async SearchForID (searchterm, equipment) {
    try {
      let id = "";
      let sheetId = SearchSheetForID(searchterm);
      if (sheetId) { 
        console.info(`Found ID for ${searchterm} in a previous entry on the sheet`)
        id = sheetId;
        return id;
      }
      const results = await this.SearchUser(searchterm);
      console.info(`Results: ${results}`);
      const numResults = Object.keys(results).length;
      if (numResults == 0) {
        console.info(`Unable to find ${rowData.name} based on name provided`);
        return 0;
      } else if (numResults == 1) {
        console.info(`${numResults} found`);
        for (const key of Object.keys(results)) { 
          id = results[key].id;
          console.info(id);
        }
      } else if (numResults > 1) {
        // If multiple results for a name, check if one completed quiz for this training

        let whoCompletedQuiz = 0;
        let candidateID = '';
        for (const key of Object.keys(results)) { 
          // id from results
          let possibleId = results[key].id;
          let quizTaken = await this.IsAssignmentComplete(TRAINING[equipment].quiz, possibleId);
          if (quizTaken) { 
            whoCompletedQuiz++;
            candidateID = possibleId; 
          }
        }
        if (whoCompletedQuiz == 1) {
          // Only one of the results completed the quiz for this training - assume it's the correct result
          console.info(`${numResults} found - One has completed the quiz - assigning grade to that student`);
          id = candidateID;
          return id;
        }
        console.info(`Search returned more than one user - unsure which one is correct`);
      } 
      
      return id;
    } catch(err) {
      console.error(`SearchForID() failed : ${searchterm}, equipment: ${equipment} -- ${err}`);
      return 1;
    }
  }

  /**
   * Search for a User - Search term can be name, ID, email, etc.
   * @param {string} term
   * @return {object} results
   */
  async SearchUser(term) {
    try {
      const endpoint = `/courses/1353091/users?search_term=${term}`
      return await this._GetData(this.root + endpoint);
    } catch(err) {
      console.error(`SearchUser() failed : ${err}`);
      return 1;
    }
  }

  /**
   * Unenroll User
   * Ends enrollment for user - remains visible to admins but student cannot interact with course. Does not work yet AFAIK.
   * @param {string} id
   * @return {object} response
   */
  async UnenrollUser(id) {
    try {
      // let endpoint = `${this.root}${this.course}/enrollments/${id}`;
      // let endpoint = `${this.root}${this.course}/users/${id}`;
      // let endpoint = `${this.root}${this.course}/conclude_user/${id}`;
      const endpoint = `${this.root}${this.course}/unenroll/${id}`;
      const params = {
        method : "DELETE",
        headers : { "Authorization" : "Bearer " +  this.token},
        contentType : "application/json",
        muteHttpExceptions : true,
        followRedirects : true,   
        payload: JSON.stringify({ "task" : "conclude" })     
      }
      return await this._GetData(endpoint, params);
    } catch(err) {
      console.error(`UnenrollUser() failed : ${err}`);
      return 1;
    }
  }

  /**
   * ----------------------------------------------------------------------------------------------------------------
   * DeleteUser
   * Delete user from course. Variation of UnenrollUser. Does not work yet AFAIK. 
   * @param {string} id
   */
  async DeleteUser(id) {
    try {
      // let endpoint = `${this.root}${this.course}/enrollments/${id}`;
      const endpoint = `${this.root}${this.course}/users/${id}`;
      const params = {
        method : "DELETE",
        headers : { "Authorization" : "Bearer " +  this.token},
        contentType : "application/json",
        muteHttpExceptions : true,
        followRedirects : true,   
        payload: JSON.stringify({ "task" : "delete" })     
      }

      const request = await this._GetData(endpoint, params)
      console.info(request);
      return request;
    } catch (err) {
      console.error(`DeleteUser() failed : ${err}`);
      return 1;
    }
  }

  /**
   * ----------------------------------------------------------------------------------------------------------------
   * UpdateGrade
   * Ends enrollment for user - remains visible to admins but student cannot interact with course
   * @param {string} assignment eg. "Markforged" or "Othermill"
   * @param {string} userid
   * @param {string} newgrade use "complete" for pass/fail, "100%", or "A"
   */
  async UpdateGrade (assignment, userid, newgrade) {
    try {
      const endpoint = `/courses/1353091/assignments/${assignment}/submissions/${userid}`;

      const params = {
        method : "PUT",
        headers : { "Authorization" : "Bearer " +  this.token},
        contentType : "application/json",
        muteHttpExceptions : true,
        followRedirects : true,
        payload: JSON.stringify({ 
          // "comment": {    "text_comment": "Thanks for attending the training in Jacobs Hall."  },
          "submission": { "posted_grade": newgrade },
        }),
      }

      const response = await this._GetData(this.root + endpoint, params);
      if (Object.keys(response).length == 0) throw new Error(`Unable to grade ID: ${userid} for assignment: ${assignment}, grade: ${newgrade}`);
      return response;
    } catch(err) {
      console.error(`UpdateGrade() failed to grade Assignment: ${assignment}, ID: ${userid}, New Grade: ${newgrade} -- ${err}`);
      return 1;
    }
  }

  /**
   * ------------------------------------------------------------------------------------------------------
   * EndEnrollment
   * Main function for sending any request to deactivate, inactivate, conclude, or delete an enrollment to the Maker Pass course. 
   * Tasks : `No task provided - options are 'conclude', 'deactivate', 'inactivate', or 'delete'`
   * source: 
   * https://community.canvaslms.com/t5/Canvas-Developers-Group/API-Delete-Enrollment-using-Python-Requests/m-p/155625
   * @private
   * @param {string} enrollment_id the ID of the enrollment of the user to the course
   * @param {string} task the ID of the enrollment of the user to the course
   * @returns {object} response
   */
  async EndEnrollment (enrollment_id, task = `conclude`) {
    try {
      // let endpoint = `${Config.ROOT}${Config.COURSE}/enrollments/${id}`;
      const endpoint = `${ENROLLMENTS}/${enrollment_id}`;
      const params = {
        method : "DELETE",
        headers : { "Authorization" : "Bearer " +  Config.BCOURSES_TOKEN},
        contentType : "application/json",
        muteHttpExceptions : true,
        followRedirects : true,   
        payload: { 
          task : task, 
        },     
      };
      const request = await this.GetData(endpoint, params);
      console.info(`UnenrollUser(${enrollment_id}) response`, request);
      return request;
    } catch (err) {
      console.error(`UnenrollUser(enrollment_id: ${enrollment_id}) error: ${err}`);
      return 1;
    }
  }

  /**
   * -----------------------------------------------------------------------------------------------------
   * DeactivateEnrollment
   * Deactivates enrollment for user - remains visible to admins but student cannot interact with course. 
   * @param {string} id
   * @returns {object} response
   */
  async DeactivateEnrollment (enrollment_id) {
    return await this.EndEnrollment(enrollment_id, "deactivate");
  }

  /**
   * ------------------------------------------------------------------------------------------------------
   * ConcludeUser
   * Concludes enrollment for user - remains visible to admins but student cannot interact with course.
   * @param {string} enrollment_id
   * @returns {object} response
   */
  async ConcludeEnrollment (enrollment_id) {
    return await this.EndEnrollment(enrollment_id, "conclude");
  }

  /**
   * ------------------------------------------------------------------------------------------------------
   * DeleteUser
   * Delete user from course. Variation of UnenrollUser. Does not work yet AFAIK. 
   * @param {string} id
   */
  async DeleteEnrollment (id) {
    return await BCourses.prototype.EndEnrollment(enrollment_id, "delete");
  }

  /**
   * ------------------------------------------------------------------------------------------------------
   * DeleteUser
   * Delete user from course. Variation of UnenrollUser. Does not work yet AFAIK. 
   * @param {string} id
   */
  async InactivateEnrollment (id) {
    return await this.EndEnrollment(enrollment_id, "delete");
  }

  /**
   * ------------------------------------------------------------------------------------------------------
   * UpdateGrade
   * Ends enrollment for user - remains visible to admins but student cannot interact with course
   * @param {string} assignment eg. "Markforged" or "Othermill"
   * @param {string} userid
   * @param {string} newgrade use "complete" for pass/fail, "100%", or "A"
   */
  async UpdateGrade (assignment, userid, newgrade) {
    try {
      const endpoint = `/courses/1353091/assignments/${assignment}/submissions/${userid}`;

      const params = {
        method : "PUT",
        headers : { "Authorization" : "Bearer " +  Config.BCOURSES_TOKEN},
        contentType : "application/json",
        muteHttpExceptions : true,
        followRedirects : true,
        payload: { 
          submission : { 
            posted_grade : newgrade 
          },
        },
      };

      const response = await this.GetData(Config.ROOT + endpoint, params);
      if (Object.keys(response).length == 0) throw new Error(`Unable to grade ID: ${userid} for assignment: ${assignment}, grade: ${newgrade}`);
      return response;
    } catch(err) {
      console.error(`UpdateGrade(assignment: ${assignment}, ID: ${userid}, New Grade: ${newgrade}) failed to grade  -- ${err}`);
      return 1;
    }
  }
}



const _testbCourses = () => {
  new BCourses().GetAllUsers();
  // let user = [
  //   { id: 5448313,
  //     name: 'Jose A La Torre',
  //     created_at: '2017-04-28T03:04:24-07:00',
  //     sortable_name: 'A La Torre, Jose',
  //     short_name: 'Jose A La Torre',
  //     sis_user_id: 'UID:1558132',
  //     integration_id: null,
  //     login_id: 'inactive-1558132',
  //     email: null 
  //   },
  //   { id: 5362885,
  //     name: 'Jonathan Aase',
  //     created_at: '2016-04-12T03:04:15-07:00',
  //     sortable_name: 'Aase, Jonathan',
  //     short_name: 'Jonathan Aase',
  //     sis_user_id: 'UID:1509836',
  //     integration_id: null,
  //     login_id: 'inactive-1509836',
  //     email: null 
  //   },
  //   { id: 5575021,
  //     name: 'Sanzhar Abatov',
  //     created_at: '2020-04-24T03:07:48-07:00',
  //     sortable_name: 'Abatov, Sanzhar',
  //     short_name: 'Sanzhar Abatov',
  //     sis_user_id: '3035661901',
  //     integration_id: null,
  //     login_id: '1712599',
  //     email: 'abatov.kazakhstan@berkeley.edu' 
  //   },
  //   { id: 5521815,
  //     name: 'Eliana Abbas',
  //     created_at: '2019-03-18T03:06:55-07:00',
  //     sortable_name: 'Abbas, Eliana',
  //     short_name: 'Eliana Abbas',
  //     sis_user_id: 'UID:1657390',
  //     integration_id: null,
  //     login_id: 'inactive-1657390',
  //     email: null 
  //   },
  //   { id: 5453573,
  //     name: 'Zahra Abbasi',
  //     created_at: '2017-05-11T03:05:00-07:00',
  //     sortable_name: 'Abbasi, Zahra',
  //     short_name: 'Zahra Abbasi',
  //     sis_user_id: 'UID:1577738',
  //     integration_id: null,
  //     login_id: 'inactive-1577738',
  //     email: null 
  //   },
  //   { id: 5447412,
  //     name: 'Kahini Achrekar',
  //     created_at: '2017-04-26T03:05:35-07:00',
  //     sortable_name: 'Achrekar, Kahini',
  //     short_name: 'Kahini Achrekar',
  //     sis_user_id: 'UID:1565136',
  //     integration_id: null,
  //     login_id: 'inactive-1565136',
  //     email: null 
  //   },
  // ];
  // new BCourses()._FilterUsers(user);
}












