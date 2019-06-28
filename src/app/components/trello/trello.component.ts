import { Component, OnInit, Renderer2 } from '@angular/core';
import { BgColors } from 'src/app/core/type/bg-color';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { MatDialog } from '@angular/material/dialog';

import { DialogContentComponent } from '../dialog-content/dialog-content.component';
import { List } from 'src/app/core/interface/list.interface';

@Component({
  selector: 'app-trello',
  templateUrl: './trello.component.html',
  styleUrls: ['./trello.component.css']
})
export class TrelloComponent implements OnInit {
  appUrl: string = environment.appUrl;
  lists: List[];
  colorBoolean: boolean = false;
  colors: BgColors[] = ['#0079BF', '#D29034', '#4BBF6B', '#B03642'];

  constructor(
    private renderer: Renderer2,
    private http: HttpClient,
    public dialog: MatDialog
  ) { }

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

  openDialog(
    description: string,
    title: string,
    cardId: string,
    card,
    listId,
    comments
  ) {
    const dialogRef = this.dialog.open(DialogContentComponent, {
      height: '800px',
      width: '570px',
      data: {
        content: description,
        title,
        id: cardId,
        card,
        listId,
        comment: comments
      }
    });

    const sub = dialogRef.componentInstance.onAdd.subscribe((data: any) => {
      this.lists = this.lists.map(item => {
        if (item.id === data.listId) {
          let cards = item.cards.map(item2 => {
            if (item2.id === +data.id) {
              return { ...item2, cardContent: data.cardContent };
            } else {
              return item2;
            }
          });
          return { ...item, cards };
        } else {
          return item;
        }
      });
    });

    const adding = dialogRef.componentInstance.changeCardContent.subscribe(
      (data: any) => {
        console.log(data);
        this.lists = this.lists.map(item => {
          if (item.id === data.listId) {
            let cards = item.cards.map(item2 => {
              if (item2.id === +data.id) {
                return { ...item2, cardContent: data.descriptionInput };
              } else {
                return item2;
              }
            });
            return { ...item, cards };
          } else {
            return item;
          }
        });
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
