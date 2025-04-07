import {Component, computed, effect, inject, Injector, signal} from '@angular/core';
import {CoursesService} from "../services/courses.service";
import {alphaSort, Course, sortCoursesBySeqNo} from "../models/course.model";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {CoursesCardListComponent} from "../courses-card-list/courses-card-list.component";
import {MatDialog} from "@angular/material/dialog";
import {MessagesService} from "../messages/messages.service";
import {catchError, from, throwError} from "rxjs";
import {toObservable, toSignal, outputToObservable, outputFromObservable} from "@angular/core/rxjs-interop";
import { CoursesServiceWithFetch } from '../services/courses-fetch.service';

@Component({
    selector: 'home',
    imports: [
        MatTabGroup,
        MatTab,
        CoursesCardListComponent
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {

    #courses = signal<Course[]>([]);
    coursesService = inject(CoursesService);
    
    beginnerCourses = computed(() => this.#courses().filter(course => course.category === 'BEGINNER'));
    advancedCourses = computed(() => this.#courses().filter(course => course.category === 'ADVANCED'));
    
    constructor(){
        effect(() => {
            console.log('beginningCourses: ', this.beginnerCourses());
            console.log('advancedCourses: ', this.advancedCourses());
        });

        this.loadCourses()
            .then(courses => console.log('All courses loaded:courses: ', this.#courses()));
    }    
    
    
    async loadCourses() {
        try{
            const courses = (await this.coursesService.loadAllCourses()).sort(alphaSort);
            this.#courses.set(courses);
            return courses;
        }

        catch (error) {
            alert('Error loading courses: ' + error);
            console.error('Error loading courses: ', error);
            return Promise.reject(error);
        }
    }

    onCourseUpdated(course: Course) {
        const courses = this.#courses().map(c => c.id === course.id ? course : c);
        this.#courses.set(courses);
    }

    async onCourseDeleted(courseId: string) {
       try{
            await this.coursesService.deleteCourse(courseId);
            const courses = this.#courses().filter(c => c.id !== courseId);
            this.#courses.set(courses);

       }
       catch(err){
            console.error(err);
            alert('Error deleting cours.');
       }
    }

    
}

