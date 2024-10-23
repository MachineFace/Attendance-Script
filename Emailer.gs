/** 
 * @NOTIMPLEMENTED
 */
const CountTotalEmailsSent = async () => {
  let count = 0;
  try {
    let pageToken;
    do {
      const threadList = Gmail.Users.Threads.list('me', {
        q: `label:Jacobs Project Support/JPS Notifications`,
        pageToken: pageToken
      });
      count += threadList.threads.length;
      // if (threadList.threads && threadList.threads.length > 0) {
      //   threadList.threads.forEach(thread => {
      //     console.info(`Snip: ${thread.snippet}`);
      //   });
      // }
      pageToken = threadList.nextPageToken;
    } while (pageToken);
  } catch (err) {
    console.error(`Whoops ----> ${err}`);
  }
  console.warn(`Total Emails Sent : ${count}`);
  return count;
}


/**
 * Lists, for each thread in the user's Inbox, a snippet associated with that thread.
 * @NOTIMPLEMENTED
 */ 
const ListInboxSnippets = () => {
  try {
    let pageToken;
    do {
      const threadList = Gmail.Users.Threads.list('me', {
        q: `label:inbox`,
        pageToken: pageToken
      });
      if (threadList.threads && threadList.threads.length > 0) {
        threadList.threads.forEach(thread => {
          console.info(`Snip: ${thread.snippet}`);
        });
      }
      pageToken = threadList.nextPageToken;
    } while (pageToken);
  } catch (err) {
    console.error(`Whoops ----> ${err}`);
  }
}

/**
 * Create Email Filters
 * @NOTIMPLEMENTED
 */
const CreateEmailFilters = () => {
  try {
    BLOCKLIST.forEach(domain => {
      console.info(`Gonna block this fucker here : ${domain}....`);
      let filter = Gmail.newFilter();
      filter.criteria = Gmail.newFilterCriteria()
      filter.criteria.from = domain;
      filter.action = Gmail.newFilterAction();
      filter.action.removeLabelIds  = ['INBOX', 'UNREAD'];
      let me = Session.getEffectiveUser().getEmail();
      Gmail.Users.Settings.Filters.create(filter, me);
      console.info(`Blocked this fucker : ${domain}....`);
    })    
          
  } catch (err) {
    console.error(`Whoops ----> ${err.toString()}`);
  }
}
