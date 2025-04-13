import {Component, effect, inject, signal} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {Course} from "../models/course.model";
import {EditCourseDialogData} from "./edit-course-dialog.data.model";
import {CoursesService} from "../services/courses.service";
import {LoadingIndicatorComponent} from "../loading/loading.component";
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {CourseCategoryComboboxComponent} from "../course-category-combobox/course-category-combobox.component";
import {CourseCategory} from "../models/course-category.model";
import { config, firstValueFrom } from 'rxjs';

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

  dialogRef = inject(MatDialogRef<EditCourseDialogComponent>);
  data = inject(MAT_DIALOG_DATA) as EditCourseDialogData;
  fb = inject(FormBuilder);
  coursesService = inject(CoursesService);

  editCourseDialogueForm = this.fb.group({
    title: [this.data.course?.title],
    longDescription: [this.data.course?.longDescription],
    category: [this.data.course?.category],
    iconUrl: [this.data.course?.iconUrl]
  });

  onCancel () {
    this.dialogRef.close(); 
  }

  onSave() {
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


export async function openEditCourseDialog(dialog: MatDialog, data: EditCourseDialogData): Promise<Course | null> {

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

 
