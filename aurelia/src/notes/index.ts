import {autoinject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {Note} from './../json/note';
import {User} from './../json/user';
import {Category} from './../json/category'

@autoinject
export class index {
 notes = new Array<Note>();
 cats = new Array<Category>();
 users = new Array<User>();
 newNote= new Note("","","","", "", "","");
 index = 1;
 now = new Date().toLocaleDateString();
selectedCat: string = null;
selectedUsr: number = null;
  constructor(private httpClient: HttpClient) {
      httpClient.configure(config => {
          config
            .withBaseUrl('http://dmoore-csc435.azurewebsites.net/api/')
            .withDefaults({
                headers: {
                    'Content-Type': 'application/json',
                }
            });
      });
      this.callGets();
    }

    callGets() {
        this.getCategories();
        this.getUsers();
        this.getData();
    }
    async getData() {
        console.log("GET called");
        this.httpClient.fetch('notes/', {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            this.notes = new Array<Note>();
            for(let entry of data) {
                var note = new Note(entry.id, entry.CategoryId, entry.createdOn, entry.isDeleted, entry.note, entry.title, entry.userID);
                this.notes.push(note);
                this.index = note.id + 1;
            }
        })
    }

    async getUsers() {
        console.log("GET called");
        this.httpClient.fetch('users', {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            this.users = new Array<User>();
            for(let entry of data) {
                var user = new User(entry.id, entry.createdOn, entry.email, entry.name);
                this.users.push(user);
            }
        })
    }

    async getCategories() {
        console.log("GET called");
        this.httpClient.fetch('categories', {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            this.notes = new Array<Note>();
            for(let entry of data) {
                var cat = new Category(entry.id, entry.name);
                this.cats.push(cat);
            }
        })
    }
    async submitData() {
        this.newNote.createdOn = this.now;
        this.newNote.CategoryId = this.selectedCat;
        this.newNote.userID = this.selectedUsr;
        console.log("PUT or POST called")
        if(this.newNote.id < 1 || this.newNote.title.length < 1 || this.newNote.note.length < 1 || 
            this.newNote.createdOn.length < 1 || this.newNote.userID < 1 || this.newNote.CategoryId.length < 1) {
            alert("ERROR! please check and try again.");
        } else {
            console.log("a new Note was posted");
            let exists = false;

            for(let note of this.notes) {
                if(note.id == this.newNote.id) {
                    exists = true;
                }
            }

            if(exists) {
                console.log("PUT called");
                this.httpClient.fetch('notes/' + this.newNote.id, {
                    method: 'PUT',
                    body: JSON.stringify(this.newNote)
                })
                .then(data => {
                    console.log(data);
                    if(data.status == 200) {
                        this.getData();
                    }
                });
            } else {
                console.log("POST Called");
                this.httpClient.fetch('notes/', {
                    method: 'POST',
                    body: JSON.stringify(this.newNote)
                })
                .then(data => {
                    console.log(data);
                    if(data.status == 200){
                        this.getData();
                    }
                });
            }
        }
    }
    async deleteData(num) {
        console.log("DELETE called on Note: " + num);

        this.httpClient.fetch('notes/' + num, {
            method: 'DELETE'
        })
        .then(data => {
            console.log(data);
            if(data.status == 200) {
                this.getData();
            }
        });
    }
}
