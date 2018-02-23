import { Component, OnInit } from '@angular/core';
import { UserInvitation } from './user.model';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-user-invite',
  templateUrl: './user-invite.component.html',
  styleUrls: ['./user-invite.component.scss']
})
export class UserInviteComponent implements OnInit {

  user: UserInvitation;
  form: FormGroup;
  error: string;

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<UserInviteComponent>,
    private auth: AuthService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.user = new UserInvitation();
    this.form = new FormGroup({
      nickname: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      email: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.email]),
    });
  }

  invite() {
    this.auth.post("user/invite", this.user, 'text').subscribe(
      response => {
        this.dialogRef.close();
      },
      error => {
        if (error.status == 400) {
          this.error = error.error;
          this.form.get('email').setErrors(['']);
        }
      });
  }
}