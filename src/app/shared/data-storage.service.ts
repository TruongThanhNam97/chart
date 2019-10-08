import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";

import { map, tap, take, exhaustMap } from 'rxjs/operators';
import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  // private: the private property named is a shortcut where 
  // by adding an accessory in front of the argument typescript automatically creates a property of the same name.
  constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http.put('https://ng-complete-guide-30ff1.firebaseio.com/recipes.json', recipes).subscribe((response) => {
      console.log(response);
    });
  }

  fetchRecipes() {
    // BehaviorSubject<User>. using take operators
    // take(1): want to take one value from that Obserable and thereafter it should automatically unsubscribe.
    // also manages the subscription and gives the latest user and unsubscribe.
    // not getting future users because just want to get them on demand when fetchRecipes is called.
    // get user object only once.

    // could not use 2 Obserable here or return an Obserable from inside subscribe doesn't work.
    // Solution: pipe these two Obserable together into one big Obserable.
    // using exhaustMap: Obserable chain: waiting for the first Obserable to complete then. replaced with the inner Obserable, return inside of that func passed to exhaustMap.
    // return this.authService.user.pipe(
    //   take(1), 
    //   exhaustMap((user) => {
    //     return this.http.get<Recipe[]>('https://ng-complete-guide-30ff1.firebaseio.com/recipes.json', {
    //       params: new HttpParams().set('auth', user.token)
    //     });
    //   }),
    //   map((recipes) => {
    //     // map is javascript array method. execute each elements in an array.
    //     return recipes.map(recipe => {
    //       return {
    //         ...recipe, 
    //         ingredients: recipe.ingredients ? recipe.ingredients : []
    //       };
    //     });
    //   }),
    //   tap((recipes) => {
    //     this.recipeService.setRecipes(recipes);
    //   })
    // );


    
      
      
    return this.http.get<Recipe[]>('https://ng-complete-guide-30ff1.firebaseio.com/recipes.json'
    ).pipe(map((recipes) => {
      // map is javascript array method. execute each elements in an array.
      return recipes.map(recipe => {
        return {
          ...recipe, 
          ingredients: recipe.ingredients ? recipe.ingredients : []
        };
      });
    }),
    tap((recipes) => {
      this.recipeService.setRecipes(recipes);
    }))
      
    



    // return this.http.get<Recipe[]>('https://ng-complete-guide-30ff1.firebaseio.com/recipes.json')
    // .pipe(
    //   map((recipes) => {
    //   // map is javascript array method. execute each elements in an array.
    //   return recipes.map(recipe => {
    //     return {
    //       ...recipe, 
    //       ingredients: recipe.ingredients ? recipe.ingredients : []
    //     };
    //   });
    // }), 
    //   // no semi-comma ; at the end.
    //   tap((recipes) => {
    //     this.recipeService.setRecipes(recipes);
    //   })
    // )

    // .subscribe((recipes) => {
    //   console.log(recipes);
      // this.recipeService.setRecipes(recipes);
    // });
  }
}