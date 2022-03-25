import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SqliteService } from './services/sqlite.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private readonly sqlite: SqliteService,
    private readonly platform: Platform
  ) {
    this.platform.ready().then(async () => {
      console.log('platform ready');
      this.sqlite.init();
    });
  }
}
