import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Recipe } from "./recipe.model";
import { DataStorageService } from "../shared/data-storage.service";
import { RecipeService } from "./recipe.service";

@Injectable({
  providedIn: 'root'
})
export class RecipeResolverService implements Resolve<Recipe[]> {
  constructor(private dataStorageService: DataStorageService, private recipeService: RecipeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const recipes = this.recipeService.getRecipes();
    if (recipes.length === 0) {
      // not subscribe here, because the angular feature will subscribe to find out once the data existed.
      return this.dataStorageService.fetchRecipes();
    } else {
      return recipes;
    }
  }
}