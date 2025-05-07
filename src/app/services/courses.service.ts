import {inject, Injectable} from "@angular/core";
import { HttpClient, HttpContext } from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {firstValueFrom} from "rxjs";
import {Course} from "../models/course.model";
import {GetCoursesResponse} from "../models/get-courses.response";
import { SkipLoading } from "../components/loading/loading.component";


@Injectable({
  providedIn: "root"
})
export class CoursesService {
  http = inject(HttpClient);
  private readonly COURSES_URL = environment.apiRoot + "/courses";


  async loadAllCourses() {
    const courses$ = this.http.get<GetCoursesResponse>(this.COURSES_URL,
      {
        context: new HttpContext().set(SkipLoading, true)  
      }
    );
    // todo: try to remove async-await 
    const response = await firstValueFrom(courses$);
    return response.courses;
  }
  
  createCourse(course: Partial<Course>) {
    const course$ = this.http.post<Course>(this.COURSES_URL, course);
    return firstValueFrom(course$);
  } 

  editCourse(courseId: string, changes: Partial<Course>){
    const course$ = this.http.put<Course>(this.COURSES_URL+ '/' + courseId, changes);
    return firstValueFrom(course$);
  } 

  deleteCourse(courseId: string) {
    const course$ = this.http.delete(this.COURSES_URL+ '/' + courseId);
    return firstValueFrom(course$);
  }

  getCourseById(courseId: string){
    const course$ = this.http.get<Course>(this.COURSES_URL + `/${courseId}`);
    return firstValueFrom(course$);
  }


}
