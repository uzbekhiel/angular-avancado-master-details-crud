import { Component, OnInit } from '@angular/core';
import { Entry } from 'src/app/models/entry.model';
import { EntryService } from 'src/app/services/entry.service';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent implements OnInit {

  public entries: Entry[] = [];

  constructor(private entryService: EntryService) { }

  ngOnInit() {
    this.entryService.getAll().subscribe(
      (entries) => this.entries = entries,
      (error) => alert('Erro ao carregar a lista')
    );
    console.log(this.entries);
  }

  deleteEntry(entry: Entry) {
    const mustDelete = confirm('Deseja realmente exlcuir essa categoria');
    if (mustDelete) {
      this.entryService.delete(entry.id).subscribe(
        () => this.entries = this.entries.filter(e => e !== entry),
        () => alert('Erro ao tentar excluir')
      );
    }
  }



}
