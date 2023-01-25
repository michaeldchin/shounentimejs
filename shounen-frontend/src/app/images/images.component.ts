import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Image } from './image';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent {
  images = new Array<Image>();

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams
      .pipe(switchMap(params => this.getImages(params['server'])))
      .subscribe(res => {
        this.images = res
      });
  }

  getImages(serverId: String) {
    const params = { guildId: serverId }
    return this.http.get<Array<Image>>(`${environment.backendApi}/images?server=` + serverId)
  }
}
