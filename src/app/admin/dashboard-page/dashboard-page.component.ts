import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostsService} from '../../shared/posts.service';
import {Post} from '../../shared/interfaces';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  postSub: Subscription;
  deletePostSub: Subscription;
  search = '';

  constructor(private postService: PostsService) {
  }

  ngOnInit() {
    this.postSub = this.postService.getPosts().subscribe(posts => {
      this.posts = posts;
    });
  }

  removePostById(id: string) {
    this.deletePostSub = this.postService.removePostById(id).subscribe(() => {
      this.posts = this.posts.filter(post => post.id !== id);
    });
  }

  ngOnDestroy(): void {
    if (this.postSub) {
      this.postSub.unsubscribe();
    }
    if (this.deletePostSub) {
      this.deletePostSub.unsubscribe();
    }
  }
}
