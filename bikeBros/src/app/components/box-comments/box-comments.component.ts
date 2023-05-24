import { Component, Input, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Comment } from 'src/app/interfaces/comment.interface';
import { AuthService } from 'src/app/services/auth.service';
import { CommentsService } from 'src/app/services/comments.service';

@Component({
  selector: 'app-box-comments',
  templateUrl: './box-comments.component.html',
  styleUrls: ['./box-comments.component.scss'],
})
export class BoxCommentsComponent implements OnInit {
  @Input() routeId: string;
  comments: Comment[] = [];
  authorNicks: { [authorId: string]: string } = {};
  subscription: Subscription;

  constructor(
    private commentServ: CommentsService,
    private auth: AuthService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    // this.obtenerNicksAutores();
    this.getComments();
    this.subscription = this.commentServ.refresh$.subscribe(() => {
      this.getComments();
    });
  }

  getComments() {
    // console.log(this.routeId);
    this.commentServ.getRouteComments(this.routeId).subscribe((data: any) => {
      this.comments = data.comments;
      console.log(data.comments);
    });
  }

  // obtenerNicksAutores() {
  //   this.comments.forEach((comment) => {
  //     this.auth
  //       .getUserById(comment.authorId)
  //       .then((user) => {
  //         this.authorNicks[comment.authorId] = user.nick; // Almacena el nick del autor en el objeto authorNicks
  //       })
  //       .catch((error) => {
  //         console.log('Error al obtener el nick del autor:', error);
  //       });
  //   });
  // }

  // async getAuthorNick(authorId: string) {
  //   // Recupera el nick del autor utilizando el servicio de usuarios
  //   const user = await this.auth.getUserById(authorId);
  //   return user;
  // }
  getAuthorNick(authorId: string): string {
    return this.authorNicks[authorId] || ''; // Devuelve el nick del autor desde el objeto authorNicks
  }

  async deleteComment(id: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este comentario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.commentServ
              .deleteCommentById(this.routeId, id)
              .subscribe(async (data: any) => {
                const successAlert = await this.alertController.create({
                  header: 'Comentario',
                  message: 'Comentario eliminado exitosamente',
                  buttons: ['Aceptar'],
                });

                await successAlert.present();

                console.log(data);
              });
          },
        },
      ],
    });

    await alert.present();
  }
}
