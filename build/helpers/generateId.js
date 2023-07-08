"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
class GenerateId {
    generateTokenMethod() {
        const random = Math.random().toString(32).substring(2);
        const fecha = Date.now().toString(32);
        return random + fecha;
    }
}
exports.generateToken = new GenerateId();
