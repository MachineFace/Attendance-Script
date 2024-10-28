/**
 * Load GasT for Testing
 * See : https://github.com/huan/gast for instructions
 */
const gasT_URL = `https://raw.githubusercontent.com/huan/gast/master/src/gas-tap-lib.js`;

/**
 * Test Metrics with GasT
 */
const _gasTMetricsTesting = async () => {
  if ((typeof GasTap) === 'undefined') { 
    eval(UrlFetchApp.fetch(gasT_URL).getContentText());
  }
  console.warn(`Testing: ${new Error().stack.split('\n')[1].split(`at `)[1]}`);  // Print Enclosing Function Name
  const test = new GasTap();

  await test(`CountEachCategoryTrained`, t => {
    const x = Calculate.CountCategories();
    t.notThrow(() => x,`CountEachCategoryTrained SHOULD NOT throw error. ${JSON.stringify(x)}`);
    // t.equal(isNaN(y), true, `SumStatuses SHOULD return NaN for forbidden sheet: ${y}`);
  });

  await test(`PrintAttendance`, t => {
    const x = Calculate.PrintAttendance();
    t.notThrow(() => x,`PrintAttendance SHOULD NOT throw error. ${x}`);
    t.equal(!isNaN(x), true, `PrintAttendance SHOULD return a number ${x}`);
  });

  await test(`CountAllTrainedUsers`, t => {
    const x = Calculate.CountAllTrainedUsers();
    t.notThrow(() => x,`CountAllTrainedUsers SHOULD NOT throw error: ${x}`);
    t.equal(!isNaN(x), true, `CountAllTrainedUsers SHOULD return a number: ${x}`);
  });

  await test(`Calc Distribution`, (t) => {
    const x = Calculate.GetTrainingTypeDistribution();
    t.notEqual(x, undefined || null, `Distribution should not return undefined: ${x.slice(0, 3)}`);
  });

  await test(`SumCategories`, (t) => {
    const x = Calculate.SumCategories();
    t.notEqual(x, undefined || null, `SumCategories should not return undefined: ${JSON.stringify(x)}`);
  });
  

  await test.finish();
  if (test.totalFailed() > 0) throw "Some test(s) failed!";
}


/**
 * Test Misc with GasT
 */
const _gasTMiscTesting = async () => {
  if ((typeof GasTap) === 'undefined') { 
    eval(UrlFetchApp.fetch(gasT_URL).getContentText());
  }
  console.warn(`Testing: ${new Error().stack.split('\n')[1].split(`at `)[1]}`);  // Print Enclosing Function Name
  const test = new GasTap();

  // ------------------------------------------------------------------------------------------------------------------------------
  await test(`GetByHeader`, (t) => {
    const x = SheetService.GetByHeader(SHEETS.Main, HEADERNAMES.fuckOff, 5);
    t.notEqual(x, undefined || null, `GetByHeader SHOULD NOT return undefined or null: ${x}`);

    const y = SheetService.GetByHeader(SHEETS.Main, `BAD COLUMN NAME`, 2);
    t.equal(y, 1, `GetByHeader SHOULD return "1". Actual: ${y}`);

    const z = SheetService.GetByHeader(`BAD SHEET`, HEADERNAMES.name, 2);
    t.equal(y, 1, `GetByHeader SHOULD return "1". Actual: ${y}`);

    const a = SheetService.GetByHeader(`BAD SHEET`, `BAD COLUMN NAME`, `BAD ROW NUMBER`);
    t.equal(a, 1, `GetByHeader SHOULD return "1". Actual: ${a}`);
  });

  await test(`GetColumnDataByHeader`, (t) => {
    const x = SheetService.GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.name);
    t.notEqual(x, undefined || null, `GetColumnDataByHeader SHOULD NOT return undefined or null: ${x.slice(0, 10)}`);

    const y = SheetService.GetColumnDataByHeader(SHEETS.Main, `BAD COLUMN NAME`);
    t.equal(y, 1, `GetColumnDataByHeader SHOULD return "1". Actual: ${y}`);

    const z = SheetService.GetColumnDataByHeader(OTHERSHEETS.Chart, HEADERNAMES.name);
    t.equal(z, 1, `GetColumnDataByHeader SHOULD return "1". Actual: ${z}`);

    const a = SheetService.GetColumnDataByHeader(OTHERSHEETS.Chart, `Brrp`);
    t.equal(a, 1, `GetColumnDataByHeader SHOULD return "1". Actual: ${a}`);
  });

  await test(`GetRowData`, (t) => {
    const x = SheetService.GetRowData(3);
    t.notEqual(x, undefined || null, `GetRowData SHOULD NOT return undefined or null: ${JSON.stringify(x)}`);

    const y = SheetService.GetRowData(`BAD ROW NUMBER`);
    t.equal(y, 1, `GetRowData SHOULD return "1". Actual: ${y}`);
  });

  await test.finish();
  if (test.totalFailed() > 0) throw "Some test(s) failed!";
}



/**
 * Test Logger with GasT
 */
const _gasTLoggerTesting = async () => {
  if ((typeof GasTap) === 'undefined') { 
    eval(UrlFetchApp.fetch(gasT_URL).getContentText());
  }
  console.warn(`Testing: ${new Error().stack.split('\n')[1].split(`at `)[1]}`);  // Print Enclosing Function Name
  const test = new GasTap();

  await test(`WriteLogger`, (t) => {
    console.time(`EXECUTION TIMER`);

    const w = Log.Warning(`Ooopsies ----> Warning`);
    const i = Log.Info(`Some Info`);
    const e = Log.Error(`ERROR`);
    const d = Log.Debug(`Debugging`);
    const c = Log._CleanupSheet();
    

    console.timeEnd(`EXECUTION TIMER`);
    t.notThrow(() => w,`Warning SHOULD NOT throw error.`);
    t.notThrow(() => i,`Info SHOULD NOT throw error.`);
    t.notThrow(() => e,`Error SHOULD NOT throw error.`);
    t.notThrow(() => d,`Debug SHOULD NOT throw error.`);
    t.notThrow(() => c,`_CleanupSheet SHOULD NOT throw error.`);
  });

  await test.finish();
  if (test.totalFailed() > 0) throw "Some test(s) failed!";
}



/**
 * Test Fun Stuff with GasT
 */
const _gasTRandomFunTesting = async () => {
  if ((typeof GasTap) === 'undefined') { 
    eval(UrlFetchApp.fetch(gasT_URL).getContentText());
  }
  console.warn(`Testing: ${new Error().stack.split('\n')[1].split(`at `)[1]}`);  // Print Enclosing Function Name
  const test = new GasTap();

  await test(`UselessFact`, (t) => {
    const x = RandomFacts.UselessFact();
    t.notEqual(x, undefined || null, `UselessFact SHOULD NOT return undefined or null: ${x}`);
  });

  await test(`ShowMeTheMoney`, (t) => {
    const x = RandomFacts.ShowMeTheMoney(50);
    t.notEqual(x, undefined || null, `ShowMeTheMoney SHOULD NOT return undefined or null: ${x}`);
  });

  await test(`_CheckFactRecursively`, (t) => {
    t.skip();
    const x = RandomFacts._CheckFactRecursively("166,875,000,000 pieces of mail are delivered each year in the US");
    t.notEqual(x, undefined || null, `_CheckFactRecursively SHOULD NOT return undefined or null: ${x}`);
  });

  await test(`FuckOffAsAService`, (t) => {
    const x = new FuckOffAsAService({name : `Jah`}).GetRandom()
    t.notEqual(x, undefined || null, `FuckOffAsAService SHOULD NOT return undefined or null: ${x}`);
  });

  await test.finish();
  if (test.totalFailed() > 0) throw "Some test(s) failed!";
}



/**
 * Test Fun Stuff with GasT
 */
const _gasTEmailerTesting = async () => {
  if ((typeof GasTap) === 'undefined') { 
    eval(UrlFetchApp.fetch(gasT_URL).getContentText());
  }
  console.warn(`Testing: ${new Error().stack.split('\n')[1].split(`at `)[1]}`);  // Print Enclosing Function Name
  const test = new GasTap();

  await test(`CountTotalEmailsSent`, (t) => {
    const x = CountTotalEmailsSent();
    t.notEqual(x, undefined || null, `CountTotalEmailsSent SHOULD NOT return undefined or null: ${x}`);
    t.equal(typeof x, typeof Promise.prototype, `CountTotalEmailsSent SHOULD return type of Promise: ${typeof x}`);
  });

  await test(`ListInboxSnippets`, (t) => {
    const x = ListInboxSnippets();
    t.notThrow(() => x, `ListInboxSnippets SHOULD NOT throw error: ${x}`);
  });

  await test(`CleanOutJPSNotifications`, (t) => {
    const x = CleanOutJPSNotifications();
    t.notThrow(() => x, `CleanOutJPSNotifications SHOULD NOT throw error: ${x}`);
  });

  await test.finish();
  if (test.totalFailed() > 0) throw "Some test(s) failed!";
}


/**
 * Test Fun Stuff with GasT
 */
const _gasTFixerTesting = async () => {
  if ((typeof GasTap) === 'undefined') { 
    eval(UrlFetchApp.fetch(gasT_URL).getContentText());
  }
  console.warn(`Testing: ${new Error().stack.split('\n')[1].split(`at `)[1]}`);  // Print Enclosing Function Name
  const test = new GasTap();

  await test(`TitleCase`, (t) => {
    const x = TitleCase(`fucking titlecase`);
    t.notEqual(x, undefined || null, `TitleCase SHOULD NOT return undefined or null: ${x}`);
    t.equal(x, `Fucking Titlecase`, `TitleCase SHOULD return "Fucking Titlecase": ${x}`);

    const y = TitleCase(1234);
    t.equal(y, `1234`, `TitleCase SHOULD convert any other input to string: ${y}`);

    const z = TitleCase(false);
    t.equal(z, `False`, `TitleCase SHOULD convert any other input to string: ${z}`);
  });

  await test(`FileNameCleanup`, (t) => {
    const x = FileNameCleanup(`filename.gcode`);
    t.notEqual(x, undefined || null, `FileNameCleanup SHOULD NOT return undefined or null: ${x}`);
    t.equal(x, `Filename`, `FileNameCleanup SHOULD return "Filename": ${x}`);

    const y = FileNameCleanup(`file1234name.modified`);
    t.equal(y, `Filename`, `FileNameCleanup SHOULD return "Filename": ${y}`);
  });

  await test(`ParseStudents`, (t) => {
    let list = `Andrew Wang Remove attendee Andrew WangJustin Wang Remove attendee Justin WangThanh Tran Remove attendee Thanh TranConstance Angelopoulos Remove attendee Constance AngelopoulosSiheng Yang Remove attendee Siheng YangMark Theis Remove attendee Mark TheisFranky Ohlinger Remove attendee Franky OhlingerCurtis Hu `;
    const x = ParseStudents(list);
    t.notThrow(() => x, `ParseStudents SHOULD NOT throw error: ${x}`);

    let list2 = `Issam Bourai Remove attendee Issam BouraiLydia Moog Remove attendee Lydia MoogJoshua Michael Duarte Remove attendee Joshua Michael DuarteDerek Shah Remove attendee Derek ShahJohn Jacobs Remove attendee John JacobsJohn Roberts Remove attendee John RobertsNoah Johnson Remove attendee Noah JohnsonFlorian Kristof Remove attendee Florian KristofParth Behani`;
    const y = ParseStudents(list2);
    t.notThrow(() => y, `ParseStudents SHOULD NOT throw error: ${y}`);
  });


  await test.finish();
  if (test.totalFailed() > 0) throw "Some test(s) failed!";
}


/**
 * Test All with GasT
 */
const _gasTTestAll = async () => {
  console.time(`TESTING TIMER`);
  Promise.all([
    await _gasTMetricsTesting(),
    await _gasTMiscTesting(),
    await _gasTLoggerTesting(),
    await _gasTRandomFunTesting(),
    await _gasTEmailerTesting(),
    await _gasTFixerTesting(),
  ])
  .then(console.info('Test Success'))
  .catch(Error => {
    console.error(Error + ' Failure');
  });
  console.timeEnd(`TESTING TIMER`);
}