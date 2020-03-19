import { Component, OnInit } from '@angular/core';
import { Post } from '../shared/postModel';
import { HomePageService } from '../shared/home-page.service';
import { BlogsFirestoreService } from '../shared/blogs.firestore.service';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  posts: Post[];
  SCRUM: Post[];
  KANBAN: Post[];
  XP: Post[];
  trend: Post;
  recents: any;
  featured: Post[];
  private categorized: any;

  private itemDoc: AngularFirestoreCollection;
  constructor(
    private homePageService: HomePageService,
    private blogsFirestoreService: BlogsFirestoreService,
    private afs: AngularFirestore) { }
  ngOnInit() {

    this.afs.collection<Post>('posts', query =>
      query.where('CATEGORY', '==', 'Trend').
        where('ACTIVATIONSTATUS', '==', true).
        where('ISPUBLISHED', '==', true).
        orderBy('CREATEDDATE', 'desc').limit(1)
    ).valueChanges().pipe(take(1)).subscribe(
      data => {
        this.trend = data[0];
      }
    );

    const doc = this.afs.collection('posts', query =>
      query.orderBy('CREATEDDATE', 'desc').
        where('ACTIVATIONSTATUS', '==', true).
        where('ISPUBLISHED', '==', true).limit(2)
    ).valueChanges().pipe(take(1));
    doc.subscribe(data => {
      this.recents = data;
      console.log('recents==========');
      console.log(data);
    });

    const doc1 = this.afs.collection<Post>('posts', query =>
      query.where('ISAUTHORRECOMMENDED', '==', true).
        where('ACTIVATIONSTATUS', '==', true).
        where('ISPUBLISHED', '==', true).
        orderBy('CREATEDDATE', 'desc').limit(6)
    ).valueChanges();
    doc1.pipe(
      take(1)
      // ,
      // filter(
      //   data  => {
      // console.log(data);
      // return  data.TITLE !== this.recents[0].TITLE;
      //   }
      // )
    ).subscribe(data => {
      this.featured = data;
      // console.log(data);
      // this.featured =
      // data.filter(post => post.TITLE !== this.recents[0].TITLE).
      //   filter(post => post.TITLE !== this.recents[1].TITLE);
      // console.log(this.featured);
    });

    this.afs.collection<Post>('posts', query =>
      query.where('CATEGORY', '==', 'Lifestyle').
        where('ACTIVATIONSTATUS', '==', true).
        where('ISPUBLISHED', '==', true).
        orderBy('CREATEDDATE', 'desc').limit(3)
    ).valueChanges().pipe(take(1)).subscribe(
      data => {
        this.SCRUM = data;
      }
    );

    
    this.afs.collection<Post>('posts', query =>
      query.where('CATEGORY', '==', 'Health').
        where('ACTIVATIONSTATUS', '==', true).
        where('ISPUBLISHED', '==', true).
        orderBy('CREATEDDATE', 'desc').limit(3)
    ).valueChanges().pipe(take(1)).subscribe(
      data => {
        this.KANBAN = data;
      }
    );
    this.afs.collection<Post>('posts', query =>
      query.where('CATEGORY', '==', 'COVID-19').
        where('ACTIVATIONSTATUS', '==', true).
        where('ISPUBLISHED', '==', true).
        orderBy('CREATEDDATE', 'desc').limit(3)
    ).valueChanges().pipe(take(1)).subscribe(
      data => {
        // console.log(data);
        this.XP= data;
      }
    );
  }


}
