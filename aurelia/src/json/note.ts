export class Note {
    id: number;
    CategoryId: string;
    title: string;
    note: string;
    createdOn: string;
    isDeleted: string;
    userID: number;

    constructor(id, categoryId, createdOn, isDeleted, note, title, userID) {
        this.id = id;
        this.title = title;
        this.note = note;
        this.createdOn = createdOn;
        this.CategoryId = categoryId;
        this.isDeleted = isDeleted;
        this.userID = userID;
    }
}