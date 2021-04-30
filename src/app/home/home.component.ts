import { Component } from "@angular/core";
@Component({
  selector: "bs-home",
  template: `
    <div class="ui container">
      <h1>Home</h1>
      <p>Das ist der KWM Bookstore.</p>
      <a routerLink="../books" class="ui red button">
        Buchliste ansehen
      </a>
    </div>
  `,
  styles: []
})
export class HomeComponent {}
