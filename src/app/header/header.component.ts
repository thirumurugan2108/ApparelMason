import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  itemDoc: AngularFirestoreDocument;
  categoryList: string[];
  constructor(private afs: AngularFirestore,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.itemDoc = this.afs.doc('CATEGORIES/LIST');
    this.itemDoc.valueChanges().subscribe(data => {
      console.log(data);
      this.categoryList = data.CATEGORYLIST;
      // this.SUBCATEGORYLIST = data.SUBCATEGORYLIST;
    });
  }

}
