"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createErrorDTO = createErrorDTO;
/**
 * Creates an ErrorDTO instance
 * @param code - Error code
 * @param message - Error message
 * @returns ErrorDTO object
 */
function createErrorDTO(code, message) {
    return {
        code,
        message
    };
}
//# sourceMappingURL=ErrorDTO.js.map