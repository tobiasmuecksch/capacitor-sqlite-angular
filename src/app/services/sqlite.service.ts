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
    // Create a connection
    this.serviceConnection = new SQLiteConnection(CapacitorSQLite);

    // Do web related init stuff
    if (Capacitor.getPlatform() === 'web') {
      this.initWeb();
    }
  }

  /**
   * Does some stuff, which is necessary for the web platform
   */
  async initWeb() {
    await customElements.whenDefined('jeep-sqlite');

    const jeepSqliteEl = document.querySelector('jeep-sqlite');

    if (jeepSqliteEl !== null) {
      await this.serviceConnection.initWebStore();
    } else {
      console.error('Cannot init web. Cannot find "jeepSqliteEl" element in dom.');
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

  async openDB(databasename: string): Promise<boolean> {
    try {
      // connectionConsistency: mindestens eine Verbindung ist offen
      const connectionConsistency = (await this.serviceConnection.checkConnectionsConsistency()).result;
      const connectionToDatabaseAlreadyOpen = (await this.serviceConnection.isConnection(databasename)).result;

      if (connectionConsistency && connectionToDatabaseAlreadyOpen) {
        this.dbConnection = await this.serviceConnection.retrieveConnection(databasename);
      } else {
        this.dbConnection = await this.serviceConnection
          .createConnection(databasename, false, 'no-encryption', 1);
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
      const isOpen = await this.openDB('product-db');
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

    const db: SQLiteDBConnection = await sqlite.createConnection(database, encrypted, mode, version);
    if (db != null) {
      return Promise.resolve(db);
    } else {
      return Promise.reject(new Error(`no db returned is null`));
    }
  }
}


