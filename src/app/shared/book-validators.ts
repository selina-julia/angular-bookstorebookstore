import { Observable } from "rxjs";
import { FormControl, FormArray } from "@angular/forms";
import { BookStoreService } from "./book-store.service";
import { map } from "rxjs/operators";

export class BookValidators {
  static isbnFormat(control: FormControl): { [error: string]: any } {
    if (!control.value) {
      return null;
    }
    const isolatedNumbers = control.value.replace(/-/g, "");
    const isbnPattern = /(^\d{10}$)|(^\d{13}$)/;
    return isbnPattern.test(isolatedNumbers)
      ? null
      : { isbnFormat: { valid: false } };
  }
  static atLeastOneImage(controlArray: FormArray): { [error: string]: any } {
    const check = controlArray.controls.every(el => {
      return el.value.url && el.value.title;
    });
    let result =
      check && controlArray.length > 0
        ? null
        : { atLeastOneImage: { valid: false, invalid: true } };
    return result;
  }
  static isbnExists(bs: BookStoreService) {
    return function(
      control: FormControl
    ): Observable<{ [error: string]: any }> {
      return bs
        .check(control.value)
        .pipe(
          map(exists => (!exists ? null : { isbnExists: { valid: false } }))
        );
    };
  }
}
