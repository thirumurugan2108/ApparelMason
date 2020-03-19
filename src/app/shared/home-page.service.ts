import { Injectable } from '@angular/core';
import { Post } from './postModel';

@Injectable({
  providedIn: 'root'
})
export class HomePageService {
  posts: Post[] = [
    // new Post("1","JavaScript",
    // "Chrome Extension Protects Against JavaScript-Based CPU Side-Channel Attacks",
    // "../assets/shared/img/post-1.jpg"),
    // new Post("2","Jquery",
    // "Ask HN: Does Anybody Still Use JQuery?",
    // "../assets/shared/img/post-2.jpg")
  ];

  getPosts(){
    return this.posts.slice();
  }
}
