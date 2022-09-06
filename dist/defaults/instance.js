"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instance = void 0;
const pantera_1 = require("../core/pantera");
exports.instance = new pantera_1.Pantera({
    responseType: 'json',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
});
