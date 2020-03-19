import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Post } from '../shared/postModel';

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.css']
})
export class SearchListComponent implements OnInit {

  Category: string;
  featured: Post[];

  
  constructor(private storage: AngularFireStorage,
              private afs: AngularFirestore,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.Category = params.category;
          // this.editMode = params.title != null;
          this.getList();
        }
      );

   
  }

  getList(){
    this.afs.collection<Post>('posts', query =>
    query.where('CATEGORY', '==', this.Category).orderBy('CREATEDDATE', 'desc')
  ).valueChanges().subscribe(
    data => {
      this.featured = data;
      console.log(data);
      console.log('test tdd');
    }
  );
  }

}
