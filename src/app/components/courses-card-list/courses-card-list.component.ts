import {Component, inject, input, output} from '@angular/core';
import {RouterLink} from "@angular/router";
import {Course} from "../../models/course.model";
import {MatDialog} from "@angular/material/dialog";
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';
import { MessagesService } from '../../services/messages.service';

@Component({
    selector: 'courses-card-list',
    imports: [
        RouterLink
    ],
    templateUrl: './courses-card-list.component.html',
    styleUrl: './courses-card-list.component.scss'
})
export class CoursesCardListComponent {
    dialog = inject(MatDialog);
    messagesService = inject(MessagesService);

    courses = input.required<Course[]>();
    courseUpdated = output<Course>();
    courseDeleted = output<string>();


    async onEditCourse(courseId: string) {
        const updatedCourse = await openEditCourseDialog(this.dialog, 
            {
                mode: 'update',
                title: 'Редактировать курс',
                course: this.courses().find(course => course.id === courseId)
            }
        );

        if (!updatedCourse) {
            this.messagesService.showMessage('error' , 'Error editing course.' );
            return;
        }
        if (updatedCourse === 'closed') {
            return;
        }
        console.log('Course edited: ', updatedCourse);
       
        this.courseUpdated.emit(updatedCourse as Course);
    }

    onDeleteCourse(course: Course) {
        this.courseDeleted.emit(course.id);
    }
}
