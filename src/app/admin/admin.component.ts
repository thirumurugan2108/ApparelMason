import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, forkJoin } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { take, debounceTime, exhaustMap, flatMap, finalize, takeUntil } from 'rxjs/operators';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Post } from '../shared/postModel';
import * as firebase from 'firebase';
import {
  ToolbarService,
  LinkService, ImageService, HtmlEditorService, TableService, QuickToolbarService
} from '@syncfusion/ej2-angular-richtexteditor';

interface CategoryList {
  CATEGORYLIST: string[];
  // SCRUMLIST : String[] ;

}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],

})


export class AdminComponent implements OnInit {

  imageSrc: string;
  // loaded: boolean;
  filePath: string;
  file: any;
  isNewCategory = false;
  isNewSubCategory = false;
  title: string;
  content = `
  <p>The RichTextEditor triggers events based on its actions. </p>
                      <p> The events can be used as an extension point to perform custom operations.</p>
                      <ul>
                          <li>created - Triggers when the component is rendered.</li>
                          <li>change - Triggers only when RTE is blurred and changes are done to the content.</li>
                          <li>focus - Triggers when RTE is focused in.</li>
                          <li>blur - Triggers when RTE is focused out.</li>
                          <li>actionBegin - Triggers before command execution using toolbar items or executeCommand method.</li>
                          <li>actionComplete - Triggers after command execution using toolbar items or executeCommand method.</li>
                          <li>destroyed – Triggers when the component is destroyed.</li>
                      </ul>`;
  isAuthorRecommended = false;
  isActive = false;
  isPublished = false;
  isContentEdiatable = false;
  docRef;
  docId;
  postPreview;

  private itemDoc: AngularFirestoreDocument;
  categoryList: string[];
  SUBCATEGORYLIST: string[];

  editMode = false;
  // postForm: FormGroup;
  contactForm: FormGroup;
  post: Post = new Post();
  isImageLoaded = false;

  public tools: object = {
    items: ['Undo', 'Redo', '|',
      'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
      'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
      'SubScript', 'SuperScript', '|',
      'LowerCase', 'UpperCase', '|',
      'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
      'Indent', 'Outdent', '|', 'CreateLink', 'CreateTable',
      'Image', '|', 'ClearFormat', 'Print', 'SourceCode', '|', 'FullScreen']
  };
  public quickTools: object = {
    image: [
      'Replace', 'Align', 'Caption', 'Remove', 'InsertLink', '-', 'Display', 'AltText', 'Dimension']
  };
  // reactPost = new Post();
  constructor(private storage: AngularFireStorage,
              private afs: AngularFirestore,
              private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder) {
    this.contactForm = this.createFormGroup(formBuilder);
  }

  createFormGroup(formBuilder: FormBuilder) {

    return formBuilder.group({
      CATEGORY: new FormControl('', Validators.required),
      SUBCATEGORY: new FormControl('', Validators.required),
      TITLE: new FormControl('', Validators.required),
      // 'IMAGEPATH': new FormControl(this.post.IMAGEPATH, Validators.required),
      ISAUTHORRECOMMENDED: new FormControl('', Validators.required),
      ISPUBLISHED: new FormControl('', Validators.required),
      ACTIVATIONSTATUS: new FormControl('', Validators.required),
      CONTENT: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    this.itemDoc = this.afs.doc('CATEGORIES/LIST');
    this.itemDoc.valueChanges().subscribe(data => {
      this.categoryList = data.CATEGORYLIST;
      this.SUBCATEGORYLIST = data.SUBCATEGORYLIST;
    });
    // this.isContentEdiatable = true;
    this.post = new Post();
    this.route.params
      .subscribe(
        (params: Params) => {
          this.title = params.title;
          this.editMode = params.title != null;
        }
      );

    this.getValuesForEdit();
    if (this.editMode) {
      this.contactForm.get('CONTENT').clearValidators();
    }
    this.postPreview = this.contactForm.valueChanges;
  }

  public getValuesForEdit() {
    if (this.editMode) {
      const doc = this.afs.collection<Post>('posts', ref => ref.where('TITLE', '==', this.title).limit(1));

      doc.snapshotChanges()
        .pipe(
          take(1)
        )
        .subscribe(
          data => {
            console.log(data[0].payload.doc.data);
            this.post = data[0].payload.doc.data();
            this.docRef = data[0].payload.doc.ref;
            this.docId = data[0].payload.doc.id;
            this.contactForm.patchValue(this.post);
          }
        );
    }
    else {
      this.isContentEdiatable = true;
    }
  }

  getContentForEdit() {
    this.isContentEdiatable = true;
    // this.afs.doc<{ 'CONTENT': string }>('posts/' + this.docId + '/otherDetails/content').valueChanges()
    //   .subscribe(
    //     data => {
    //       console.log(data.CONTENT);
    //       this.contactForm.controls['CONTENT'].setValue(data.CONTENT);
    //     }
    //   );
  }
  switchCategory() {
    this.isNewCategory = !this.isNewCategory;
  }

  switchSubCategory() {
    this.isNewSubCategory = !this.isNewSubCategory;
  }

  savePost1() {
    this.afs.doc('posts/IYbztZhEvlU4gF23jgox/otherDetails/content').set(
      {
        CONTENT: this.contactForm.controls['CONTENT'].value
      }
    );
  }
  savePost() {
    this.post = this.contactForm.value;
    console.log(this.post);

    if (this.isImageLoaded) {
      this.filePath = `posts/${new Date().getTime()}_${this.file.name}`;
      const fileref = this.storage.ref(this.filePath);
      const task = this.storage.upload(this.filePath, this.file);
      task.then((f) => {
        return f.ref.getDownloadURL().then((url) => {
          console.log(url);
          // this.afs.collection('posts').add
          // this.afs.collection(this.category).doc(this.title)
          if (!this.editMode) {
            this.afs.collection('posts').add(
              {
                TITLE: this.post.TITLE,
                // CONTENT: this.content,
                IMAGEPATH: url,
                CREATEDDATE: new Date(),
                CATEGORY: this.post.CATEGORY,
                SUBCATEGORY: this.post.SUBCATEGORY,
                ISAUTHORRECOMMENDED: this.post.ISAUTHORRECOMMENDED,
                ACTIVATIONSTATUS: this.post.ACTIVATIONSTATUS,
                ISPUBLISHED: this.post.ISPUBLISHED
              }
            ).then(
              data => {
                this.docId = data.id;
                console.log(data);
              }
            ).then(
              data => {
                console.log('rntering contentEditable ');
                console.log(this.docId);
                this.afs.doc('posts/' + this.docId + '/otherDetails/content').set(
                  {
                    CONTENT: this.contactForm.controls['CONTENT'].value
                  }
                );
              }
            );
          } else {

            console.log('entering update');
            const obj = {
              ... { IMAGEPATH: url }
            };
            if (true) {
              this.docRef.update
                (
                  {
                    TITLE: this.post.TITLE,
                    // CONTENT: this.content,
                    // obj,
                    // If(url){
                    IMAGEPATH: url,
                    // },
                    CREATEDDATE: new Date(),
                    CATEGORY: this.post.CATEGORY,
                    SUBCATEGORY: this.post.SUBCATEGORY,
                    ISAUTHORRECOMMENDED: this.post.ISAUTHORRECOMMENDED,
                    ACTIVATIONSTATUS: this.post.ACTIVATIONSTATUS,
                    ISPUBLISHED: this.post.ISPUBLISHED
                  }).then((res) => {
                    if (this.isContentEdiatable) {
                      this.afs.doc('posts/' + this.docId + '/otherDetails/content').set(
                        {
                          CONTENT: this.post.CONTENT
                        }
                      );
                    }
                  }
                  );
            }
          }
        });
      });
    } else {
      this.docRef.update
        (
          {
            TITLE: this.post.TITLE,
            CREATEDDATE: new Date(),
            CATEGORY: this.post.CATEGORY,
            SUBCATEGORY: this.post.SUBCATEGORY,
            ISAUTHORRECOMMENDED: this.post.ISAUTHORRECOMMENDED,
            ACTIVATIONSTATUS: this.post.ACTIVATIONSTATUS,
            ISPUBLISHED: this.post.ISPUBLISHED
          }).then((res) => {
            if (this.isContentEdiatable) {
              this.afs.doc('posts/' + this.docId + '/otherDetails/content').set(
                {
                  CONTENT: this.post.CONTENT
                }
              );
            }
          }
          );
    }
    if (this.isNewCategory) {
      // this.categoryList.push(this.contactForm.get('CATEGORY').value);
      // this.afs.doc('CATEGORIES/LIST').update({ CATEGORYLIST: this.categoryList });
      this.afs.doc('CATEGORIES/LIST')
        .update({ CATEGORYLIST: firebase.firestore.FieldValue.arrayUnion(this.contactForm.get('CATEGORY').value) });
    }
    if (this.isNewSubCategory) {
      // this.SUBCATEGORYLIST.push(this.contactForm.get('SUBCATEGORY').value);
      this.afs.doc('CATEGORIES/LIST')
        .update({ SUBCATEGORYLIST: firebase.firestore.FieldValue.arrayUnion(this.contactForm.get('SUBCATEGORY').value) });
    }
  }

  handleInputChange(e) {
    console.log('input change');
    this.isImageLoaded = true;
    this.file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

    const pattern = 'image/*';
    const reader = new FileReader();

    if (!this.file.type.match(pattern)) {
      alert('invalid format');
      return;
    }

    // this.loaded = false;

    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(this.file);
  }

  _handleReaderLoaded(e) {
    console.log('_handleReaderLoaded');
    const reader = e.target;
    this.imageSrc = reader.result;
    // this.loaded = true;
  }

  // if (false) {
  // this.afs.collection<Post>('posts', ref => ref.where('TITLE', '==', this.title)).snapshotChanges().subscribe(
  // data => {
  // id = data[0].payload.doc.id;
  // console.log(data);
  // console.log(data[0].payload);
  // console.log('rntering contentEditable ');
  // console.log(this.docId);
  // // console.log(this.afs.collection('posts/' + this.docId + '/otherDetails').doc('content'));
  // this.afs.doc('posts/6n6U7YS5hnYto2gRkFgS/otherDetails/content').set(
  //   {
  //     CONTENT: this.contactForm.controls['CONTENT'].value
  //   }
  // );
  // }

  /*  uploadFile(event) {
    this.filePath = `posts/${new Date().getTime()}_${this.file.name}`;
    const fileref = this.storage.ref(this.filePath);
    const task = this.storage.upload(this.filePath, this.file);
 // task.then((f)=>{
 //   return f.ref.getDownloadURL().then((url)=>{

 //   })
 // })
 task.snapshotChanges().pipe(
   finalize(()=>

     this.imageURL= fileref.getDownloadURL())

 ).subscribe(data=>
   {
   if(this.imageURL){
   this.imageURL.subscribe( (res) =>
   {
     console.log(res);

     this.afs.collection(this.category).doc(this.title).set(
       {
         // content: this.content ,
         imagePath:res,
         // createdDate : new Date()
      })
     }
     )
   }
   }
   );
} */

  /*   getURL(){
      this.imageURL.subscribe(
          data=>
          console.log(data)
        )
    } */

  // this.filePath = `posts/${new Date().getTime()}_${this.file.name}`;
  // const task = this.storage.upload(this.filePath, this.file);
  // console.log(this.filePath);
  // const ref = this.storage.ref(this.filePath);
  //  const urlObj = ref.getDownloadURL();
  //  urlObj.pipe(
  //   take(1),exhaustMap(
  //    data =>{
  //      this.imageURL=data;
  //      console.log(this.imageURL);

  //     })
  //     );

  //   if(this.imageURL){
  //   console.log(this.imageURL);
  // }
  // this.imageURL.subscribe( (res) =>
  // {
  //   console.log(res);

  //   this.afs.collection('posts').doc('I2cYbrcl3Y45fCb1x72V').collection(this.category).doc(this.title)
  //   // this.afs.collection(this.category).doc(this.title)
  //   .set(
  //     {
  //       content: this.content ,
  //       imagePath:res,
  //       createdDate : new Date()
  //    })
  //   }
  //   );

  //  this.afs.collection(this.category).doc(this.title).set(
  //    { content: this.content ,
  //      imagePath:this.imageURL,
  //      createdDate : new Date()
  //   });
  // this.items = this.itemsCollection.valueChanges();
  // this.item.subscribe(
  //   data => {
  //     // console.log(data);
  //   }
  // )
}
