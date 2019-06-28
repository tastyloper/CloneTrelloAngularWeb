import { Component, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-content',
  templateUrl: './dialog-content.component.html',
  styleUrls: ['./dialog-content.component.css']
})
export class DialogContentComponent {
  updateData = {};
  updateData2 = {};
  onAdd = new EventEmitter();
  changeCardContent = new EventEmitter();

  descriptionState = true;
  valueTrue = false;
  flag = 0;

  constructor(
    public dialogRef: MatDialogRef<DialogContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // sendData(
  //   cardContent: HTMLInputElement,
  //   inputComment: HTMLInputElement,
  //   cardId,
  //   wholeItem,
  //   TodoID,
  //   titleInput
  // ) {
  //   console.log(inputComment.value);
  //   this.updateData = {
  //     cardContent: cardContent.value,
  //     commentContent: inputComment.value,
  //     cardId: cardId.innerHTML,
  //     Item: wholeItem,
  //     TodosID: TodoID,
  //     title: titleInput.value
  //   };
  //   this.onAdd.emit(this.updateData);
  // }

  changeDescriptionState() {
    setTimeout(() => {
      this.descriptionState
        ? (this.descriptionState = false)
        : (this.descriptionState = true);
    }, 100);
  }

  changeContent(descriptionInput, cardID, wholeItem, TodoID) {
    this.updateData2 = {
      descriptionInput: descriptionInput.value,
      cardId: cardID,
      Item: wholeItem,
      TodosID: TodoID
    };
    console.log(this.updateData2);
    this.changeCardContent.emit(this.updateData2);
  }

  typing(inputComment) {
    inputComment.value ? (this.valueTrue = true) : (this.valueTrue = false);
  }

  titleResize(textarea: HTMLTextAreaElement) {
    textarea.style.height = '1px';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  clickDescriptionBtn() {
    console.log(1);
  }
}
