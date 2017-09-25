import { Component } from '@angular/core';
import { NewMessageService } from '../../providers/NewMessageService';
import { NewMessageModel } from '../../models/newmessageModel';
@Component({
  // selector: 'newmessage',
  templateUrl: './newmessage.html',
  styleUrls: ['../../../../css/weui.min.css', './newmessage.css'],
})
export class NewMessageComponent {
  title: string;
  myHero: string;
  items: NewMessageModel[];

  constructor(private newmessageService: NewMessageService, ) {
     this.newmessageService.getList().then(data => {
     alert(JSON.stringify(data));
      this.items = data.data;
     });
  }
}