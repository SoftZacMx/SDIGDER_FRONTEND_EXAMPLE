import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { UserDataService } from 'src/app/shared/services/user-data/user-data.service';
import { AuthService } from 'src/app/auth/services/auth/auth.service';
import { MAT_MENU_SCROLL_STRATEGY, MAT_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER } from '@angular/material/menu';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  providers: [MAT_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER]
})
export class SidenavComponent implements OnInit {


  user: any = undefined

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private userDataService: UserDataService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.user = this.userDataService.getUserData()

  }

  logout() {
    this.authService.logout()
  }



}
