import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input-comment',
  templateUrl: './input-comment.component.html',
  styleUrls: ['./input-comment.component.scss'],
})
export class InputCommentComponent implements OnInit {
  commentForm: FormGroup;
  constructor() {}

  ngOnInit() {
    console.log(
      'El componente InputCommentComponent se ha renderizado correctamente.'
    );
  }

  addComment() {
    console.log('Comentario añadido');
  }
}
