import {Component, effect, inject, signal} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {Course} from "../../models/course.model";
import {CoursesService} from "../../services/courses.service";
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {CourseCategoryComboboxComponent} from "../course-category-combobox/course-category-combobox.component";
import {CourseCategory} from "../../models/course-category.model";
import { firstValueFrom } from 'rxjs';
import { COURSE_CATEGORIES } from '../../constants';
import { MessagesService } from '../../services/messages.service';
import { EditCourseDialogData } from '../../models/edit-course-dialog.data.model';
import { LoadingIndicatorComponent } from '../loading/loading.component';

@Component({
  selector: 'edit-course-dialog',
  standalone: true,
  imports: [
    LoadingIndicatorComponent,
    ReactiveFormsModule,
    CourseCategoryComboboxComponent
  ],
  templateUrl: './edit-course-dialog.component.html',
  styleUrl: './edit-course-dialog.component.scss'
})
export class EditCourseDialogComponent {
  coursesService = inject(CoursesService);
  dialogRef = inject(MatDialogRef<EditCourseDialogComponent>);
  data = inject(MAT_DIALOG_DATA) as EditCourseDialogData;
  fb = inject(FormBuilder);
  messagesService = inject(MessagesService);

  
  editCourseDialogueForm = this.fb.group({
    title: [this.data?.course?.title, Validators.required],
    longDescription: [this.data?.course?.longDescription, Validators.required],
    category: [this.data?.course?.category ?? COURSE_CATEGORIES.BEGINNER, Validators.required],
    iconUrl: [this.data?.course?.iconUrl, Validators.required]
  });
  category = signal<CourseCategory>(this.editCourseDialogueForm.get('category')!.value as CourseCategory);

  constructor() {
    effect(() => {
      console.log('Category latest val: ', this.category());
    });
  }
  onCancel () {
    this.dialogRef.close('closed'); 
  }

  onSave() {
    if (this.editCourseDialogueForm.invalid) {
      this.messagesService.showMessage('warning', 'Please fill all required fields!');
      return;
    } 
    const courseProps = this.editCourseDialogueForm.value as Partial<Course>;
    if (this.data.mode === 'create') {
      this.saveCourse(courseProps);
    }
    else if (this.data.mode === 'update') {
      this.saveCourse(courseProps, this.data?.course!.id);
    }
  }


  private async saveCourse(changes: Partial<Course>, courseId?: string) { 
    try {
      const course = courseId ? 
        await this.coursesService.editCourse(courseId, changes):
        await this.coursesService.createCourse(changes);
      console.log('Course saved: ', course);
      this.dialogRef.close(course)
      return course;
    }
    catch (error) {
      console.error('Error saving course: ', error);
      return Promise.reject(error);
    }
  }

}


export async function openEditCourseDialog(dialog: MatDialog, data: EditCourseDialogData): Promise<Course | null | 'closed'> {

  //const dialog = inject(MatDialog);
  

  //const coursesService = inject(CoursesService);
  //const fb = inject(FormBuilder);

   const dialogClosed$ = dialog.open(EditCourseDialogComponent, {
    data: data,
    width: '400px',
    disableClose: true,
    autoFocus: true
  }).afterClosed();
  
  return firstValueFrom(dialogClosed$);


  // return dialogRef.afterClosed().pipe(
  //   switchMap((data: EditCourseDialogData) => {
  //     if (!data) {
  //       return of(null);
  //     }
  //     return coursesService.editCourse(course.id, data);
  //   })
  // );
}

 
