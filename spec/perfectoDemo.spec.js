var sel      = require('selenium-webdriver');
let helper = require('./helpers/helper.js');
jasmine.DEFAULT_TIMEOUT_INTERVAL = 500000;
jasmine.getEnv().addReporter(helper.perfectoReporter);

describe('Test apple caculator', ()=> {
  
  var drv;
  
  beforeAll(async ()=>{
         try{
           drv = await helper.launch();
           
          }catch(e)
          {
            console.error(e.message);
            throw e;
          }    
  });
  var singleRun = ()=>{
      it(' test and verify 1 + 2 = 3', async () => {
          
            await drv.findElement(sel.By.xpath('//*[@label="1"]')).click();
            await drv.findElement(sel.By.xpath('//*[@label="add"]')).click();
            await drv.findElement(sel.By.xpath('//*[@label="2"]')).click();
            await drv.findElement(sel.By.xpath('//*[@label="equals"]')).click();
            expect(await drv.findElement(sel.By.xpath('//*[@label="Result"]')).getText()).toEqual('3');
        
      });

      it(' test and verify 3 - 2 = 1', async () => {
        
          await drv.findElement(sel.By.xpath('//*[@label="3"]')).click();
          await drv.findElement(sel.By.xpath('//*[@label="subtract"]')).click();
          await drv.findElement(sel.By.xpath('//*[@label="2"]')).click();
          await drv.findElement(sel.By.xpath('//*[@label="equals"]')).click();
          expect(await drv.findElement(sel.By.xpath('//*[@label="Result"]')).getText()).toEqual('1');
         
      });
  }
  //repetitive executions
  for (let index = 0; index < 10; index++) {
    try{
      singleRun();
    }catch(e)
    {
      console.log(e);
    }
  }
  //teardown on finish all
  afterAll(async ()=>{
    if (typeof drv != 'undefined') 
      await drv.quit();

  });
});
