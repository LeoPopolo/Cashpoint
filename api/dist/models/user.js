"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class User {
    constructor(username, name, surname, email, role, password, id) {
        this.username = username;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.role = role;
        this.password = password;
        if (id) {
            this.id = id;
        }
    }
    encryptPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = yield bcryptjs_1.default.genSalt(10);
            let response = null;
            yield bcryptjs_1.default.hash(password, salt)
                .then(resp => {
                response = resp;
            });
            if (response) {
                return response;
            }
        });
    }
    validatePassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcryptjs_1.default.compare(password, this.password);
        });
    }
    toString() {
        return `'${this.username}','${this.name}','${this.surname}','${this.email}','${this.role}','${this.password}'`;
    }
    responseDto() {
        const user = {
            id: this.id,
            name: this.name,
            surname: this.surname,
            username: this.username,
            email: this.email,
            role: this.role
        };
        return user;
    }
}
exports.User = User;
//# sourceMappingURL=user.js.map