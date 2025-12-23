"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantApplicationServiceException = void 0;
var common_domain_1 = require("@food-ordering-system/common-domain");
/**
 * Restaurant Application Service Exception
 * Thrown when application-level errors occur in restaurant service
 */
var RestaurantApplicationServiceException = /** @class */ (function (_super) {
    __extends(RestaurantApplicationServiceException, _super);
    function RestaurantApplicationServiceException(message, cause) {
        var _this = _super.call(this, message, cause) || this;
        _this.name = 'RestaurantApplicationServiceException';
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(_this, RestaurantApplicationServiceException);
        }
        return _this;
    }
    return RestaurantApplicationServiceException;
}(common_domain_1.DomainException));
exports.RestaurantApplicationServiceException = RestaurantApplicationServiceException;
