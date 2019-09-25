import { Component, OnInit, Renderer2 } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DialogContentComponent } from '../dialog-content/dialog-content.component';

import { CardService } from '../../core/service/card.service';
import { List, Card } from '../../core/interface/list.interface';
import { BgColors } from '../../core/type/bg-color';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-trello',
  templateUrl: './trello.component.html',
  styleUrls: ['./trello.component.css']
})
export class TrelloComponent implements OnInit {
  appUrl: string = environment.appUrl;
  lists: List[] = [
    {
      id: 0,
      title: 'todo1',
      listSort: 0,
      cards: [
        {
          title: 0,
          id: 0,
          cardTitle: 'todo1-1',
          description: 'todo1-1',
          comments: [
            {
              id: 0,
              comment: 'todo1-1',
              card: 0,
            }
          ],
          cardSort: 0,
        },
      ],
    },
    {
      id: 1,
      title: 'todo2',
      listSort: 1,
      cards: [
        {
          title: 0,
          id: 0,
          cardTitle: 'todo2-1',
          description: 'todo2-1',
          comments: [
            {
              id: 0,
              comment: 'todo2',
              card: 0,
            }
          ],
          cardSort: 0,
        },
      ],
    },
  ];
  colorBoolean = false;
  colors: BgColors[] = ['#0079BF', '#D29034', '#4BBF6B', '#B03642'];
  addListOpen = false;
  addCardOpen = -1;
  verticalContainerHeight = 0;
  verticalBoxHeight = 0;

  constructor(
    private renderer: Renderer2,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    public cardService: CardService
  ) {}

  ngOnInit() {
    this.getBgColor();
  }

  /**
   * 사용자가 설정한 배경색을 가져오는 메소드
   * @return {undefined}
   */
  getBgColor(): any {
    this.renderer.setStyle(document.body, 'background-color', '#0079BF');
  }

  /**
   * 사용자 선택한 배경색으로 배경색을 변경하는 메소드
   * @param {BgColors} color
   * @return {undefined}
   */
  changeBgColor(color: BgColors): any {
    this.colorBoolean = !this.colorBoolean;
    this.renderer.setStyle(document.body, 'background-color', color);
  }

  /**
   * list를 추가할 때 id들 중 가장 큰수를 찾아 1을 더해 리턴해주는 메소드
   * @return {number}
   */
  generateListId(): number {
    return this.lists.length
      ? Math.max(...this.lists.map(({ id }) => id)) + 1
      : 0;
  }

  /**
   * list를 추가할 때 sort하기 위해 부여한 번호들 중 가장 큰수를 찾아 1을 더해 리턴해주는 메소드
   * @return {number}
   */
  generateListSort(): number {
    return this.lists.length
      ? Math.max(...this.lists.map(({ listSort }) => listSort)) + 1
      : 0;
  }

  /**
   * list를 추가하는 메소드
   * @param {HTMLInputElement} input
   * @return {undefined}
   */
  addList(input: HTMLInputElement): any {
    if (!input.value.trim()) { return; }
    this.lists = [...this.lists, {
      id: this.generateListId(),
      title: input.value.trim(),
      listSort: this.generateListSort(),
      cards: [],
    }];
    input.value = '';
    console.log(this.lists);
  }

  /**
   * list를 삭제하는 메소드
   * @param {number} listId
   * @return {undefined}
   */
  removeList(listId: number): any {
    this.lists = this.lists.filter(({ id }) => listId !== id);
    console.log(this.lists);
  }

  /**
   * list의 위치를 업데이트 할 때 cdkDropList에서 cdkDropListConnectedTo 속성에 필요한 id 배열을 출력하는 메소드
   * @return {string[]}
   */
  getConnectedList(): string[] {
    return this.lists.map(x => `${x.id}`);
  }

  /**
   * list의 위치를 업데이트 메소드
   * @param {CdkDragDrop} event
   * @return {undefined}
   */
  horizontalDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.lists, event.previousIndex, event.currentIndex);
    this.lists = this.lists.map((list, listSort) => ({ ...list, listSort }));
    console.log(this.lists);
  }

  /**
   * card를 추가할 때 list 안에 cardid들 중 가장 큰수를 찾아 1을 더해 리턴해주는 메소드
   * @param {Card[]} cards
   * @return {number}
   */
  generateCardId(cards: Card[]): number {
    return cards.length ? Math.max(...cards.map(({ id }) => id)) + 1 : 0;
  }

  /**
   * card를 추가할 때 sort하기 위해 부여한 번호들 중 가장 큰수를 찾아 1을 더해 리턴해주는 메소드
   * @param {Card[]} cards
   * @return {number}
   */
  generateCardSort(cards: Card[]): number {
    return cards.length ? Math.max(...cards.map(({ cardSort }) => cardSort)) + 1 : 0;
  }

  /**
   * card를 추가하는 메소드
   * @param {HTMLTextAreaElement} cardInput
   * @return {undefined}
   */
  addCardTitle(cardInput: HTMLTextAreaElement): any {
    const value = cardInput.value.trim();
    if (!value) { return; }
    let newCardSort = 0;

    this.lists.forEach(list => {
      if (+cardInput.id === list.id) {
        newCardSort = list.cards.length ? Math.max(...list.cards.map(({ cardSort }) => cardSort)) + 1 : 0;
      }
    });

    this.lists = this.lists.map(list => {
      if (+cardInput.id === list.id) {
        return { ...list, cards: [...list.cards, {
          title: +cardInput.id,
          id: this.generateCardId(list.cards),
          cardTitle: value,
          description: '',
          comments: [],
          cardSort: this.generateCardSort(list.cards),
        }]};
      } else {
        return list;
      }
    });
    console.log(this.lists);
  }

  /**
   * card를 삭제하는 메소드
   * @param {number} listId
   * @param {number} removeCardId
   * @return {undefined}
   */
  removeCard(listId: number, removeCardId: number): any {
    this.lists = this.lists.map(list => {
      if (listId === list.id) {
        const newCard = list.cards.filter(({ id }) => removeCardId !== id);
        return { ...list, cards: [...newCard] };
      } else {
        return list;
      }
    });
    console.log(this.lists);
  }

  /**
   * card의 위치를 업데이트 메소드
   * @param {CdkDragDrop<string[]>} event
   * @return {undefined}
   */
  verticalDrop(event: CdkDragDrop<string[]>): any {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.lists = this.lists.map(list => {
        if (+event.container.id === list.id) {
          const cards = list.cards.map((card, cardSort) => ({ ...card, cardSort }));
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
          const cards = list.cards.map((card, cardSort) => ({ ...card, cardSort }));
          return { ...list, cards };
        } else if (+event.container.id === list.id) {
          const cards = list.cards.map((card, cardSort) => ({ ...card, cardSort }));
          return { ...list, cards };
        } else {
          return list;
        }
      });
    }
    console.log(this.lists);
  }

  /**
   * 삭제 시 SnackBar 알림
   * @param {number} listId
   * @param {number} removeCardId
   * @param {boolean} card
   * @return {undefined}
   */
  removeSnackBar(listId: number, removeCardId: number, card = false): any {
    const snackBarRef = this.snackBar.open(
      'Are you sure you want to delete?',
      'Delete',
      {
        duration: 5000,
        verticalPosition: 'top'
      }
    );
    snackBarRef.onAction().subscribe(() => {
      if (card) {
        this.removeCard(listId, removeCardId);
      } else {
        this.removeList(listId);
      }
    });
  }

  /**
   * title을 입력하는 textarea에 text를 입력하는데로 자동으로 높이가 변경되는 메소드
   * @param {HTMLTextAreaElement} textarea
   * @return {undefined}
   */
  titleResize(textarea: HTMLTextAreaElement): any {
    textarea.style.height = '1px';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  /**
   * title을 입력하는 'add버튼' 클릭 시 입력창으로 자동으로 변경되는 메소드
   * @param {HTMLDivElement} verticalListHeaderTarget
   * @param {HTMLTextAreaElement} textarea
   * @return {undefined}
   */
  changeTitle(
    verticalListHeaderTarget: HTMLDivElement,
    textarea: HTMLTextAreaElement
  ): any {
    verticalListHeaderTarget.classList.add('is-hidden');
    textarea.focus();
  }

  /**
   * title 입력창에서 title 입력을 완료하면 다시 입력창이 사라지고 해당 title 데이터를 변경해주는 메소드
   * @param {HTMLTextAreaElement} elem
   * @param {HTMLDivElement} block
   * @return {undefined}
   */
  changeTitleEnd(elem: HTMLTextAreaElement, block: HTMLDivElement): any {
    const title = elem.value.trim();
    if (!title) { return; }
    block.classList.remove('is-hidden');
    this.lists = this.lists.map(list => list.id === +elem.id ? { ...list, title } : list);
  }

  /**
   * list 컨테이너인 vertical-container에 높이를 실시간으로 변경하기 위한 메소드
   * @param {HTMLDivElement} elem
   * @return {undefined}
   */
  verticalPlaceholderHeight(elem: HTMLDivElement): any {
    this.verticalContainerHeight = elem.scrollHeight;
  }

  /**
   * card box인 vertical-box에서 title을 변경할때 자동으로 높이를 변경해주는 메소드
   * @param {HTMLDivElement} elem
   * @return {undefined}
   */
  boxPlaceholderHeight(elem: HTMLDivElement): any {
    this.verticalBoxHeight = elem.scrollHeight;
  }

  /**
   * card 클릭 시 dialog 오픈하는 메소드
   * @param {number} cardId
   * @return {undefined}
   */
  openDialog(card: Card): any {
    this.cardService.card = card;

    const dialogRef = this.dialog.open(DialogContentComponent, {
      height: '800px',
      width: '570px',
      data: { card }
    });

    const sub = dialogRef.componentInstance.onAdd.subscribe((data: any) => {
      this.lists = this.lists.map(item => {
        if (item.id === data.listId) {
          const cards = item.cards.map(item2 => {
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
        this.lists = this.lists.map(item => {
          if (item.id === data.listId) {
            const cards = item.cards.map(item2 => {
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

    // dialogRef.afterClosed().subscribe(() => {
    // });
  }
}
