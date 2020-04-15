import { Component, Injector } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Category } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';
import { BaseResourceFormComponent } from 'src/app/shared/components/base-resource-form.component';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent extends BaseResourceFormComponent<Category> {

  constructor(
    protected categoryService: CategoryService,
    protected injector: Injector,
    protected formBuilder: FormBuilder
  ) {
    super(injector, categoryService, new Category(), Category.fromJson);
  }

  protected creationPageTitle(): string {
    return 'Cadastro de nova categoria';
  }

  protected updatePageTitle(): string {
    return `Editando a categoria: ${this.resource.name || ''}`;
  }

  protected buildResourceForm(): void {
    this.resourceForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }
}
