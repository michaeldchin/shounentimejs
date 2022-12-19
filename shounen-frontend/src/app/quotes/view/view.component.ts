import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Quotes } from '../quotes';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent {

  quotes = new Array<Quotes>();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getQuotes().subscribe(res => {
      this.quotes = res
    });
  }

  getQuotes() {
    return this.http.get<Array<Quotes>>(`${environment.backendApi}/quotes`)
  }
}
