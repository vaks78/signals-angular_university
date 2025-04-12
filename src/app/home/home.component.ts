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
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';
import { LoadingService } from '../loading/loading.service';

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

    coursesService = inject(CoursesService);
    dialog = inject(MatDialog);
    loadingService = inject(LoadingService);
    #courses = signal<Course[]>([]);

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


    async onAddCourse() {
        const addedCourse = await openEditCourseDialog(this.dialog, 
            {
                mode: 'create',
                title: 'Добавить курс'
            });
    
        if (!addedCourse) {
            return;
        }

        this.#courses.set([...this.#courses(), addedCourse].sort(alphaSort));
        console.log('Course added: ', addedCourse);
    }
}

