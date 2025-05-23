import {Component, computed, effect, inject, Injector, signal} from '@angular/core';
import {CoursesService} from "../../services/courses.service";
import {alphaSort, Course, sortCoursesBySeqNo} from "../../models/course.model";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {CoursesCardListComponent} from "../courses-card-list/courses-card-list.component";
import {MatDialog} from "@angular/material/dialog";
import {MessagesService} from "../../services/messages.service";
import {catchError, from, throwError} from "rxjs";
import {toObservable, toSignal, outputToObservable, outputFromObservable} from "@angular/core/rxjs-interop";
import { CoursesServiceWithFetch } from '../../services/courses-fetch.service';
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';
import { LoadingService } from '../../services/loading.service';
import { COURSE_CATEGORIES } from '../../constants';

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
    messagesService = inject(MessagesService);
    dialog = inject(MatDialog);

    #courses = signal<Course[]>([]);
    beginnerCourses = computed(() => this.#courses().filter(course => course.category === COURSE_CATEGORIES.BEGINNER));
    advancedCourses = computed(() => this.#courses().filter(course => course.category === COURSE_CATEGORIES.ADVANCED));
    
    // learning
    courses$ = toObservable(this.#courses);

    constructor(){
        this.courses$.subscribe(courses => {
            console.log('Courses emitted by observable: ', courses);
        });
        sessionStorage.clear();
        this.loadCourses()
            .then(() => console.log('All courses loaded.'))
            .catch(err => {
                console.error('Error loading courses: ', err)
                this.messagesService.showMessage('error' , 'Error loading courses: ' + err);
            });
        
        effect(() => {
            const beginnerCourses = this.beginnerCourses();
            const advancedCourses = this.advancedCourses();
            if (beginnerCourses.length > 0)
                 console.log('beginnerCourses: ', beginnerCourses);
            if (advancedCourses.length > 0)
                console.log('advancedCourses: ', advancedCourses);
        });

        
    }    

    onCourseUpdated(course: Course) {
        try{
            const courses = this.#courses().map(c => c.id === course.id ? course : c);
            this.messagesService.showMessage('success' , 'Course updated successfully!');
            this.#courses.set(courses);

       }
       catch(err){
            console.error('Error updating course: ' + err);
            this.messagesService.showMessage('error' , 'Error updating course: ' + err);
       }

    }

    async onCourseDeleted(courseId: string) {
       try{
            await this.coursesService.deleteCourse(courseId);
            this.messagesService.showMessage('success' , 'Course deleted successfully!');
            const courses = this.#courses().filter(c => c.id !== courseId);
            this.#courses.set(courses);

       }
       catch(err){
            console.error('Error deleting course: ' + err);
            this.messagesService.showMessage('error' , 'Error deleting course: ' + err);
       }
    }


    async onAddCourse() {
        const addedCourse = await openEditCourseDialog(this.dialog, 
            {
                mode: 'create',
                title: 'Добавить курс'
            });
    
        if (!addedCourse) {
            this.messagesService.showMessage('error' , 'Error adding new course.' );
            return;
        }
        if (addedCourse === 'closed') {
            return;
        }

        this.#courses.set([...this.#courses(), addedCourse].sort(alphaSort));
        this.messagesService.showMessage('success' , 'Course added successfully!');
        console.log('Course added: ', addedCourse);
    }

        
    private async loadCourses() {
        try{
            const courses = (await this.coursesService.loadAllCourses()).sort(alphaSort);
            this.#courses.set(courses);
            return courses;
        }

        catch (error) {
            return Promise.reject(error);
        }
 
    }

    // inject context
    injector = inject(Injector);
    onToObservableExample() {

        //first example
        const courses$ = toObservable(this.#courses, {
            injector: this.injector
        });

        this.courses$.subscribe(courses => {
            console.log('Courses inside method observable: ', courses);
        });

        // second example
        const numbers = signal(0);
        numbers.set(1);
        numbers.set(2);
        numbers.set(3);
        const numbers$ = toObservable(numbers, {
            injector: this.injector
        });
        numbers.set(4);
        numbers$.subscribe(num => {
            //prints 5 only
            console.log('Numbers inside method observable: ', num);
        });
        numbers.set(5);
    }    
}

