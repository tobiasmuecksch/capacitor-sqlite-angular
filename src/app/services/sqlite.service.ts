import { Injectable } from '@angular/core';
import { CapacitorSQLite } from '@capacitor-community/sqlite';
import { productSchemaJson } from '../sqldata/product.sql';
import { SqliteOfficialService } from './sqlite-official.service';

@Injectable({
  providedIn: 'root'
})
export class SqliteService {

  constructor(
    private sqlite: SqliteOfficialService
  ) { }

  async initDB() {
    try {
      const result = (await CapacitorSQLite.isJsonValid({ jsonstring: productSchemaJson })).result;

      if (result) {
        const ret = await this.sqlite.importFromJson(productSchemaJson);
        if (ret.changes.changes === -1) {
          console.log(`initDB: import Json Object failed`);
        }
      } else {
        console.log(`initDB: Json Object not valid`);
      }
    } catch (err) {
      console.log(`initDB: ${err}`);
    }
  }

  async printAllDbs() {
    console.log('DB LIST', (await this.sqlite.getDatabaseList()).values);
  }

  async printQuery() {
    const dbConnection = await this.sqlite.openDB('product-db');

    const statement = 'SELECT * FROM products;';
    const values = [];
    const result = await dbConnection.query(statement, values);
    console.log('result', result.values);
  }

  async test() {
    try {
      const echoResult = await CapacitorSQLite.echo({ value: 'hello world' });
      console.log('ECHO RESULT', echoResult);
    } catch (err) {
      console.error('SQLite "echo" failed', err);
    }

    try {
      console.log('checking IS VALID');
      const isValid = await CapacitorSQLite.isJsonValid({ jsonstring: productSchemaJson });
      console.log('result', isValid);
    } catch (err) {
      console.error('SQLite "isJsonValid" failed', err);
    }
  }
}


