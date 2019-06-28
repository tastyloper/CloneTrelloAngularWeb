import { Component, OnInit, Renderer2 } from '@angular/core';
import { BgColors } from 'src/app/core/type/bg-color';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-trello',
  templateUrl: './trello.component.html',
  styleUrls: ['./trello.component.css']
})
export class TrelloComponent implements OnInit {
  appUrl: string = environment.appUrl;
  colorBoolean: boolean = false;
  colors: BgColors[] = ['#0079BF', '#D29034', '#4BBF6B', '#B03642'];

  constructor(private renderer: Renderer2, private http: HttpClient) { }

  ngOnInit() {
    this.getBgColor();
  }

  getBgColor() {
    this.http.get(this.appUrl + 'backgroundcolors/1')
      .subscribe(backColor => this.renderer.setStyle(document.body, 'background-color', backColor['background_color']));
  }

  changeBgColor(color: BgColors) {
    this.colorBoolean = !this.colorBoolean;
    this.http.patch(this.appUrl + 'backgroundcolors/1', { background_color: color })
      .subscribe(backColor =>
        this.renderer.setStyle(document.body, 'background-color', backColor['background_color'])
      );
  }
}
