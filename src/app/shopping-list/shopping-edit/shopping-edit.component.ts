import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy
} from '@angular/core';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  // Element Reference by using local reference.
  // @ViewChild('nameInput') nameInputRef: ElementRef;
  // @ViewChild('amountInput') amountInputRef: ElementRef;
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  @ViewChild('f') shoppingListForm: NgForm;

  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
    this.subscription = this.slService.startedEditing.subscribe((index: number) => {
      this.editMode = true;
      this.editedItemIndex = index;
      this.editedItem = this.slService.getIngredient(index);

      // set values to the form.
      this.shoppingListForm.setValue({
        name: this.editedItem.name,
        amount: this.editedItem.amount
      });
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // onAddItem() {
    // const ingName = this.nameInputRef.nativeElement.value;
    // const ingAmount = this.amountInputRef.nativeElement.value;
    // const newIngredient = new Ingredient(ingName, ingAmount);

  onAddItem(f: NgForm) {
    // using form.
    const value = f.value;

    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      this.slService.updateIngredient(this.editedItemIndex, newIngredient);
    } else {
      this.slService.addIngredient(newIngredient);
    }
    
    this.editMode = false;
    f.reset();
  }

  onDelete() {
    this.slService.deleteIngredient(this.editedItemIndex);
    // clear the form.
    this.onClear();
  }

  onClear() {
    this.shoppingListForm.reset();
    this.editMode = false;
  }

}
