import {autoinject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {Category} from './../json/category';

@autoinject
export class index {
 categories = new Array<Category>();
 newCat = new Category("", "");
 index = 1;

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
        this.httpClient.fetch('categories/', {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            this.categories = new Array<Category>();
            for(let entry of data) {
                var cat = new Category(entry.id, entry.name);
                this.categories.push(cat);
                this.index = cat.id + 1;
            }
        })
    }
    async submitCat() {
        console.log("PUT or POST called")
        if(this.newCat.id < 1 || this.newCat.name.length < 1) {
            alert("ERROR! please check and try again.");
        } else {
            console.log("a new category was posted");
            let exists = false;

            for(let cat of this.categories) {
                if(cat.id == this.newCat.id) {
                    exists = true;
                }
            }

            if(exists) {
                console.log("PUT called");
                this.httpClient.fetch('categories/' + this.newCat.id, {
                    method: 'PUT',
                    body: JSON.stringify(this.newCat)
                })
                .then(data => {
                    console.log(data);
                    if(data.status == 200) {
                        this.getData();
                    }
                });
            } else {
                console.log("POST Called");
                this.httpClient.fetch('categories/', {
                    method: 'POST',
                    body: JSON.stringify(this.newCat)
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
        console.log("DELETE called on Category: " + num);

        this.httpClient.fetch('categories/' + num, {
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