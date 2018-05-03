import {autoinject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {User} from './../json/user';

@autoinject
export class index {
 users = new Array<User>();
 newUser= new User("", "", "","");
 index = 1;
 now = new Date().toLocaleDateString();

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
      this.getData();
    }
    async getData() {
        console.log("GET called");
        this.httpClient.fetch('users/', {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            this.users = new Array<User>();
            for(let entry of data) {
                var user = new User(entry.id,entry.createdOn, entry.email, entry.name, );
                this.users.push(user);
                this.index = user.id + 1;
            }
        })
    }
    async submitData() {
        this.newUser.createdOn = this.now;
        console.log("PUT or POST called")
        if(this.newUser.id < 1 || this.newUser.name.length < 1 || this.newUser.email.length < 1 || this.newUser.createdOn.length < 1) {
            alert("ERROR! please check and try again.");
        } else {
            console.log("a new User was posted");
            let exists = false;

            for(let user of this.users) {
                if(user.id == this.newUser.id) {
                    exists = true;
                }
            }

            if(exists) {
                console.log("PUT called");
                this.httpClient.fetch('users/' + this.newUser.id, {
                    method: 'PUT',
                    body: JSON.stringify(this.newUser)
                })
                .then(data => {
                    console.log(data);
                    if(data.status == 200) {
                        this.getData();
                    }
                });
            } else {
                console.log("POST Called");
                this.httpClient.fetch('users/', {
                    method: 'POST',
                    body: JSON.stringify(this.newUser)
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
        console.log("DELETE called on User: " + num);

        this.httpClient.fetch('users/' + num, {
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
