import { Component, OnInit, HostListener } from '@angular/core';
import { ImageDeleteComponent } from './image-delete.component';
import { MatDialog } from '@angular/material';
import { AuthService } from '../services/auth.service';
import { ImagePreviewService } from './image-preview.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.scss']
})
export class ImageViewComponent implements OnInit {

  @HostListener('window:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.isImageShown()) {
      if (event.key == "ArrowRight") {
        this.right();
      } else if (event.key == "ArrowLeft") {
        this.left();
      } else if (event.key == "Escape") {
        this.close();
      } else if (event.key == "Delete") {
        this.openDelete();
      }
    }
  }

  loaded = false;
  shown = true;

  constructor(public dialog: MatDialog,
    private imageService: ImagePreviewService,
    private auth: AuthService) { }

  ngOnInit() {
  }

  close() {
    this.shown = false;
    Observable.timer(200).subscribe(() => {
      this.shown = true;
      this.imageService.closeCurrentImage();
    });
  }

  isImageShown() {
    return this.imageService.getCurrentImage() != null;
  }

  getImage() {
    return this.imageService.getCurrentImage().image.replace("/preview", "");
  }

  right() {
    this.imageService.advanceCurrentImage();
    this.setLoaded(false);
  }

  left() {
    this.imageService.previousCurrentImage();
    this.setLoaded(false);
  }

  openDelete(): void {
    let dialogRef = this.dialog.open(ImageDeleteComponent);

    dialogRef.afterClosed().subscribe(response => {
      if (response == "deleted") {
        if (this.imageService.imagePreviews.length == 1) {
          this.shown = false;
          Observable.timer(200).subscribe(() => {
            this.shown = true;
            this.imageService.deleteCurrentImage();
          });
        }
        else {
          this.imageService.deleteCurrentImage();
        }
      }
      else if (response == "error") {
        this.close();
      }
    });
  }

  isMember() {
    return this.auth.isMember();
  }

  canDelete() {
    return this.auth.isMember() && (this.auth.getUser().id == this.imageService.getCurrentImage().authorId || this.auth.isAdmin());
  }

  setLoaded(loaded: boolean) {
    this.loaded = loaded || this.imageService.imagePreviews.length == 1;
  }
}
