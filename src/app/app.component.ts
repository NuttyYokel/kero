import { Component } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private router: Router) { }

  isErroPage() {
    return this.router.url == "/error";
  }

  needPadding() {
    return this.router.url != "/error" && this.router.url != "/home";
  }
}
