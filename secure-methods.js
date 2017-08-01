/**
 * SecureMethods
 * For more secure Meteor.methods
 */
const _handlers = {
  default: function() {
    return false;
  }
}

const _attachments = {};

export const SecureMethods = {
  
  /**
   * Register a new secure method
   */
  register: ({name, method}) => {
    //Default security handler for secure method is to reject all
    if (!SecureMethods.methodHasHandler(name)) {
      _attachments[name] = 'default';
    }
    registerMethod({name, method});
  },

  /**
   * Register a new INSECURE method - no security by default
   */
  registerInsecure: ({name, method}) => {
    registerMethod({name, method});
  },

  /**
   * Register a new security handler, to check e.g. permission, role etc
   */
  registerHandler: ({name, method}) => {
    if (_handlers[name]) throw new Error("Handler '"+name+"' is already defined");
    _handlers[name] = method;
  },

  /**
   * Attach secure handlers to methods, to make them secure
   */
  attachSecureHandlers: (handlers) => {
    _.each(handlers, function (handler, method) {        
      _attachments[method] = handler;
    });
  },

  methodHasHandler: (name) => {
    return !!_attachments[name];
  },

  getMethodHandler: (name) => {
    return _handlers[_attachments[name]];
  }

}

function registerMethod({name, method}) {
  let meteorMethods = {};
  meteorMethods[name] = function() {
    if (SecureMethods.methodHasHandler(name) && !SecureMethods.getMethodHandler(name).apply(this, arguments)) {
      throw new Meteor.Error('not-authorized', "You are not authorized to perform that action");
    }
    return method.apply(this, arguments);
  }
  Meteor._originalMethods(meteorMethods);
}

//Capture original Meteor.methods function
Meteor._originalMethods = Meteor.methods;

//Wrap Meteor.methods functon with insecure warning
Meteor.methods = function() {
  console.log("WARNING - PLEASE USE SecureMethods instead");
  Meteor._originalMethods.apply(this, arguments);
}