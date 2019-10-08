import { Component, ComponentFactoryResolver, ViewChild, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService, AuthResponseData } from "./auth.service";
import { Observable, Subscription } from "rxjs";
import { Router } from "@angular/router";

// need to import Alert Component.
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceHolderDirective } from "../shared/helper/placeholder.directive";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  private closeSub: Subscription;

  // using ViewChild to access a PlaceHolderDirective.
  @ViewChild(PlaceHolderDirective) alerHost: PlaceHolderDirective;

  constructor(private authService: AuthService, private router: Router,
              // using componentFactoryResolver, not AlertComponent.
              private componentFactoryResolver: ComponentFactoryResolver) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(authForm: NgForm) {
    console.log(authForm);
    // extra check.
    if (!authForm.valid) {
      return;
    }

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;
    const email = authForm.value.email;
    const password = authForm.value.password;
    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
      // .subscribe((resData) => {
      //   console.log(resData);
      //   this.isLoading = false;
      // }, errorMessage => {
      //   console.log(errorMessage);        
        // switch (errorRes.error.error.message) {
        //   case 'EMAIL_EXISTS':
        //     this.error = 'EMAIL_EXISTS!';
        //     break;
        
        //   default:
        //     break;
        // }

      //   this.error = errorMessage;
      //   this.isLoading = false;
      // });
    }

    // using Observable. Because the same logic and wants to reuse the code.
    authObs.subscribe((resData) => {
      console.log(resData);
      this.isLoading = false;
      this.router.navigate(['/recipes']);
    }, errorMessage => {
      console.log(errorMessage);
      this.error = errorMessage;

      // option 2: create a alert modal component by own code.
      this.showErrorAlert(errorMessage);
      this.isLoading = false;
    });

    authForm.reset();
  }

  onHandleError() {
    this.error = null;
  }

  // option 2:
  // create a alert modal component by own code.
  private showErrorAlert(errorMessage: string) {
    // it won't work in Angular.
    // const alertComp = new AlertComponent();

    // using componentFactoryResolver.
    // passing the type of component then it should create and return just a component factory, not component itself (AlertComponent).
    const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    // also need a place where can attach it in the dom.
    // store a reference in hostViewContainerRef.
    const hostViewContainerRef = this.alerHost.viewContainerRef;
    // next thing is that clear anything that might have been rendered before.

    // view container reference not only a pair of coordinates, 
    // but also it is object that allow to interact with place in the DOM.
    // as a result, simply clear is all Angular components that have been rendered in that place before.

    // must clear everything before render something new.
    hostViewContainerRef.clear();

    // next step: can use component factory to create a new component (alert component) in that host, means create a thing in that place.
    // need a factory (alertComponentFactory).
    // however, still missing NgModule.entryComponents.
    const componentRef = hostViewContainerRef.createComponent(alertComponentFactory);

    // instance is getting an instance of component.
    // set a message or data to the component.
    componentRef.instance.message = errorMessage;

    // close a modal popup.
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    });

  }

  ngOnDestroy() {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
  }
}