import {Component, Input, input, model} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CourseCategory } from '../../models/course-category.model';

@Component({
  selector: 'course-category-combobox',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './course-category-combobox.component.html',
  styleUrl: './course-category-combobox.component.scss'
})
export class CourseCategoryComboboxComponent {

  label = input.required<string>();
  value = model.required<CourseCategory>(); 

  @Input() control!: FormControl;




  onCategoryChanged(newValue: string) {
    this.value.set(newValue as CourseCategory);
  }

}

