//This line defines a new class called ApiError that extends the built-in Error class. 
//Extending the Error class allows ApiError to inherit the properties and methods of the Error class, making it a custom error type.

class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = "" //error stack
  ) 
  {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) 
    {
      this.stack = stack;
    } 
    else 
    {
      Error.captureStackTrace(this, this.constructor);
    //It is a method provided by the V8 JavaScript engine (which powers Node.js). 
    //It captures a stack trace at the point it is called and assigns it to the stack property of the specified object.
    //2 arguments => Error.captureStackTrace(targetObject[, constructorOpt])
    }
  }
}

export { ApiError };
