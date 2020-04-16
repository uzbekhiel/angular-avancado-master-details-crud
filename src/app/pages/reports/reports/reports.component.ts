import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import currencyFormatter from 'currency-formatter';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/category.model';
import { Entry } from 'src/app/models/entry.model';
import { EntryService } from 'src/app/services/entry.service';
import { months } from 'moment';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  expenseTotal = 0;
  receiptTotal = 0;
  balance = 0;

  expenseChartData: any;
  receiptChartData: any;

  chartOptions = {
    scales: {
      yAxes: [{ ticks: { beginAtZero: true } }]
    }
  };

  categories: Category[] = [];
  entries: Entry[] = [];

  months = [];
  years = [];

  @ViewChild('month', { static: true }) month: ElementRef = null;
  @ViewChild('year', { static: true }) year: ElementRef = null;


  constructor(private categoryService: CategoryService, private entrySerevice: EntryService) { }

  ngOnInit() {
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories
    );
    this.entrySerevice.getMonthsAndYears().subscribe(
      res => {
        res.forEach(item => {
          if (this.months.length > 0) {
            if (this.months.find(e => e.value == item.month.value) == null) {
              this.months.push(item.month);
            }
          } else {
            this.months.push(item.month);
          }

          if (this.years.length > 0) {
            if (this.years.find(e => e == item.year) == null) {
              this.years.push(item.year);
            }
          } else {
            this.years.push(item.year);
          }
        });
      }
    );
  }

  generateReports() {
    const month = this.month.nativeElement.value;
    const year = this.year.nativeElement.value;

    if (!month || !year) {
      alert('Você precisa selecionar o Mês e o Ano para geerar o relatório.')
    } else {
      this.entrySerevice.getByMonthAndYear(month, year).subscribe(
        entries => {
          if (entries !== undefined && entries.length > 0) {
            this.entries = entries;
            if (this.entries.length > 0) {
              this.calculateBalance();
              this.setChartData();
            }
          } else {
            alert('Não existem dados para o relatório pedido');
          }
        }
      );
    }
  }

  private setChartData() {
    this.receiptChartData = this.getChartData('receipt', 'Gráfico de Receitas', '#9CCC65');
    this.expenseChartData = this.getChartData('expense', 'Gráfico de Despesas', '#E03131');
    console.log(this.receiptChartData)
  }

  private getChartData(entryType: string, title: string, color: string): any {
    const chartData = [];
    this.categories.forEach(category => {
      const filteredEntries = this.entries.filter(entry => (entry.categoryId === category.id && entry.type === entryType));
      if (filteredEntries.length > 0) {
        const totalAmount = filteredEntries.reduce((total, entry) => total + currencyFormatter.unformat(entry.amount, { code: 'BRL' }), 0);
        chartData.push({ categoryName: category.name, totalAmount });
      }
    });
    return {
      labels: chartData.map(item => item.categoryName),
      datasets: [{
        label: title,
        backgroundColor: color,
        data: chartData.map(item => item.totalAmount)
      }]
    };
  }

  private calculateBalance() {
    let expenses = 0;
    let receipt = 0;
    this.entries.forEach(entry => {
      if (entry.type === 'expense') {
        expenses += currencyFormatter.unformat(entry.amount, { code: 'BRL' });
      } else {
        receipt += currencyFormatter.unformat(entry.amount, { code: 'BRL' });
      }
    });

    this.expenseTotal = currencyFormatter.format(expenses, { code: 'BRL' });
    this.receiptTotal = currencyFormatter.format(receipt, { code: 'BRL' });
    this.balance = currencyFormatter.format(receipt - expenses, { code: 'BRL' });

  }

}
