import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Post } from '../shared/postModel';
import { HomePageService } from '../shared/home-page.service';
import { BlogsFirestoreService } from '../shared/blogs.firestore.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PostComponent implements OnInit, OnDestroy {


  // private itemsCollection: AngularFirestoreCollection<Item>;
  // items: Observable<Item[]>; 
  // private itemDoc: AngularFirestoreDocument<Item>;
  // item: Observable<Item>;
  // post:Post;
  posts: Post[];
  scrums: Post[];
  title: string;
  category: string;
  private scrumcl: any;
  routeSubcription: Subscription;
  blog: any;
  id: any;
  constructor(private route: ActivatedRoute, private afs: AngularFirestore) { }
  ngOnInit() {
    this.title = this.route.snapshot.params['title'];
    // this.category=this.route.snapshot.params['category'];
    this.routeSubcription = this.route.params.subscribe((params: Params) => {
      this.title = params['title'];
      console.log(this.title);
    });

    let doc = this.afs.collection('posts', query =>
      query.where('TITLE', '==', this.title)
    ).snapshotChanges();
    doc.subscribe(data => {
      this.id = data[0].payload.doc.id;
      // this.blog = data;
      // console.log(this.blog[0].CONTENT);
      this.afs.doc<{ CONTENT }>('posts/' + this.id + '/otherDetails/content').valueChanges().subscribe(
        data => {
          this.blog = data.CONTENT;
          console.log(this.blog);
          console.log(data);
        }
      );
    });
    console.log(this.id);


  }

  ngOnDestroy() {
    this.routeSubcription.unsubscribe();
  }
}
    // this.posts=this.homePageService.getPosts();
    // this.posts=this.blogsFirestoreService.getPolicies();

    // this.scrumcl=this.afs.collection('scrum').valueChanges({ idField: 'uniqueId' });
    // this.scrumcl.subscribe(
    //      data=>{
    //        this.scrums=data;
    //       }
    //   );
    // console.log(this.posts);

    // let userDoc =this.afs.doc('posts/general/scrum');
    // let tasks = userDoc.collection('adv of scrum').valueChanges();
    // console.log(tasks);
//     this.afs.collectionGroup('scrum').snapshotChanges()
//     .subscribe(
//       actions => {
//     actions.forEach(action => {
//       // console.log(action);
//     });

// }



// this.afs.collection('userId').doc("data").set({ name: "username" });
// this.items = this.itemsCollection.valueChanges();
// this.item.subscribe(
//   data => {
//     // console.log(data);
//   }
// )






// const id = "manualId";
// const name="name";
//     const item: Item = { id, name };
//     // this.itemsCollection.doc(id).set(item);
//     this.itemsCollection.add({ id: 'item', name:'10' });



  //   this.afs.collectionGroup('scrum').valueChanges({ idField? : 'ided' })
  //   .subscribe(
  //     actions => {
  //   actions.forEach(action => {
  //     console.log(action);
  //   });
  // }
  //   );



