// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by meteor-sample-package.js.
import { SecureMethods } from "./secure-methods";

// Set up methods before testing --------

SecureMethods.registerInsecure({ name: 'insecureMethod', method: () => {
  return 'insecureMethod called';
}})

//Should NOT work because not handler is applied
SecureMethods.register({name: 'unhandledSecureMethod', method: () => {
  return 'unhandledSecureMethod called';
}})

//Should work because we will attach a secure handler
SecureMethods.register({name: 'handledSecureMethod', method: () => {
  return 'handledSecureMethod called';
}})

//Create a sample handler
SecureMethods.registerHandler({name:'can-call-method', method: function(){
  return true; //We would usually put the security checking in here...
}});

//Attach handler to method
SecureMethods.attachSecureHandlers({
  handledSecureMethod: ["can-call-method"]
})

// ---------

// Tests

Tinytest.addAsync('should be able to call insecure method', (test, next) => {
  let result = Meteor.call('insecureMethod', (error, result) => {
    test.equal(result, 'insecureMethod called');
    next();
  })
});

Tinytest.addAsync('should NOT be able to call secure method without handler', (test, next) => {
  let result = Meteor.call('unhandledSecureMethod', (error, result) => {
    test.equal(error.error, 'not-authorized');
    next();
  })
});

Tinytest.addAsync('should be able to call secure method with handler', (test, next) => {
  let result = Meteor.call('handledSecureMethod', (error, result) => {
    test.equal(result, 'handledSecureMethod called');
    next();
  })
});