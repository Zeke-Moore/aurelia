export class User {
    id: number;
    createdOn: string;
    email: string;
    name: string;
    

    constructor(id, createdOn, email, name) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.createdOn = createdOn;
    }
}