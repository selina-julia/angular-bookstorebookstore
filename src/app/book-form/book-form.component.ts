import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormControl
} from "@angular/forms";
import { BookFormErrorMessages } from "./book-form-error-messages";
import { BookFactory } from "../shared/book-factory";
import { BookStoreService } from "../shared/book-store.service";
import { Book, Image } from "../shared/book";
@Component({
  selector: "bs-book-form",
  templateUrl: "./book-form.component.html"
})
export class BookFormComponent implements OnInit {
  bookForm: FormGroup;
  book = BookFactory.empty();
  errors: { [key: string]: string } = {};
  isUpdatingBook = false;
  images: FormArray;
  constructor(
    private fb: FormBuilder,
    private bs: BookStoreService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit() {
    const isbn = this.route.snapshot.params["isbn"];
    if (isbn) {
      this.isUpdatingBook = true;
      this.bs.getSingle(isbn).subscribe(book => {
        this.book = book;
        this.initBook();
      });
    }
    this.initBook();
  }
  initBook() {
    this.buildThumbnailsArray();
    this.bookForm = this.fb.group({
      id: this.book.id,
      title: [this.book.title, Validators.required],
      subtitle: this.book.subtitle,
      isbn: [
        this.book.isbn,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(13)
        ]
      ],
      description: this.book.description,
      rating: [this.book.rating, [Validators.min(0), Validators.max(10)]],
      images: this.images,
      published: this.book.published
    });
    this.bookForm.statusChanges.subscribe(() => this.updateErrorMessages());
  }
  buildThumbnailsArray() {
    this.images = this.fb.array([]);
    for (let img of this.book.images) {
      let fg = this.fb.group({
        id: new FormControl(img.id), //this.fb.control(img.id),
        url: new FormControl(img.url, [Validators.required]),
        title: new FormControl(img.title, [Validators.required])
      });
      this.images.push(fg);
    }
  }
  addThumbnailControl() {
    this.images.push(this.fb.group({ url: null, title: null }));
  }
  submitForm() {
    // filter empty values
    this.bookForm.value.images = this.bookForm.value.images.filter(
      thumbnail => thumbnail.url
    );
    const book: Book = BookFactory.fromObject(this.bookForm.value);
    //deep copy - did not work without??
    book.images = this.bookForm.value.images;
    console.log(book);
    //just copy the authors
    book.authors = this.book.authors;
    if (this.isUpdatingBook) {
      this.bs.update(book).subscribe(res => {
        this.router.navigate(["../../books", book.isbn], {
          relativeTo: this.route
        });
      });
    } else {
      book.user_id = 1; // jsut for testing
      console.log(book);
      this.bs.create(book).subscribe(res => {
        this.book = BookFactory.empty();
        this.bookForm.reset(BookFactory.empty());
        this.router.navigate(["../books"], { relativeTo: this.route });
      });
    }
  }
  updateErrorMessages() {
    console.log("Is invalid? " + this.bookForm.invalid);
    this.errors = {};
    for (const message of BookFormErrorMessages) {
      const control = this.bookForm.get(message.forControl);
      if (
        control &&
        control.dirty &&
        control.invalid &&
        control.errors[message.forValidator] &&
        !this.errors[message.forControl]
      ) {
        this.errors[message.forControl] = message.text;
      }
    }
  }
}
