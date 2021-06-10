import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() modalConfig: {header: string, body: string} = {header: 'Confirmation Modal', body: 'Are you sure???'};
  @Output() deleteHandler = new EventEmitter<void>();
  hidden = true;
  constructor() { }

  ngOnInit(): void {
  }

  open() {
    this.hidden = false;
  }

  close() {
    this.hidden = true;
  }

  delete() {
    this.close();
    this.deleteHandler.emit();
  }

}
