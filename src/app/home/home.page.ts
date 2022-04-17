import { Component } from '@angular/core';
import { SqliteService } from '../services/sqlite.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private sqlite: SqliteService
  ) { }

  initDB() {
    console.log('INIT', this.sqlite);
    this.sqlite.initProductsDatabase();
  }

  printDbList() {
    this.sqlite.printAllDbs();
  }

  printQuery() {
    this.sqlite.printQuery();
  }

  export() {
    this.sqlite.printExport();
  }

  printAllDbs() {
    this.sqlite.printAllDbs();
  }

  dropDatabase() {
    this.sqlite.dropDatabase();
  }

  addDataToTestDB() {
    this.sqlite.addDataToTestDB();
  }

  testRegularTableCreation() {
    this.sqlite.testRegularTableCreation();
  }

  printRegularCreatedTableQuery() {
    this.sqlite.printRegularCreatedTableQuery();
  }
}
