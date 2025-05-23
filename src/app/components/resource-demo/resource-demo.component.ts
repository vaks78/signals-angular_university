import {Component, effect, inject, resource, ResourceRef, signal} from "@angular/core";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {environment} from "../../../environments/environment.development";
import {Lesson} from "../../models/lesson.model";
import { LessonsService } from "../../services/lessons.service";
import { rxResource, takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { catchError, debounceTime, delay, distinctUntilChanged, EMPTY, from, switchMap } from "rxjs";
import { HttpClient } from "@angular/common/http";


@Component({
  selector: 'resource-demo',
  templateUrl: './resource-demo.component.html',
  styleUrls: ['./resource-demo.component.scss'],
  imports: [MatProgressSpinner]
})
export class ResourceDemoComponent {

  env = environment;

  search = signal<string>('');

  lessonsUsingFetch = resource<Lesson[], {search: string}>({
    request: () =>({
      search: this.search()
    }),
    loader: async ({request, abortSignal}) => {
      const response = await fetch(`${this.env.apiRoot}/search-lessons?query=${request.search}`,
        {
          signal: abortSignal,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      if (!response.ok) {
        throw new Error('Error loading lessons');
      }
      const data = await response.json();
      return data.lessons;
    }
  });

  http = inject(HttpClient);
  // lessonsUsingHttp = resource<Lesson[], {search: string}>({
  //   request: () =>({
  //     search: this.search()
  //   }),
  //   loader: async ({request}) => {
  //     const lessons = await this.http.get<Lesson[]>(`${this.env.apiRoot}/search-lessons?query=${request.search}`).toPromise();
  //     return lessons;
  //   }
  // });
  // lessonsUsingHttpWithAbort = resource<Lesson[], {search: string}>({
  //   request: () =>({
  //     search: this.search()
  //   }),
  //   loader: async ({request, abortSignal}) => {
  //     const lessons = await this.http.get<Lesson[]>(`${this.env.apiRoot}/search-lessons?query=${request.search}`, {
  //       signal: abortSignal
  //     }).toPromise();
  //     return lessons;
  //   }
  // });


  // lessonsUsingHttpWithAbort: ResourceRef<Lesson[] | undefined> = rxResource({
  //   request: () => ({ search: this.search() }),
  //   loader: ({ request }) =>
  //    from(this.lessonsService.loadLessons({query: request.search}))
  //       .pipe(
  //         //delay(500), // Simulate network delay
  //         debounceTime(300),
  //         distinctUntilChanged(),
  //         takeUntilDestroyed(),

  //         //switchMap(() => this.lessonsService.loadLessons({query: request.search})),
  //         catchError(() => EMPTY)
  //       ),
  // });

  // abort() {
  //   this.lessonsUsingHttpWithAbort.set([]); // <- stops the API call, but you need to do it really fast.
  // }


  lessonsService = inject(LessonsService);
  // lessonsUsingHttpClient: ResourceRef<any> = rxResource<Lesson[], {search: string}>({
  //   request: () =>({
  //     search: this.search()
  //   }),
  //   loader: async ({request}) => {
  //     const lessons = await this.lessonsService.loadLessons({query: request.search});
  //     return lessons;
  //   }
  // });

  constructor() {

    effect(() => {
      console.log('searching lessons:', this.search() );
    })
  }

  searchLessons(search: string) {
    this.search.set(search);
  }

  reset() {

  }

  reload() {

  }
}
