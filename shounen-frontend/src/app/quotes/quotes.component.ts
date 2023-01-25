import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Quote } from './quote';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-quote',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.scss']
})
export class QuotesComponent {

  quotes = new Array<Quote>();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getQuotes().subscribe(res => {
      this.quotes = res
    });
  }

  getQuotes() {
    return this.http.get<Array<Quote>>(`${environment.backendApi}/quotes`)
  }
}
