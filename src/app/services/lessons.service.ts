import {inject, Injectable, signal} from "@angular/core";
import {Lesson} from "../models/lesson.model";
import { HttpClient, HttpParams } from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {GetLessonsResponse} from "../models/get-lessons.response";
import {environment} from "../../environments/environment.development";


@Injectable({
  providedIn: 'root'
})
export class LessonsService {
  #lessonsUrl = signal(environment.apiRoot + "/search-lessons");
  lessonsUrl = this.#lessonsUrl.asReadonly();

  http = inject(HttpClient);

  async loadLessons(config: {
    courseId?: string,
    query?: string;
  }){
    const { courseId, query } = config;
    let params = new HttpParams();

    if (courseId) {
      params = params.set('courseId', courseId);
    }

    if(query){
      params = params.set('query', query);
    }

    const lessons$ = this.http.get<GetLessonsResponse>(this.#lessonsUrl(),
      {
        params
      });
    const response = await firstValueFrom(lessons$);
    debugger
    return response.lessons;
   
  }

}


