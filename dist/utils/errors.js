"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorToObject = void 0;
const errorToObject = (error) => {
    const keys = Object.getOwnPropertyNames(error);
    return Object.fromEntries((keys.map((errorKey) => [
        errorKey,
        error[errorKey]
    ])));
};
exports.errorToObject = errorToObject;
