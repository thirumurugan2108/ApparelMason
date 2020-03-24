import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';

import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule, StorageBucket } from '@angular/fire/storage';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AngularFireAnalyticsModule, ScreenTrackingService } from '@angular/fire/analytics';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import { DatePipe } from '@angular/common';

import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatRadioModule} from '@angular/material/radio';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import { ChartsModule } from 'ng2-charts';

import { SanitizeHtmlPipe } from './shared/pipe/SanitizeHtmlPipe ';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinnerComponent';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AngularFirestore, AngularFirestoreModule  } from '@angular/fire/firestore';
import { AuthInterceptorservice } from './auth/auth-interceptor.service';
import { PostComponent } from './post/post.component';
import { SearchListComponent } from './search-list/search-list.component';
import { ManagePostsComponent } from './manage-posts/manage-posts.component';
import { authComponent } from './auth/authComponent';
import { AdminComponent } from './admin/admin.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { TrendComponent } from './trend/trend.component';
import { CovidConsoleComponent } from './covid-console/covid-console.component';


@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    PostComponent,
    AdminComponent,
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    SanitizeHtmlPipe,
    LoadingSpinnerComponent,
    authComponent,
    ManagePostsComponent,
    SearchListComponent,
    AboutUsComponent,
    TrendComponent,
    CovidConsoleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSidenavModule,
    MatSortModule,
    MatDatepickerModule,
    MatRippleModule,
    MatTableModule,
    ChartsModule,
    MatNativeDateModule,
    RichTextEditorAllModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireDatabaseModule,
        AngularFireStorageModule,
        AngularFirestoreModule,
        AngularFireAnalyticsModule,
        MatDatepickerModule
  ],
  providers: [AngularFirestore,ScreenTrackingService, DatePipe,
    { provide: StorageBucket, useValue: 'gs://agile-a73aa.appspot.com' },
    {provide : HTTP_INTERCEPTORS , useClass : AuthInterceptorservice , multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
