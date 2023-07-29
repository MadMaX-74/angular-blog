import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostService} from "../../shared/post.service";
import {Post} from "../../shared/interfaces";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy{
  posts: Post[] = []
  pSub: Subscription
  dSub: Subscription
  searchStr: string = ''
  constructor(private postService: PostService) {
  }
  ngOnInit(): void {
    this.pSub = this.postService.getAll().subscribe(posts => {
      this.posts = posts
    })
  }

  ngOnDestroy(): void {
    this.pSub && this.pSub.unsubscribe()
    this.dSub && this.dSub.unsubscribe()
  }


  remove(id: string) {
    this.postService.remove(id).subscribe(() => {
      this.posts.filter(post => post.id !== id)
    })
  }
}
