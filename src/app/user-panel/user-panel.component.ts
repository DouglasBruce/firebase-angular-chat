import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UserPanelComponent implements OnInit {

  @ViewChild('scroll') private scroll: ElementRef;

  constructor() { }

  ngOnInit() {
  }

}
