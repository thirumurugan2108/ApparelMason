import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BlogsFirestoreService {
    constructor(private firestore: AngularFirestore) { }

    getPolicies() {
        const markers = []
        this.firestore.collection('posts').get()
            .subscribe(querySnapshot => {
                querySnapshot.docs.forEach(doc => {
                    markers.push(doc.data());
                }
                )

            });
        return markers;
    }
}