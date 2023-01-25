

/**
 * Test Metrics with GasT
 */
const _gasTMetricsTesting = async () => {
  if ((typeof GasTap) === 'undefined') { 
    eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/huan/gast/master/src/gas-tap-lib.js').getContentText())
  } 
  const test = new GasTap();
  const calc = new CalculateMetrics();

  await test(`CountEachCategoryTrained`, t => {
    const x = calc.CountEachCategoryTrained();
    t.notThrow(() => x,`CountEachCategoryTrained SHOULD NOT throw error. ${JSON.stringify(x)}`);
    // t.equal(isNaN(y), true, `SumStatuses SHOULD return NaN for forbidden sheet: ${y}`);
  });

  await test(`CountPresent`, t => {
    const x = calc.CountPresent();
    t.notThrow(() => x,`CountPresent SHOULD NOT throw error. ${x}`);
    t.equal(!isNaN(x), true, `CountPresent SHOULD return a number ${x}`);
  });

  await test(`CountAbsent`, t => {
    const x = calc.CountAbsent();
    t.notThrow(() => x,`CountAbsent SHOULD NOT throw error: ${x}`);
    t.equal(!isNaN(x), true, `CountAbsent SHOULD return a number: ${x}`);
  });

  await test(`CountAllTrainedUsers`, t => {
    const x = calc.CountAllTrainedUsers();
    t.notThrow(() => x,`CountAllTrainedUsers SHOULD NOT throw error: ${x}`);
    t.equal(!isNaN(x), true, `CountAllTrainedUsers SHOULD return a number: ${x}`);
  });

  await test(`Calc Distribution`, (t) => {
    const x = calc.CalculateDistribution();
    t.notEqual(x, undefined || null, `Distribution should not return undefined: ${x.slice(0, 3)}`);
  });

  await test(`SumCategories`, (t) => {
    const x = calc.SumCategories();
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
    eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/huan/gast/master/src/gas-tap-lib.js').getContentText())
  } 
  const test = new GasTap();

  // ------------------------------------------------------------------------------------------------------------------------------
  await test(`GetByHeader`, (t) => {
    const x = GetByHeader(SHEETS.Main, HEADERNAMES.fuckOff, 5);
    t.notEqual(x, undefined || null, `GetByHeader SHOULD NOT return undefined or null: ${x}`);

    const y = GetByHeader(SHEETS.Main, `BAD COLUMN NAME`, 2);
    t.equal(y, undefined || null, `GetByHeader SHOULD return undefined or null for Bad column name: ${y}`);

    const z = GetByHeader(`BAD SHEET`, HEADERNAMES.name, 2);
    t.equal(y, undefined || null, `GetByHeader SHOULD return undefined or null for bad sheet: ${y}`);

    const a = GetByHeader(`BAD SHEET`, `BAD COLUMN NAME`, `BAD ROW NUMBER`);
    t.equal(a, undefined || null, `GetByHeader SHOULD return undefined or null for bad inputs.: ${a}`);
  });

  await test(`GetColumnDataByHeader`, (t) => {
    const x = GetColumnDataByHeader(SHEETS.Main, HEADERNAMES.name);
    t.notEqual(x, undefined || null, `GetColumnDataByHeader SHOULD NOT return undefined or null: ${x.slice(0, 10)}`);

    const y = GetColumnDataByHeader(SHEETS.Main, `BAD COLUMN NAME`);
    t.equal(y, undefined || null, `GetColumnDataByHeader SHOULD return undefined or null: ${y}`);

    const z = GetColumnDataByHeader(OTHERSHEETS.Chart, HEADERNAMES.name);
    t.equal(z, undefined || null, `GetColumnDataByHeader SHOULD return undefined or null: ${z}`);

    const a = GetColumnDataByHeader(OTHERSHEETS.Chart, `Brrp`);
    t.equal(a, undefined || null, `GetColumnDataByHeader SHOULD return undefined or null: ${a}`);
  });

  await test(`GetRowData`, (t) => {
    const x = GetRowData(3);
    t.notEqual(x, undefined || null, `GetRowData SHOULD NOT return undefined or null: ${JSON.stringify(x)}`);

    const y = GetRowData(`BAD ROW NUMBER`);
    t.equal(y, undefined || null, `GetRowData SHOULD return undefined or null: ${y}`);
  });

  await test.finish();
  if (test.totalFailed() > 0) throw "Some test(s) failed!";
}



/**
 * Test Logger with GasT
 */
const _gasTLoggerTesting = async () => {
  if ((typeof GasTap) === 'undefined') { 
    eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/huan/gast/master/src/gas-tap-lib.js').getContentText())
  } 
  const test = new GasTap();

  await test(`WriteLogger`, (t) => {
    console.time(`EXECUTION TIMER`);
    const write = new WriteLogger();

    const w = write.Warning(`Ooopsies ----> Warning`);
    const i = write.Info(`Some Info`);
    const e = write.Error(`ERROR`);
    const d = write.Debug(`Debugging`);
    const c = write._CleanupSheet();
    

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
    eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/huan/gast/master/src/gas-tap-lib.js').getContentText())
  } 
  const test = new GasTap();

  await test(`UselessFact`, (t) => {
    const x = new RandomFacts().UselessFact();
    t.notEqual(x, undefined || null, `UselessFact SHOULD NOT return undefined or null: ${x}`);
  });

  await test(`ShowMeTheMoney`, (t) => {
    const x = new RandomFacts().ShowMeTheMoney(50);
    t.notEqual(x, undefined || null, `ShowMeTheMoney SHOULD NOT return undefined or null: ${x}`);
  });

  await test(`_CheckFactRecursively`, (t) => {
    t.skip();
    const x = new RandomFacts()._CheckFactRecursively("166,875,000,000 pieces of mail are delivered each year in the US");
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
    eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/huan/gast/master/src/gas-tap-lib.js').getContentText())
  } 
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
    eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/huan/gast/master/src/gas-tap-lib.js').getContentText())
  } 
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