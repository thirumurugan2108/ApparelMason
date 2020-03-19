import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, DocumentData } from '@angular/fire/firestore';
import { MatSort } from '@angular/material/sort';

export interface Posts {
  CATEGORY: string;
  TITLE: number;
  isActivate: number;
}

@Component({
  selector: 'app-manage-posts',
  templateUrl: './manage-posts.component.html',
  styleUrls: ['./manage-posts.component.css']
})
export class ManagePostsComponent implements OnInit {
  displayedColumns: string[] = ['Category', 'TITLE', 'activationStatus','PublishedStatus','ManagePosts'];
  private itemsCollection: AngularFirestoreCollection;
  items: Observable<any[]>;
  documentData: DocumentData[];
  datas: Posts[];
  dataSource: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  constructor(private afs: AngularFirestore) {
  }

  ngOnInit() {
    this.itemsCollection = this.afs.collection('posts');
    this.itemsCollection.
      valueChanges().subscribe(data => {
        this.documentData = data;
        console.log(this.documentData);
        this.dataSource = new MatTableDataSource(this.documentData);
        if (this.dataSource) {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      });
    this.items = this.itemsCollection.valueChanges();
  }


}
