import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { CommentsService } from 'src/app/services/comments.service';

@Component({
  selector: 'app-input-comment',
  templateUrl: './input-comment.component.html',
  styleUrls: ['./input-comment.component.scss'],
})
export class InputCommentComponent implements OnInit {
  @Input() routeId: string;
  commentForm: FormGroup;

  constructor(
    private comment: CommentsService,
    private formBuilder: FormBuilder,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.commentForm = this.formBuilder.group({
      comment: [''],
    });
  }

  async onSubmit() {
    const { comment } = this.commentForm.value;
    const authorId = await this.auth.getProfileId();
    const authorNick = await this.auth.getUserById(authorId);
    // this.comment.addComment(this.routeId, comment, authorId, authorNick);
    console.log(this.routeId, comment, authorId, authorNick);
    this.comment
      .addComment(this.routeId, comment, authorId, authorNick)
      .subscribe((data) => {
        console.log(data);
      });
    this.commentForm.reset();
  }
}
