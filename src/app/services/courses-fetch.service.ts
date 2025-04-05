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

  async createCourse(course: Partial<Course>): Promise<Course> {
    const response = await fetch(this.COURSES_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(course)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok' + response.statusText);
    }
    return response.json();
  } 

  async editCourse(courseId: string, changes: Partial<Course>): Promise<Course> {
    const response = await fetch(this.COURSES_URL + '/' + courseId, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(changes)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok' + response.statusText);
    }
    return response.json();
  } 

  async deleteCourse(courseId: string) {
    const response = await fetch(this.COURSES_URL + '/' + courseId, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Network response was not ok' + response.statusText);
    }
  }

}
