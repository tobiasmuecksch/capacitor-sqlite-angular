import { Component } from '@angular/core';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  // NICHT LÖSCHEN!!!!
  enableJeepSQL: boolean = Capacitor.getPlatform() === 'web';

  constructor() { }
}
