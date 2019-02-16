"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Throw error if the value is false
 * @param value value
 * @param message message
 */
exports.assert = (value, message) => {
    if (value === false)
        throw new TypeError(message);
};
