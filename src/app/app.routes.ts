import {Routes} from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {LessonsComponent} from "./components/lessons/lessons.component";
import {ResourceDemoComponent} from "./resource-demo/resource-demo.component";
import {LinkedSignalDemoComponent} from "./components/linked-signal/linked-signal-demo.component";
import { isUserAuthenticated } from './guards/auth.guard';
import { CourseComponent } from './components/course/course.component';
import { courseResolver } from './resolvers/course.reslover';
import { LoginComponent } from './components/login/login.component';
import { courseLessonsResolver } from './resolvers/course-lessons.resolver';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [isUserAuthenticated]
  },
  {
    path: 'courses/:courseId',
    component: CourseComponent,
    canActivate: [isUserAuthenticated],
    resolve: {
      course: courseResolver,
      lessons: courseLessonsResolver
    }
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
