import { Component } from '@angular/core';
import { UpdateService } from './desktop/update.service';
import { version } from 'package.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public appVersion: typeof version = version;

  constructor(private updateService: UpdateService) {
    try {
      const methodName = 'constructor()';
      console.log(methodName);
    } catch (error) {
      console.error(error);
    }
  }

  public applicationUpdate(): void {
    try {
      const methodName = 'applicationUpdate()';
      console.log(methodName);

      this.updateService.applicationUpdate();
    } catch (error) {
      console.error(error);
    }
  }

}
