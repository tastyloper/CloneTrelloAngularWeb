import { Component, OnInit, Renderer2 } from '@angular/core';
import { BgColors } from 'src/app/core/type/bg-color';

@Component({
  selector: 'app-trello',
  templateUrl: './trello.component.html',
  styleUrls: ['./trello.component.css']
})
export class TrelloComponent implements OnInit {

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
  }

  colorBoolean: boolean = false;
  colors: BgColors[] = ['#0079BF', '#D29034', '#4BBF6B', '#B03642'];
  changeBgColor(color: BgColors) {
    this.renderer.setStyle(document.body, 'background-color', color);
    this.colorBoolean = !this.colorBoolean;
  }
}
