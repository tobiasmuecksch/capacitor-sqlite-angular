import { Injectable } from '@angular/core';
import { CapacitorSQLite } from '@capacitor-community/sqlite';
import { productSchemaJson } from '../sqldata/product.sql';
import { SqliteOfficialService } from './sqlite-official.service';

const DB_VERSION = 1;

@Injectable({
  providedIn: 'root'
})
export class SqliteService {

  constructor(
    private sqlite: SqliteOfficialService
  ) { }

  async initProductsDatabase() {
    try {
      // Only import the database, if it doesn't exist already
      const dbExists = await this.sqlite.databaseExists('product-db');

      if (dbExists) {
        console.info('The database `product-db` does already exist. Will call importFromJson anyway.');
      }

      // Check if json is Valid
      const jsonIsValid = await this.sqlite.isJsonValid(productSchemaJson);

      if (jsonIsValid) {
        const changes = await this.sqlite.importFromJson(productSchemaJson);
        console.log('JSON IMPORT CHANGES', changes);
      }
    } catch (err) {
      console.error(`initDB: ${err}`);
    }
  }

  async printAllDbs() {
    console.log('DB LIST', (await this.sqlite.getDatabaseList()).values);
    const dbConnection = await this.sqlite.openDB('product-db', DB_VERSION);
    const x = await dbConnection.query(`
      SELECT 
          name
      FROM 
          sqlite_schema
      WHERE 
          type ='table' AND 
          name NOT LIKE 'sqlite_%';
    `);

    console.log('TABLE LIST', x);
  }

  async printQuery() {
    const dbConnection = await this.sqlite.openDB('product-db', DB_VERSION);

    const statement = 'SELECT * FROM products;';
    const values = [];
    const result = await dbConnection.query(statement, values);
    console.log('result', result.values);
  }

  async printExport() {
    const dbConnection = await this.sqlite.openDB('product-db', DB_VERSION);

    const json = await dbConnection.exportToJson('full');

    console.log('JSON', json);
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

  async upgradeDb() {
    console.log('adding upgrade statement');
    const statement = `ALTER TABLE products ADD status TEXT DEFAULT "available"`;
    await this.sqlite.addUpgradeStatement('product-db', 4, 5, statement);
  }

  async dropDatabase() {
    await this.sqlite.dropDatabase('test-db');

    console.log('DATABASE DROPPED');
  }

  async testRegularTableCreation() {
    console.log('testRegularTableCreation');
    const dbConnection = await this.sqlite.openDB('test-db');
    console.log('TEST-DB CONNECTION', dbConnection);

    const query = `
    CREATE TABLE IF NOT EXISTS test (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL
    );
    `
    const res = await dbConnection.execute(query);
    console.log('RES', res);
    if (res.changes && res.changes.changes && res.changes.changes < 0) {
      throw new Error(`Error: execute failed`);
    }

    await dbConnection.close();
    //console.log('TABLE LIST', await dbConnection.getTableList())
  }

  async addDataToTestDB() {
    await this.insertData('1f6eb88cc-cf0b-41bb-b55b-52e71269273b1', 'Bob');
    await this.insertData('2f6eb88cc-cf0b-41bb-b55b-52e71269273b2', 'Lina');
    await this.insertData('3f6eb88cc-cf0b-41bb-b55b-52e71269273b3', 'Maria');
  }

  async insertData(id: string, name: string) {
    console.log('INSERTING DATA', id, name);
    const dbConnection = await this.sqlite.openDB('test-db');
    const result = await dbConnection.run('REPLACE INTO test(id, name) VALUES(?,?)', [id, name]);
    console.log('RESULT', result);
    await this.sqlite.saveToStore('test-db');
  }

  async printRegularCreatedTableQuery() {
    const dbConnection = await this.sqlite.openDB('test-db');
    console.log('TABLE LIST', await dbConnection.getTableList())

    const statement = 'SELECT * FROM test;';
    const values = [];
    const result = await dbConnection.query(statement, values);
    console.log('result', result.values);
  }
}


