import {AfterViewChecked, AfterViewInit, Component, computed, ElementRef, inject, OnDestroy, OnInit, signal, viewChild} from '@angular/core';
import {LessonsService} from "../../services/lessons.service";
import {Lesson} from "../../models/lesson.model";
import {LessonDetailComponent} from "./lesson-detail/lesson-detail.component";
import { ActivatedRoute } from '@angular/router';
import { MessagesService } from '../../services/messages.service';

@Component({
    selector: 'lessons',
    imports: [
        LessonDetailComponent
    ],
    templateUrl: './lessons.component.html',
    styleUrl: './lessons.component.scss'
})
export class LessonsComponent implements OnDestroy, AfterViewChecked{


    mode = signal<'master' | 'detail'>('master');
    #lessons = signal<Lesson[]>([]);
    lessons = computed(() => this.#lessons());
    selectedLesson = signal<Lesson | null>(null);
    searchInput = viewChild<ElementRef>('searchInput');
    lastSerchQuery = signal<string>('');
    lessonsService = inject(LessonsService);
    messagesService = inject(MessagesService);
    


    ngOnDestroy() {
        sessionStorage.removeItem('lastSerchQuery');
    }
    ngAfterViewChecked() {
        if (this.searchInput()) {
            this.searchInput()!.nativeElement.value = sessionStorage.getItem('lastSerchQuery') || '';    
        }
    }

    async onSearch() {
        const query = (this.searchInput()?.nativeElement.value as string).trim().toLowerCase();
        console.log('Search query: ', query);
        const lessons = await this.lessonsService.loadLessons({query});
        this.#lessons.set(lessons);
        sessionStorage.setItem('lastSerchQuery', query.trim().toLocaleLowerCase());
    }

    onLessonSelected(lessonSelected: Lesson) {
        this.mode.set('detail');
        this.selectedLesson.set(lessonSelected);
    }

    async onLessonUpdated(lesson: Lesson) {
        try {
            const query = sessionStorage.getItem('lastSerchQuery')!;
            if (lesson.description.trim().toLocaleLowerCase().includes(query)) {
                this.#lessons.set(this.#lessons().map(l => l.id === lesson.id ? lesson : l));
            }
            else{
                this.#lessons.set(this.#lessons().filter(l => l.id !== lesson.id));
            }
            this.mode.set('master');
            this.selectedLesson.set(null);

        }
            catch (error) {
            console.error('Error saving course: ', error);
            this.messagesService.showMessage('error' , 'Error saving course: ' + error);
        }
    
    }

    onCancel(){
        this.mode.set('master');
        this.selectedLesson.set(null);
    }
}
