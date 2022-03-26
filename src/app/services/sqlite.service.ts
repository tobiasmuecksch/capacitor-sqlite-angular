import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { productSchemaJson } from '../sqldata/product.sql';

@Injectable({
  providedIn: 'root'
})
export class SqliteService {

  serviceConnection?: SQLiteConnection;
  dbConnection?: SQLiteDBConnection;

  constructor() { }


  async init() {
    console.log('Creating Connection', `Platform is: ${Capacitor.getPlatform()}`);
    // Create a connection
    this.serviceConnection = new SQLiteConnection(CapacitorSQLite);

    console.log('Connection is', this.serviceConnection);

    if (Capacitor.getPlatform() === 'web') {
      await customElements.whenDefined('jeep-sqlite');

      const jeepSqliteEl = document.querySelector('jeep-sqlite');
      if (jeepSqliteEl != null) {
        await this.initWebStore();
        console.log(`isStoreOpen ${await jeepSqliteEl.isStoreOpen()}`);
        console.log(`$$ jeepSqliteEl is defined`);
      } else {
        console.log('$$ jeepSqliteEl is null');
      }
    }
  }
  async initDB() {
    try {
      const result = (await CapacitorSQLite.isJsonValid({ jsonstring: productSchemaJson })).result;
      if (result) {
        const ret = await this.serviceConnection.importFromJson(productSchemaJson);
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
  async openDB(): Promise<boolean> {
    try {
      const retCC = (await this.serviceConnection.checkConnectionsConsistency()).result;
      const isConn = (await this.serviceConnection.isConnection('product-db')).result;
      if (retCC && isConn) {
        this.dbConnection = await this.serviceConnection.retrieveConnection('product-db');
      } else {
        this.dbConnection = await this.serviceConnection
          .createConnection('product-db', false, 'no-encryption', 1);
      }
      await this.dbConnection.open();
      return true;
    } catch (err) {
      console.log(`openDB: ${err}`);
      return false;
    }

  }

  async printAllDbs() {
    console.log('DB LIST', (await this.serviceConnection.getDatabaseList()).values);
  }

  async printQuery() {
    try {
      const isOpen = await this.openDB();
      if (isOpen) {
        const statement = 'SELECT * FROM products;';
        const values = [];
        const result = await this.dbConnection.query(statement, values);
        console.log('result', result.values);
      }

    } catch (err) {
      console.log(`printQuery: ${err}`);
    }

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

  async initWebStore() {

    return this.serviceConnection.initWebStore();
  }

  getConnection(): SQLiteConnection {
    if (!this.serviceConnection) {
      throw new Error('SQLite Verbindung steht nicht zur Verfügung.');
    }

    return this.serviceConnection;
  }

  async createConnection(
    database: string,
    encrypted: boolean,
    mode: string,
    version: number
  ): Promise<SQLiteDBConnection> {
    const sqlite = this.getConnection();

    const db: SQLiteDBConnection = await sqlite.createConnection(
      database, encrypted, mode, version);
    if (db != null) {
      return Promise.resolve(db);
    } else {
      return Promise.reject(new Error(`no db returned is null`));
    }
  }
}


