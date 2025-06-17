import { Component, Input } from '@angular/core';
import { TokenStorageService } from '../../token-storage/token-storage.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sidebar-layout',
  templateUrl: './sidebar-layout.component.html',
  styleUrls: ['./sidebar-layout.component.scss']
})


export class SidebarLayoutComponent {
   @Input() menuItems: { label: string, route: string }[] = [];

   constructor(
     private tokenService: TokenStorageService,
     private router: Router
   ) {}

    logout() {
      this.tokenService.clear();
      this.router.navigate(['/login']);
    }
}
