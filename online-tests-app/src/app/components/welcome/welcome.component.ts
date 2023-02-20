import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})
export class WelcomeComponent implements OnInit {
  // Name input from the user.
  @ViewChild('name') nameKey!: ElementRef;
  constructor() {}

  ngOnInit(): void {}
  startTests() {
    localStorage.setItem('name', this.nameKey.nativeElement.value);
  }
}
