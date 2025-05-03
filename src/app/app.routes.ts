import {Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./login/login.component";
import {LessonsComponent} from "./lessons/lessons.component";
import {ResourceDemoComponent} from "./resource-demo/resource-demo.component";
import {LinkedSignalDemoComponent} from "./linked-signal/linked-signal-demo.component";
import { isUserAuthenticated } from './guards/auth.guard';
import { c } from '@angular/core/event_dispatcher.d-pVP0-wST';
import { CourseComponent } from './course/course.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [isUserAuthenticated],
  },
  {
    path: 'courses/:courseId',
    component: CourseComponent,
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "lessons",
    component: LessonsComponent,
    canActivate: [isUserAuthenticated]
  },
  {
    path:"shopping-cart",
    component: LinkedSignalDemoComponent,
    canActivate: [isUserAuthenticated]
  },
  {
    path: "resource-demo",
    component: ResourceDemoComponent
  },
  {
    path: '**',
    redirectTo: '/'
  }
];
