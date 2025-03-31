import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment.development";
import {Course} from "../models/course.model";


@Injectable({
  providedIn: "root"
})
export class CoursesServiceWithFetch {
   private readonly COURSES_URL = environment.apiRoot + "/courses";
 
  async loadAllCourses(): Promise<Course[]> {
    const response = await fetch(this.COURSES_URL);
    if (!response.ok) {
      throw new Error('Network response was not ok' + response.statusText);
    }
    const data = await response.json();
    return data.courses;

  }

}
