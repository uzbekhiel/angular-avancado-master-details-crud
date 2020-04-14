import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  public categories: Category[] = [];

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.categoryService.getAll().subscribe(
      (categories) => this.categories = categories,
      (error) => alert('Erro ao carregar a lista')
    );
  }

  deleteCategory(category: Category) {
    const mustDelete = confirm('Deseja realmente exlcuir essa categoria');
    if (mustDelete) {
      this.categoryService.delete(category.id).subscribe(
        () => this.categories = this.categories.filter(e => e !== category),
        () => alert('Erro ao tentar excluir')
      );
    }
  }
}
