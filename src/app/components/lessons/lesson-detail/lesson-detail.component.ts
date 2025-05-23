import {Component, ElementRef, inject, input, output, viewChild} from '@angular/core';
import {Lesson} from "../../../models/lesson.model";
import {ReactiveFormsModule} from "@angular/forms";
import {LessonsService} from "../../../services/lessons.service";
import {MessagesService} from "../../../services/messages.service";

@Component({
    selector: 'lesson-detail',
    imports: [
        ReactiveFormsModule
    ],
    templateUrl: './lesson-detail.component.html',
    styleUrl: './lesson-detail.component.scss'
})
export class LessonDetailComponent {
    lesson  = input.required<Lesson | null>();
    lessonUpdated = output<Lesson>();
    cancel = output<void>();
    lessonDescriptionInput = viewChild<ElementRef>('lessonDescriptionInput');

    messagesService = inject(MessagesService);
    lessonsService = inject(LessonsService);

    async onSave() {
        const description = this.lessonDescriptionInput()!.nativeElement.value;
        if (description === '') {
            this.messagesService.showMessage('warning', 'Please fill all required fields!');
            return;
        }
        try { 
            const lesson = this.lesson();
            if (lesson) {
                const updatedLesson = await this.lessonsService.updateLesson(lesson!.id, {description});
                this.messagesService.showMessage('success' , 'Lesson updated successfully');
                this.lessonUpdated.emit(updatedLesson);
            }
        } catch (error) {
            this.messagesService.showMessage('error' , 'Error updating lesson: ' + error);  
            console.error('Error updating lesson: ', error);
        }
        // else {
        //     const newLesson: Lesson = {
        //         id: Math.random().toString(36).substring(2, 15),
        //         title: updatedTitle,
        //         description: '',
        //         duration: 0,
        //         createdDate: new Date(),
        //         isTopRated: false
         //     };
        //     this.lessonUpdated.emit(newLesson);
        // }
    }
    onCancel() {
        this.cancel.emit();
    }
}
