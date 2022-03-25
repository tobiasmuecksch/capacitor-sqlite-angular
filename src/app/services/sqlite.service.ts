import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { productSchemaJson } from '../sqldata/product.sql';

@Injectable({
  providedIn: 'root'
})
export class SqliteService {

  connection?: SQLiteConnection;

  constructor() { }

  async init() {
    console.log('Creating Connection');
    this.connection = new SQLiteConnection(CapacitorSQLite);
    console.log('Connection is', this.connection);

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
    if (!this.connection) {
      throw new Error('SQLite Verbindung steht nicht zur Verfügung.');
    }

    return this.connection;
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


