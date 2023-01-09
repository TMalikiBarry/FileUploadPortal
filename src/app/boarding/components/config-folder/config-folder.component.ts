import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../../core/services/userService/user.service";
import {UserInterface} from "../../../core/models/user.interface";
import {map, tap} from "rxjs";

@Component({
  selector: 'app-config-folder',
  templateUrl: './config-folder.component.html',
  styleUrls: ['./config-folder.component.scss']
})
export class ConfigFolderComponent implements OnInit {

  currentAgent!: UserInterface;
  idAgent!: number;

  constructor(private route: ActivatedRoute, private userService: UserService) {
  }

  ngOnInit(): void {
    try {
      this.idAgent = +this.route.snapshot.params["id"];
    } catch ({message}) {
      console.log(message);
    }
    if (this.idAgent) {
      this.userService.getUser(this.idAgent).pipe(
        map(response => <UserInterface>response.data),
        tap(response => {
          this.currentAgent = response;
          this.userService.saveInLocal('agent', JSON.stringify(response));
        }),
      ).subscribe();
    }
    if (!this.currentAgent) {
      this.currentAgent = JSON.parse(this.userService.getLocalValue('agent'));
    }
  }

  getEvent(event: MouseEvent) {
  }

  onUpload(fileType: 'cni' | 'geoloc' | 'honneur' | 'connaissance' | 'CGU' | 'residence') {
    document.getElementById('file_cni')!.click();
    switch (fileType) {
      case "cni":
        break;
      case "geoloc":
        break;
      case "honneur":
        break;
      case "connaissance":
        break;
      case "CGU":
        break;
      case "residence":
        break;
    }
  }


}
