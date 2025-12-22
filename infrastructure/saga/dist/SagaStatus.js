"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SagaStatus = void 0;
/**
 * Enum representing the various states of a SAGA transaction.
 *
 * The SAGA pattern is used for managing distributed transactions by breaking them
 * into a series of local transactions. Each state represents a different phase
 * in the SAGA's lifecycle.
 *
 * @enum {string}
 */
var SagaStatus;
(function (SagaStatus) {
    /**
     * The SAGA has been initiated and is ready to begin processing
     */
    SagaStatus["STARTED"] = "STARTED";
    /**
     * The SAGA has encountered an error and has failed
     */
    SagaStatus["FAILED"] = "FAILED";
    /**
     * The SAGA has completed all steps successfully
     */
    SagaStatus["SUCCEEDED"] = "SUCCEEDED";
    /**
     * The SAGA is currently executing its forward transaction steps
     */
    SagaStatus["PROCESSING"] = "PROCESSING";
    /**
     * The SAGA is executing compensating transactions (rollback) due to a failure
     */
    SagaStatus["COMPENSATING"] = "COMPENSATING";
    /**
     * The SAGA has successfully completed all compensating transactions (rollback complete)
     */
    SagaStatus["COMPENSATED"] = "COMPENSATED";
})(SagaStatus || (exports.SagaStatus = SagaStatus = {}));
//# sourceMappingURL=SagaStatus.js.map