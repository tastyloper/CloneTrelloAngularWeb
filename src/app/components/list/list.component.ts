import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit() {

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
}
