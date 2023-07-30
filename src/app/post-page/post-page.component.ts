import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PostService} from "../shared/post.service";
import {Observable, switchMap} from "rxjs";
import {Post} from "../shared/interfaces";

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss']
})
export class PostPageComponent implements OnInit{
  post$: Observable<Post>
  constructor(private route:ActivatedRoute, private postService: PostService) {
  }
  ngOnInit(): void {
    this.post$ = this.route.params
      .pipe(switchMap((params) => {
        return this.postService.getById(params['id'])
      }))
  }

}
