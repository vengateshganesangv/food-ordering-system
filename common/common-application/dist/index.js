"use strict";
/**
 * Common Application Module
 * Provides error handling and exception management for Express applications
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGlobalExceptionHandler = exports.ConsoleLogger = exports.ConstraintViolationError = exports.ValidationError = exports.GlobalExceptionHandler = exports.createErrorDTO = void 0;
var ErrorDTO_1 = require("./ErrorDTO");
Object.defineProperty(exports, "createErrorDTO", { enumerable: true, get: function () { return ErrorDTO_1.createErrorDTO; } });
var GlobalExceptionHandler_1 = require("./GlobalExceptionHandler");
Object.defineProperty(exports, "GlobalExceptionHandler", { enumerable: true, get: function () { return GlobalExceptionHandler_1.GlobalExceptionHandler; } });
Object.defineProperty(exports, "ValidationError", { enumerable: true, get: function () { return GlobalExceptionHandler_1.ValidationError; } });
Object.defineProperty(exports, "ConstraintViolationError", { enumerable: true, get: function () { return GlobalExceptionHandler_1.ConstraintViolationError; } });
Object.defineProperty(exports, "ConsoleLogger", { enumerable: true, get: function () { return GlobalExceptionHandler_1.ConsoleLogger; } });
Object.defineProperty(exports, "createGlobalExceptionHandler", { enumerable: true, get: function () { return GlobalExceptionHandler_1.createGlobalExceptionHandler; } });
//# sourceMappingURL=index.js.map