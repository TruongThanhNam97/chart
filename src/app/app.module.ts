import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PrimeNGModule } from './prime-ng.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { RecipesComponent } from './recipes/recipes.component';
import { RecipeListComponent } from './recipes/recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeItemComponent } from './recipes/recipe-list/recipe-item/recipe-item.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ShoppingEditComponent } from './shopping-list/shopping-edit/shopping-edit.component';
import { DropdownDirective } from './shared/dropdown.directive';
import { ShoppingListService } from './shopping-list/shopping-list.service';
import { AppRoutingModule } from './app-routing.module';
import { RecipeStartComponent } from './recipes/recipe-start/recipe-start.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { RecipeService } from './recipes/recipe.service';
import { AuthComponent } from './auth/auth.component';
import { from } from 'rxjs';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { AlertComponent } from './shared/alert/alert.component';
import { PlaceHolderDirective } from './shared/helper/placeholder.directive';
import { LeftNavComponent } from './left-nav/left-nav.component';
import { CompletionProgressComponent } from './completion-progress/completion-progress.component';
import {TableModule} from 'primeng/table';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { environment } from '../environments/environment';

import { NgxPrintModule } from 'ngx-print';


// important: every each module works on its own in angular and they don't communicate with each other.
@NgModule({
  declarations: [
    // list of components, directive and custom pipe. Otherwise, could not use in route or template.
    AppComponent,
    HeaderComponent,
    RecipesComponent,
    // for example, RecipeListComponent only use it here. and could not use in another module.
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeItemComponent,
    ShoppingListComponent,
    ShoppingEditComponent,
    DropdownDirective,
    RecipeStartComponent,
    RecipeEditComponent,
    AuthComponent,
    LoadingSpinnerComponent,
    AlertComponent,
    PlaceHolderDirective,
    LeftNavComponent,
    CompletionProgressComponent
  ],
  imports: [
    // import other modules into module. to split app to multiple modules.
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    // extra module.
    AppRoutingModule,
    PrimeNGModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    NgxPrintModule
  ],
  providers: [
    // all services are provided and need to injected.
    // or by uinsg a shortcut providedIn: 'root'
    ShoppingListService, 
    RecipeService, 
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}
  ],
  // components need to be created without a selector or the root contact being used.
  // whenever you need. Then the component will be created.
  entryComponents: [
    // components create in code as dynamic components and be aware when it needs to create it programmatically.
    AlertComponent
  ],
  bootstrap: [
    // styling app. usually have one root component (AppComponent). Because makes working betweeen these components way harder.
    AppComponent
  ]
})
export class AppModule { }
