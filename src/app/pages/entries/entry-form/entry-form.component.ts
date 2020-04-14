import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';
import { Entry } from 'src/app/models/entry.model';
import { EntryService } from 'src/app/services/entry.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[];
  submittingForm = false;
  entry: Entry = new Entry();

  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
  }
  private loadEntry() {
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(
        // tslint:disable-next-line: radix
        switchMap(params => this.entryService.getById(parseInt(params.get('id'))))
      ).subscribe(
        (entry) => {
          this.entry = entry;
          this.entryForm.patchValue(entry);
        },
        (error) => {
          alert('Erro no servidor, tente mais tarde');
        }
      );
    }
  }
  private buildEntryForm() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [null, [Validators.required]],
      category: [null, [Validators.required]]
    });
  }
  private setCurrentAction() {
    this.currentAction = this.route.snapshot.url[0].path === 'new' ? 'new' : 'edit';
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }
  setPageTitle() {
    const entryName = this.entry.name || '';
    this.pageTitle = this.route.snapshot.url[0].path === 'new' ? 'Cadastro de novo lançamento' : `Editando o lançamento ${entryName}`;
  }

  submitForm() {
    this.submittingForm = true;

    if (this.currentAction === 'new') {
      this.createEntry();
    } else {
      this.updateEntry();
    }
  }
  private updateEntry() {
    const entry = Object.assign(new Entry(), this.entryForm.value);
    this.entryService.update(entry).subscribe(
      res => this.actionsForSuccess(res),
      error => this.actionsForError(error)
    );
  }
  private createEntry() {
    const entry = Object.assign(new Entry(), this.entryForm.value);
    this.entryService.create(entry).subscribe(
      res => this.actionsForSuccess(res),
      error => this.actionsForError(error)
    );
  }
  private actionsForError(error: any): void {
    toastr.error('Ocorreu um erro ao processar sua solicitação');
    this.submittingForm = false;
    if (error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body);
    } else {
      this.serverErrorMessages = ['Falha na comunicação com o servidor. Por favor tente mais tarde.'];
    }
  }
  private actionsForSuccess(entry: Entry): void {
    toastr.success('Solicitação processada com sucesso');
    this.router.navigateByUrl('entries', { skipLocationChange: true }).then(
      () => this.router.navigate(['entries', entry.id, 'edit'])
    );
  }


}
