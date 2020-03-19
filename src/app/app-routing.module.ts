import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { HomeComponent } from './home/home.component';
import { PostComponent } from './post/post.component';
import { authComponent } from './auth/authComponent';
import { ManagePostsComponent } from './manage-posts/manage-posts.component';
import { SearchListComponent} from './search-list/search-list.component';
import { authGaurd } from './auth/authGaurd.service';
import { AboutUsComponent } from './about-us/about-us.component';


const routes: Routes = [
  {
    path: 'new',
    component: AdminComponent,
    canActivate : [authGaurd]
  },
  {
    path: 'edit/:title',
    component: AdminComponent,
    canActivate : [authGaurd]
  },
  {
    path: 'searchList/:category',
    component: SearchListComponent
  },
  {
    path: '', component: HomeComponent
  },
  {
    path: 'aboutUs', component: AboutUsComponent
  },
  {
    path: 'post/:title', component: PostComponent
  },
  { path: 'auth' , component : authComponent},
  {
    path: 'managePosts' ,
    component : ManagePostsComponent ,
    canActivate : [authGaurd]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
