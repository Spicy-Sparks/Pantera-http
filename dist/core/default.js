"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultInstance = void 0;
const pantera_1 = require("./pantera");
exports.defaultInstance = new pantera_1.Pantera({
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
});
