import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';
import { Category } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  categoryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[];
  submittingForm = false;
  category: Category = new Category();

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }
  private loadCategory() {
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(
        // tslint:disable-next-line: radix
        switchMap(params => this.categoryService.getById(parseInt(params.get('id'))))
      ).subscribe(
        (category) => {
          this.category = category;
          this.categoryForm.patchValue(category);
        },
        (error) => {
          alert('Erro no servidor, tente mais tarde');
        }
      );
    }
  }
  private buildCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }
  private setCurrentAction() {
    this.currentAction = this.route.snapshot.url[0].path === 'new' ? 'new' : 'edit';
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }
  setPageTitle() {
    const categoryName = this.category.name || '';
    this.pageTitle = this.route.snapshot.url[0].path === 'new' ? 'Cadastro de nova categoria' : `Editando a categoria ${categoryName}`;
  }

  submitForm() {
    this.submittingForm = true;

    if (this.currentAction === 'new') {
      this.createCategory();
    } else {
      this.updateCategory();
    }
  }
  private updateCategory() {
    const category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.update(category).subscribe(
      res => this.actionsForSuccess(res),
      error => this.actionsForError(error)
    );
  }
  private createCategory() {
    const category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.create(category).subscribe(
      res => this.actionsForSuccess(res),
      error => this.actionsForError(error)
    );
  }
  private actionsForError(error: any): void {
    toastr.success('Ocorreu um erro ao processar sua solicitação');
    this.submittingForm = false;
    if (error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body);
    } else {
      this.serverErrorMessages = ['Falha na comunicação co o servidor. Por favor tente mais tarde.']
    }
  }
  private actionsForSuccess(category: Category): void {
    toastr.success('Solicitação processada com sucesso');
    this.router.navigateByUrl('categories', { skipLocationChange: true }).then(
      () => this.router.navigate(['categories', category.id, 'edit'])
    );
  }


}
