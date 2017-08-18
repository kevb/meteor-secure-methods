# meteor-secure-methods
Secure meteor methods - a middleware approach

## Rationale

Meteor Methods are recommended over using direct mini-mongo manipulation with allow/deny. It's easy enough to implement authentication rules in your Methods, but over time as the complexity of your app grows it becomes difficult to make sure each method has the right security model applied to it.

The idea of SecureMethod is to provide a way to mix security code into methods (a little like a middleware) and consolidate the security policies and rules apart from the methods themselves.

SecureMethod forces you to define methods as either secure or insecure, and secure methods require some security code to be attached to them before they can be called (like a default deny-all rule).

## Install

```
meteor install kevb:secure-methods
```

## Run tests

Run from the package directory
```
meteor test-packages ./
```

And then navigate to https://localhost:3000 in the browser and ensure tests are passing

## Examples

### Create a method

By default all methods created require some security handler to be attached. Instead of using Meteor.methods use the following syntax:

```
SecureMethods.register('create-reservation', ({reservation}) => {
 ...
})
```

### Create an insecure method

Occasionally you need to create an insecure method with no handler. This should be done with caution with the following syntax:

```
SecureMethods.registerInsecure('login', ({username, password}) => {
 ...
})
```

### Create security handlers for various methods

```
SecureMethods.registerHandler({name:'can-create-reservation', method: function(){
  // should return true if user is allowed to use method & false otherwise
}})
```

### Attach security handlers to methods

Secure methods need a security handler attached in order to function.

```
SecureMethods.attachSecureHandlers({
  create-reservation: ["can-create-reservation"]
})
```

### Calling methods

Secure methods are called in the exact same way as Meteor.methods. Just note that the single object (destructured) pattern is strongly recommended.

```
Meteor.call(create-reservation, {reservation}, (err, res) => {
  if (err) {
    // error!
  } else {
    // success!
  }
})
```
