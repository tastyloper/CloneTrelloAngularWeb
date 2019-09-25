import { Component, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CardService } from '../../core/service/card.service';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dialog-content',
  templateUrl: './dialog-content.component.html',
  styleUrls: ['./dialog-content.component.css']
})
export class DialogContentComponent {
  appUrl: string = environment.appUrl;
  updateData = {};
  updateData2 = {};
  onAdd = new EventEmitter();
  changeCardContent = new EventEmitter();

  descriptionState = false;
  flag = -1;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { cardId: number },
    public dialogRef: MatDialogRef<DialogContentComponent>,
    public cardService: CardService
  ) {}

  /**
   * card title 변경 메소드
   * @param {HTMLInputElement} titleInput
   * @return {undefined}
   */
  changeTitle(titleInput: HTMLInputElement): any {
    if (!titleInput.value.trim()) { return; }
    this.cardService.card.cardTitle = titleInput.value;
  }

  /**
   * card Description 변경 메소드
   * @param {HTMLInputElement} titleInput
   * @return {undefined}
   */
  changeDescription(textarea: HTMLTextAreaElement): any {
    this.cardService.card.description = textarea.value;
  }

  /**
   * textarea 글씨 입력 시 자동으로 높이 증가하는 메소드
   * @param {HTMLTextAreaElement} textarea
   * @return {undefined}
   */
  textareaResize(textarea: HTMLTextAreaElement): any {
    textarea.style.height = '1px';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  /**
   * 댓글을 추가할 때 댓글 id중 가장 큰수를 찾아 1을 더해 리턴해주는 메소드
   * @return {number}
   */
  generateCommentId(): number {
    return this.cardService.card.comments.length ? Math.max(...this.cardService.card.comments.map(({ id }) => id)) + 1 : 0;
  }

  /**
   * 댓글 추가 메소드
   * @param {HTMLInputElement} inputComment
   * @return {undefined}
   */
  addComment(inputComment: HTMLInputElement): any {
    if (!inputComment.value.trim()) { return; }
    this.cardService.card.comments = [...this.cardService.card.comments, {
      id: this.generateCommentId(),
      comment: inputComment.value,
      card: this.cardService.card.id,
    }];
    inputComment.value = '';
  }

  /**
   * 댓글 수정 메소드
   * @param {HTMLTextAreaElement} activityEdit
   * @param {number} commentID
   * @return {undefined}
   */
  activityEditSave(activityEdit: HTMLTextAreaElement, commentID: number) {
    if (!activityEdit.value.trim()) { return; }
    this.cardService.card.comments = this.cardService.card.comments.map(comment => {
      return comment.id === commentID ? { ...comment, comment: activityEdit.value } : comment;
    });
    this.flag = -1;
  }

  /**
   * 댓글 삭제 메소드
   * @param {number} commentID
   * @return {undefined}
   */
  activityEditDelete(commentID: number) {
    this.cardService.card.comments = this.cardService.card.comments.filter(v => v.id !== commentID);
  }
}
