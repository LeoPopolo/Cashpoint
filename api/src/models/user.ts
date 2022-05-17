import bcrypt from 'bcryptjs';

export class User {
    id?: number;
    username: string;
    name: string;
    surname: string;
    email: string;
    role: string;
    password: string;

    constructor(username: string, name: string, surname: string, email: string, role: string, password: string, id?: number) { 
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

    async encryptPassword(password) {
        const salt = await bcrypt.genSalt(10);

        let response: string = null;

        await bcrypt.hash(password, salt)
        .then(resp => {
            response = resp;            
        });

        if (response) {
            return response;
        }
    }

    async validatePassword(password: string) {
        return await bcrypt.compare(password, this.password);
    }

    toString(){
        return `'${this.username}','${this.name}','${this.surname}','${this.email}','${this.role}','${this.password}'`;
    }

    responseDto() {
        const user: any = {
            id: this.id,
            name: this.name,
            surname: this.surname,
            username: this.username,
            email: this.email
        }

        return user;
    }
}