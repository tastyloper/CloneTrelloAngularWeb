import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';

import { List } from 'src/app/core/interface/list.interface';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  appUrl: string = environment.appUrl;
  lists: List[];
  addListOpen = true;
  verticalContainerHeight = 0;
  verticalBoxHeight = 0;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getTodos();
  }

  horizontalDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.lists, event.previousIndex, event.currentIndex);
    this.lists = this.lists.map((itme, listSort) => {
      return { ...itme, listSort };
    });
  }

  verticalDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.lists = this.lists.map(list => {
        if (+event.container.id === list.id) {
          const cards = list.cards.map((card, cardSort) => ({ ...card, cardSort}));
          return { ...list, cards };
        } else {
          return list;
        }
      });
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.lists = this.lists.map(list => {
        if (+event.previousContainer.id === list.id) {
          const cards = list.cards.map((card, cardSort) => ({ ...card, cardSort}));
          return { ...list, cards };
        } else if (+event.container.id === list.id) {
          const cards = list.cards.map((card, cardSort) => ({ ...card, cardSort}));
          return { ...list, cards };
        } else {
          return list;
        }
      });
    }
  }

  getTodos() {
    this.http.get<List[]>('http://clonetrelloapi.jinukk.me/main/').subscribe(lists => this.lists = lists);
  }

  getConnectedList(): any[] {
    return this.lists.map(x => `${x.id}`);
  }

  generateListSort() {
    return this.lists.length ? Math.max(...this.lists.map(({ listSort }) => listSort)) : 0;
  }

  addList(input: HTMLInputElement) {
    if (!input.value.trim()) { return; }
    this.http.post<List>(this.appUrl + 'title/', {
      title: input.value,
      listSort: this.generateListSort()
    }).subscribe(list => this.lists = [...this.lists, list]);
    input.value = '';
  }

  // List 삭제
  removeList(listId: number) {
    this.lists = this.lists.filter(({ id }) => listId !== id);
  }

  // 카드 생성
  addCardTitle(cardInput: HTMLTextAreaElement) {
    if (!cardInput.value.trim()) { return; }
    this.lists = this.lists.map(list => {
      if (+cardInput.id === list.id) {
        const newCardSort = list.cards.length ? Math.max(...list.cards.map(({ cardSort }) => cardSort)) + 1 : 1;
        return { ...list, cards: [...list.cards, {
          title: 1, cardSort: newCardSort, id: 100, cardTitle: cardInput.value, description: '', comments: []
        }] };
      } else {
        return list;
      }
    });
  }

  // 카드 삭제
  removeCard(listId: number, removeCardId: number) {
    this.lists = this.lists.map(list => {
      if (listId === list.id) {
        const newCard = list.cards.filter(({ id }) => removeCardId !== id);
        return { ...list, cards: [...newCard] };
      } else {
        return list;
      }
    });
  }

  removeSnackBar(listId: number, removeCardId: number, card = false) {
    const snackBarRef = this.snackBar.open('Are you sure you want to delete?', 'Delete', {
      duration: 5000,
      verticalPosition: 'top'
    });
    snackBarRef.onAction().subscribe(() => {
      if (card) { this.removeCard(listId, removeCardId); } else { this.removeList(listId); }
    });
  }

  titleResize(textarea: HTMLTextAreaElement) {
    textarea.style.height = '1px';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  changeTitle(verticalListHeaderTarget: HTMLDivElement, textarea: HTMLTextAreaElement) {
    verticalListHeaderTarget.classList.add('is-hidden');
    textarea.focus();
  }

  changeTitleEnd(elem: HTMLDivElement) {
    elem.classList.remove('is-hidden');
  }

  verticalPlaceholderHeight(elem: HTMLDivElement) {
    this.verticalContainerHeight = elem.scrollHeight;
  }

  boxPlaceholderHeight(elem: HTMLDivElement) {
    this.verticalBoxHeight = elem.scrollHeight;
  }

  showAddCard(cardComposer: HTMLDivElement, addCardBtn: HTMLAnchorElement, textarea: HTMLTextAreaElement) {
    cardComposer.classList.remove('is-hidden');
    addCardBtn.classList.add('is-hidden');
    textarea.focus();
  }

  hideAddCard(cardComposer: HTMLDivElement, addCardBtn: HTMLAnchorElement) {
    cardComposer.classList.add('is-hidden');
    addCardBtn.classList.remove('is-hidden');
  }

  openDialog(
    cardContent: string,
    cardTitle: string,
    cardId: string,
    item,
    TodoId
  ) {}
}
