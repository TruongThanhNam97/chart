import { Component, OnInit, OnDestroy, NgZone } from "@angular/core";
import { DataStorageService } from "../shared/data-storage.service";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";
import { ModeService } from "../shared/mode.service";
import { mergeMap } from "rxjs/operators";

const BREAKPOINT = 768;
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSub: Subscription;
  isAuthenticated = false;
  private mode: boolean;
  private mediaMatcher: MediaQueryList = matchMedia(
    `(max-width: ${BREAKPOINT}px)`
  );
  toggleMenu: boolean = true;
  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService,
    private modeService: ModeService,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      // option 1:
      // this.isAuthenticated = !user ? false : true;

      // option 2:
      // !! check if not have a user which will be true.
      // means: true when have a user and false if have no user.
      console.log(!user);
      console.log(!!user);
      this.isAuthenticated = !!user;
    });

    this.toggleMenu = (window.innerWidth > BREAKPOINT) ? true : false;

    this.mediaMatcher.addListener(mql =>
      this.zone.run(() => {
        this.toggleMenu = !mql.matches;
        console.log("toggle menu", this.toggleMenu);
      })
    );
    this.modeService.currentMode.subscribe(mode => this.mode = mode)
  }

  onChangeMode() {
    this.mode = !this.mode;
    this.modeService.changeMessage(this.mode);
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
