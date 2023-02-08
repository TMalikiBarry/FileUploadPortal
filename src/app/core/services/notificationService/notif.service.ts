import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class NotifService {

  private config: MatSnackBarConfig = {
    horizontalPosition: 'center',
    verticalPosition: 'top'
  };

  constructor(private snackBar: MatSnackBar) {
  }

  snackMessage(msg: string, duration: number, type: 'success' | 'warning' | 'danger'): void {
    let cssStyle = type === 'success' ? 'snack-success' : (type === 'warning' ? 'snack-warn' : 'snack-danger');
    this.config['panelClass'] = ['notification', cssStyle];
    this.config['duration'] = duration;
    this.snackBar.open(msg, '', this.config);
  }

}
