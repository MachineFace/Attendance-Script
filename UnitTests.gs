/**
 * Test Updating with GasT
 */
const _gasTUpdateTesting = async () => {
  if ((typeof GasTap) === 'undefined') { 
    eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/huan/gast/master/src/gas-tap-lib.js').getContentText())
  } 
  const test = new GasTap();
  
  await test(`WriteAllNewDataToSheets`, t => {
    const x = WriteAllNewDataToSheets();
    t.notThrow(() => x,`WriteAllNewDataToSheets SHOULD NOT throw error.`);
  });

  await test(`UpdateAll`, t => {
    const x = UpdateAll();
    t.notThrow(() => x,`UpdateAll SHOULD NOT throw error.`);
  });

  await test(`MissingTicketUpdater`, t => {
    const x = MissingTicketUpdater();
    t.notThrow(() => x,`MissingTicketUpdater SHOULD NOT throw error.`);
  });

  await test(`FetchNewDataforSingleSheet`, t => {
    const x = FetchNewDataforSingleSheet(SHEETS.Zardoz);
    t.notThrow(() => x,`FetchNewDataforSingleSheet SHOULD NOT throw error.`);
  });

  await test(`TriggerRemoveDuplicates`, t => {
    const x = TriggerRemoveDuplicates();
    t.notThrow(() => x,`TriggerRemoveDuplicates SHOULD NOT throw error.`);
  });   

  await test(`Filename Cleanup`, t => {
    const s = {
      good : `somename1.gcode`,
      mod : `somename.modified.gcode`,
      bad : `@#$%.exe&*()`,
      worse : `\n\n\n\n\n\n`,
    }
    const x = FileNameCleanup(s.good);
    t.equal(x, `Somename`, `Pre: ${s.good}, Post: Assert ${x} = Somename`);
    const y = FileNameCleanup(s.bad);
    t.equal(y, `@#$%.exe&*()`, `Pre: ${s.bad}, Post: Assert ${y} = @#$%.exe&*()`);
    const z = FileNameCleanup(s.worse);
    t.equal(z, `\n\n\n\n\n\n`, `Pre: ${s.bad}, Post: Assert ${z} = 6 returns`);
    const a = FileNameCleanup(s.mod);
    t.equal(a, `Somename`, `Pre: ${s.mod}, Post: Assert ${a} = Somename`);
  });

  await test.finish();
  if (test.totalFailed() > 0) throw "Some test(s) failed!";
}


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
 * Test All with GasT
 */
const _gasTTestAll = async () => {
  console.time(`TESTING TIMER`);
  Promise.all([
    await _gasTMessagingAndStaffTesting(),
    await _gasTTicketTesting(),
    await _gasTMiscTesting(),
    await _gasTCalculationTesting(),
    await _gasTLoggerTesting(),
    await _gasTEmailTesting(),
    await _gasTUpdateTesting(),
  ])
  .then(console.info('Test Success'))
  .catch(Error => {
    console.error(Error + ' Failure');
  });
  console.timeEnd(`TESTING TIMER`);
}