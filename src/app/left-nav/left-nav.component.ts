import { Component, OnInit, OnDestroy, NgZone } from "@angular/core";
import { DataStorageService } from "../shared/data-storage.service";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";
import { ModeService } from "../shared/mode.service";

const BREAKPOINT = 768;

@Component({
  selector: "app-left-nav",
  templateUrl: "./left-nav.component.html",
  styleUrls: ["./left-nav.component.scss"]
})
export class LeftNavComponent implements OnInit, OnDestroy {
  private userSub: Subscription;
  private modeSub: Subscription;
  isAuthenticated = false;
  mode: boolean;
  private mediaMatcher: MediaQueryList = matchMedia(`(max-width: ${BREAKPOINT}px)`)
  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService,
    private modeService: ModeService
  ) {
    
  }

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

    this.modeSub = this.modeService.currentMode.subscribe(mode => this.mode = mode);
    console.log(this.mode)
  }

  onChangeMode() {
    this.mode = !this.mode;
    this.modeService.changeMessage(this.mode);
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.modeSub.unsubscribe();
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
