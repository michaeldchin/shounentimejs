import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Image } from './image';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent {
  images = new Array<Image>();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getImages().subscribe(res => {
      this.images = res
    });
  }

  getImages() {
    return this.http.get<Array<Image>>(`${environment.backendApi}/images`)
  }
}
