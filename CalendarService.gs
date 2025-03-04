

class CalendarService {
  constructor() {
    /** @private */
    this.calendar = CalendarApp.getCalendarById(PropertiesService.getScriptProperties().getProperty(`CALENDAR_ID`));
  }

  /**
   * Get All Events
   */
  get Events() {
    const todayMillis = TimeService.DateToMilliseconds(new Date());
    const days1000 = TimeService.DaysToMillis(1000);
    const minus1000 = new Date(todayMillis - days1000);
    const plus1000 = new Date(todayMillis + days1000);

    const events = this.calendar
      .getEvents(minus1000, plus1000);
    return events
  }

  /**
   * Create a calendar event from a list of events
   * @param {[event]} events
   */
  CreateCalendarEvents(events = []) {
    events.forEach(event => this.CreateCalendarEvent(event));
  }

  /**
   * Delete Event by ID
   * @param {string} id
   */
  DeleteEvent(id = ``) {
    try {
      this.calendar.getEventById(id)
        .deleteEvent();
      console.warn(`Event (${id}) Deleted`);
      return 0;
    } catch(err) {
      console.error(`"DeleteEvent()" failed: ${err}`);
      return 1;
    }
  }

  /**
   * Delete All Events
   */
  DeleteAllEvents() {
    const events = this.Events;
    events && Object.entries(events).forEach(([key, event], idx) => {
      event.deleteEvent();
    });
    return 0;
  }

  /**
   * Remove Duplicates
   */
  RemoveDuplicateEvents() {
    try {
      const events = this.Events;
      events.forEach(event => {
        if(this.EventExists(event)) {
          const title = event.getTitle();
          const eventID = event.getDescription()
            .split(`ID:`)[1]
            .replace(/^\s\s*/, "")
            .replace(/\s\s*$/, "")
          console.info(`DELETING DUPLICATE EVENT! (${title} @ ${eventID})`);
          // event.deleteEvent();
        }
      });
      console.info(`No Duplicate Events found.`);
      return 0;
    } catch(err) {
      console.error(`"RemoveDuplicateEvents()" failed: ${err}`);
      return 1;
    }
  }

  /**
   * Create a Single Calendar Event
   * format: {
      id : ``,
      title : "",
      date : "2023-06-24T04:00:00Z",
      address : "",
    }
  * @param {object} event 
  */
  CreateCalendarEvent(event = {}) {
    try {
      if(this.EventExists(event)) return; // Already there? Do nuthin
      console.info(`EVENT -----> ${JSON.stringify(event, null, 3)}`);
      let { id, title, date, address, } = event;
      date  = new Date(event.date);
      const endTime = new Date(this.AddHours(date, 1.5));
      const description = `
        ID: ${id}\n
        Title: ${title}\n
        Date: ${date}\n
        Address: ${address}\n
      `;
      this.calendar
        .createEvent(
          `${title} at ${address}`, 
          date, 
          endTime, {
            location : address,
            description : description,
          },
        );
      console.warn(`Created calendar event for ${title}`);
      return 0;
    } catch(err) {
      console.error(`"CreateCalendarEvent()" failed: ${err}`);
      return 1;
    }
  }

  /**
   * Test if Event Exists
   */
  EventExists(event = {}) {
    const { id, title, date, address } = event;
    const events = this.Events;
    if(Object.entries(events).length == 0) return false;

    for(let i = 0; i < Object.entries(events).length; i++) {
      const [key, event] = Object.entries(events)[i];
      const eventID = event.getDescription()
        .split(`ID:`)[1]
        .replace(/^\s\s*/, "")
        .replace(/\s\s*$/, "")
      // console.info(eventID);
      if(eventID == id) return true;
    }
    return false;
  }

  /**
   * Add Hours
   * @param {Date} time initial
   * @param {Number} hours to add
   * @returns {Date} new date
   */
  AddHours(time = new Date(), h = 1) {
    const date = new Date(time).getTime();
    return new Date(date + (h * 60 * 60 * 1000));
  }

  /**
   * Parse Date Times
   * @param {array} array of text dates
   * @returns {array} array of dates
   */
  static ParseDateTimes(dateTimes = []) {
    return dateTimes.map(entry => {
      const [date, time] = entry.split(/(?<=\d{4})\s+/);
      const [startTime, period] = time.split(/(?=\s*(AM|PM))/i);

      // Convert startTime to military time
      let [hours, minutes] = startTime.split(':');
      hours = parseInt(hours, 10);
      minutes = parseInt(minutes || '0', 10);
      if (/PM/i.test(period) && hours !== 12) hours += 12;
      if (/AM/i.test(period) && hours === 12) hours = 0;

      // Parse date into components
      const parsedDate = new Date(date);
      const year = parsedDate.getFullYear();
      const month = parsedDate.getMonth(); // Months are zero-based in Date.UTC
      const day = parsedDate.getDate();

      // Create a UTC-based array

      // Extract components for the desired format
      const dx = {
        year : year,
        month : month, // Months are zero-based
        day : day,
        hours : hours,
        minutes : minutes,
        seconds : 0, // Seconds are not provided in the input
      }

      // console.info(dx);
      return dx;

    });

  }

}

/**
 * Remove Duplicate Events
 * @TRIGGERED
 */
const RemoveDuplicateEvents = () => new CalendarService().RemoveDuplicateEvents();

/**
 * Delete All Events
 */
const DeleteAllEvents = () => new CalendarService().DeleteAllEvents();

/**
 * Build CalendarFromSheet
 */
const BuildCalendarFromSheet = () => {
  const calendar = new CalendarService();
  for(let i = 2; i < SHEETS.Events.getLastRow() + 1; i++) {
    const event = SheetService.GetRowData(SHEETS.Events, i);
    calendar.CreateCalendarEvent(event);
  }
  for(let i = 2; i < SHEETS.ComedyEvents.getLastRow() + 1; i++) {
    const event = SheetService.GetRowData(SHEETS.ComedyEvents, i);
    calendar.CreateCalendarEvent(event);
  }
}

/**
 * Build Calendar From List
 */
const BuildCalendarFromList = () => {
  const cs = new CalendarService();

  const tormach_date_times = [
    'Tuesday, January 21, 2025 10-11am',
    'Thursday, January 23, 2025 2-3pm',
    'Tuesday, January 28, 2025 2-3pm',
    'Thursday, January 30, 2025 10-11am',
    'Tuesday, February 4, 2025 10-11am',
    'Thursday, February 13, 2025 2-3pm',
    'Tuesday, February 18, 2025 2-3pm',
    'Thursday, February 27, 2025 10-11am',
    'Tuesday, March 4, 2025 2-3pm',
    'Thursday, March 13, 2025 10-11am',
  ];
  const shopbot_date_times = [
    `Wednesday, January 22, 2025	10-11am`,
    `Wednesday, February 5, 2025	10-11am`,
    `Wednesday, March 5, 2025	10-11am`,
  ];


  let tormach_dates = CalendarService.ParseDateTimes(tormach_date_times);
  tormach_dates.forEach(dateObject => {
    const { year, month, day, hours, minutes, seconds, } = dateObject;
    const date = new Date(year, month, day, hours, 0, 0);
    let event = {
      id : IDService.createId(),
      title : `Tormach CNC Training`,
      address : `Jacobs Metal Shop`,
      date : date,
    }
    console.info(`Event: ${JSON.stringify(event, null, 2)}`);
    cs.CreateCalendarEvent(event);
  });

  let shopbot_dates = CalendarService.ParseDateTimes(shopbot_date_times);
  shopbot_dates.forEach(dateObject => {
    const { year, month, day, hours, minutes, seconds, } = dateObject;
    const date = new Date(year, month, day, hours, 0, 0);
    let event = {
      id : IDService.createId(),
      title : `Shopbot CNC Training`,
      address : `Jacobs 120C`,
      date : date,
    }
    console.info(`Event: ${JSON.stringify(event, null, 2)}`);
    cs.CreateCalendarEvent(event);
  });
}








