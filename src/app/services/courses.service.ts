import {inject, Injectable} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {firstValueFrom} from "rxjs";
import {Course} from "../models/course.model";
import {GetCoursesResponse} from "../models/get-courses.response";


@Injectable({
  providedIn: "root"
})
export class CoursesService {
  http = inject(HttpClient);
  private readonly COURSES_URL = environment.apiRoot + "/courses";


  async loadAllCourses(): Promise<Course[]> {
    const courses$ = this.http.get<GetCoursesResponse>(this.COURSES_URL);
    const response = await firstValueFrom(courses$);
    return response.courses;
  }

}
