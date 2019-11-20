var sel      = require('selenium-webdriver');
var perfectoReporting = require('perfecto-reporting');
var capabilities = {
    'platformName' : 'iOS',
    'deviceName' : '<your_device_id>',
    'bundleId' : 'com.apple.calculator', //your app bundle id
    'browserName' : 'mobileOS',
    'securityToken' : '<your_security_token>'
}

var REMOTE_URL = 'https://<your_cloud_name>.perfectomobile.com/nexperience/perfectomobile/wd/hub/fast';
var reportingClient;

//customized PerfectoReporter. 
exports.perfectoReporter =
{
    jasmineStarted: function(suiteInfo) {
        // put insome info on jasmine started
        console.log('There are '+suiteInfo.totalSpecsDefined+' testcases are defined.');
      },
     
    suiteStarted: (result) => {
        // here you can add some custom code to execute when each suite is started
    },
    specStarted: async (result) => {
        // each spec will be a test in Perfecto Reporting
        await reportingClient.testStart(result.fullName);
    },
    specDone: async (result) => {
        // ending the test
        // here we report about test end event

        if (result.status === 'failed') {
        // on a failure we report the failure message and stack trace

        console.log('Test status is: ' + result.status);
        const failure = result.failedExpectations[result.failedExpectations.length - 1];

        await reportingClient.testStop({
            status: perfectoReporting.Constants.results.failed,
            message: `${failure.message} ${failure.stack}`
            });

        } else {
            // on success we report that the test has passed
            console.log('Test status is: ' + result.status);
            await reportingClient.testStop({
            status: perfectoReporting.Constants.results.passed
            });
        }
    },
    suiteDone: (result) => {
        // when the suite is done we print in the console its description and status
        console.log('Suite done: ' + result.description + ' was ' + result.status);
    }

};

exports.launch = async () => {
    try{
        if (typeof drv == 'undefined') {
            //launch the remoteWebDriver
           drv =  await  new sel.Builder().withCapabilities(capabilities).usingServer(REMOTE_URL).build();
        }
    
        await drv.manage().setTimeouts({implicit:20000});
        var perfectoExecutionContext =  await new perfectoReporting.Perfecto.PerfectoExecutionContext({
            webdriver: drv,
            //set the CI job name and CI job number, can be prameterized
            job: {jobName: "JasminePerfectoCI",buildNumber:2},
            //Set the tags
            tags: ['jasmine selenium tests']
          });
        reportingClient = await new perfectoReporting.Perfecto.PerfectoReportingClient(perfectoExecutionContext);
    }catch(e)
    {
        console.log(e);
    }

     return drv;
  }
