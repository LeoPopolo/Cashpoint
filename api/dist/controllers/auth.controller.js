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
exports.setPassword = exports.setRole = exports.setEmail = exports.setSurname = exports.setName = exports.identifyById = exports.users = exports.signin = exports.signup = void 0;
const user_1 = require("../models/user");
const database_1 = __importDefault(require("../database"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function signup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = new user_1.User(req.body.username, req.body.name, req.body.surname, req.body.email, req.body.role, req.body.password);
        const tmp_pass = yield user.encryptPassword(req.body.password);
        if (tmp_pass) {
            user.password = tmp_pass;
        }
        yield database_1.default.query(`INSERT INTO system_user (username,name,surname,email,role,password) VALUES (${user.toString()}) RETURNING id`)
            .catch(err => {
            console.log(err);
            return res.status(400).send(err);
        })
            .then((response) => __awaiter(this, void 0, void 0, function* () {
            const token = jsonwebtoken_1.default.sign({
                _id: user.username
            }, process.env.TOKEN_SECRET);
            user.id = response.rows[0].id;
            res.status(200).json({
                status: 'OK',
                token: token,
                data: user
            });
        }));
    });
}
exports.signup = signup;
;
function signin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.default.query(`SELECT * FROM system_user WHERE username = '${req.body.username}'`)
            .catch(err => {
            console.log(err);
            return res.status(400).send(err);
        })
            .then((resp) => __awaiter(this, void 0, void 0, function* () {
            if (resp.rows.length === 0 || resp.rows === null || resp.rows === undefined) {
                return res.status(400).json({
                    error: 'username or password incorrect'
                });
            }
            else {
                const user = new user_1.User(resp.rows[0].username, resp.rows[0].name, resp.rows[0].surname, resp.rows[0].email, resp.rows[0].role, resp.rows[0].password, resp.rows[0].id);
                const correctPassword = yield user.validatePassword(req.body.password);
                if (!correctPassword) {
                    return res.status(400).json({
                        error: 'invalid password'
                    });
                }
                const token = jsonwebtoken_1.default.sign({
                    _id: user.id
                }, process.env.TOKEN_SECRET);
                res.header('Authorization', token).json({
                    data: user.responseDto()
                });
            }
        }));
    });
}
exports.signin = signin;
function users(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let usersArray = [];
        yield database_1.default.query(`SELECT id, username, name, surname, email
                        FROM system_user
                        WHERE 1=1`)
            .catch(err => {
            return res.status(400).send(err);
        })
            .then(resp => {
            if (resp.rows.length === 0) {
                return res.status(404).json({
                    error: 'No data found'
                });
            }
            else {
                usersArray = resp.rows;
                res.status(200).json({
                    status: 'OK',
                    data: usersArray
                });
            }
        });
    });
}
exports.users = users;
function identifyById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.default.query(`SELECT id, username, name, surname, email, role
                        FROM system_user
                        WHERE id = ${req.params.id}`)
            .catch(err => {
            return res.status(400).send(err);
        })
            .then(resp => {
            if (resp.rows.length === 0) {
                return res.status(404).json({
                    error: 'No data found'
                });
            }
            else {
                let user = resp.rows[0];
                res.status(200).json({
                    status: 'OK',
                    data: user
                });
            }
        });
    });
}
exports.identifyById = identifyById;
function setName(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.default.query(`UPDATE system_user
                        SET name = '${req.body.name}'
                        WHERE id = ${req.params.id}`)
            .catch(err => {
            console.log(err);
            return res.status(400).send(err);
        })
            .then(() => {
            res.status(200).json({
                status: 'OK',
                message: 'Operation completed'
            });
        });
    });
}
exports.setName = setName;
function setSurname(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.default.query(`UPDATE system_user
                        SET surname = '${req.body.surname}'
                        WHERE id = ${req.params.id}`)
            .catch(err => {
            console.log(err);
            return res.status(400).send(err);
        })
            .then(() => {
            res.status(200).json({
                status: 'OK',
                message: 'Operation completed'
            });
        });
    });
}
exports.setSurname = setSurname;
function setEmail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.default.query(`UPDATE system_user
                        SET email = '${req.body.email}'
                        WHERE id = ${req.params.id}`)
            .catch(err => {
            console.log(err);
            return res.status(400).send(err);
        })
            .then(() => {
            res.status(200).json({
                status: 'OK',
                message: 'Operation completed'
            });
        });
    });
}
exports.setEmail = setEmail;
function setRole(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.default.query(`UPDATE system_user
                        SET role = '${req.body.role}'
                        WHERE id = ${req.params.id}`)
            .catch(err => {
            console.log(err);
            return res.status(400).send(err);
        })
            .then(() => {
            res.status(200).json({
                status: 'OK',
                message: 'Operation completed'
            });
        });
    });
}
exports.setRole = setRole;
function setPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = new user_1.User("", "", "", "", "", "");
        const tmp_password = yield user.encryptPassword(req.body.password);
        if (tmp_password) {
            user.password = tmp_password;
        }
        yield database_1.default.query(`UPDATE system_user
                        SET password = '${user.password}'
                        WHERE id = ${req.params.id}`)
            .catch(err => {
            console.log(err);
            return res.status(400).send(err);
        })
            .then(() => {
            res.status(200).json({
                status: 'OK',
                message: 'Operation completed'
            });
        });
    });
}
exports.setPassword = setPassword;
//# sourceMappingURL=auth.controller.js.map