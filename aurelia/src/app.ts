import {Router, RouterConfiguration} from 'aurelia-router';

export class App {
  router: Router;
  
  constructor() {}

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'webAPI';
    config.map([
      { route: ['', 'home'],  name: 'home', moduleId: 'index', title: 'Home'},
      { route: '/users',  name: 'users', moduleId: './users/index', title: 'Users'},
      { route: '/categories',  name: 'categories', moduleId: './categories/index', title: 'Categories'},
      { route: '/notes',  name: 'notes', moduleId: './notes/index', title: 'Notes'}
    ]);
    
    config.fallbackRoute('home');

    this.router = router;
  }
}
