import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Route} from "@angular/router";
import {PostService} from "../../shared/post.service";
import {switchMap} from "rxjs/operators";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Post} from "../../shared/interfaces";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit, OnDestroy{
  form: FormGroup
  post: Post
  submitted = false
  uSub: Subscription
  constructor(private route: ActivatedRoute, private postService: PostService) {
  }

  ngOnInit(): void {
    this.route.params
        .pipe(switchMap((params) => {
          return this.postService.getById(params['id'])
        })).subscribe((post) => {
          this.post = post
          this.form = new FormGroup({
             title: new FormControl(post.title, Validators.required),
             text: new FormControl(post.text, Validators.required)
          })
    })
  }

  submit() {
    if (this.form.invalid) {
      return
    }
    this.submitted = true
    this.uSub = this.postService.update({
      ...this.post,
      text: this.form.value.text,
      title: this.form.value.title,
    }).subscribe(() => {
      this.submitted = false
    })
  }

  ngOnDestroy(): void {
    this.uSub && this.uSub.unsubscribe()
  }
}
