import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  role: string = '';

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    const userData = JSON.parse(localStorage.getItem('userData')!);

    this.role = userData.role;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
  }

}
