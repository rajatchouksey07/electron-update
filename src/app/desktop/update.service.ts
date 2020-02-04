import { Injectable } from '@angular/core';
import { ipcRenderer, IpcRendererEvent } from 'electron';

export {};
declare var window: Window;
declare global {
  interface Window {
    process: any;
    require: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  private ipc: typeof ipcRenderer;
  constructor() {
    this.ipc = window.require('electron').ipcRenderer;
   }

  public applicationUpdate(): void {
    try {
      const methodName = 'UpdateService => applicationUpdate()';
      console.log(methodName);

      this.ipc.send('checkforversionupdate');
    } catch (error) {
      console.error(error);
    }
  }

}
