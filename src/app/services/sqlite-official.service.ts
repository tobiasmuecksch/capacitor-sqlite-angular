import { Injectable } from '@angular/core';
import { CapacitorSQLite, capEchoResult, capNCDatabasePathResult, capSQLiteChanges, capSQLiteResult, capSQLiteSet, capSQLiteValues, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class SqliteOfficialService {

  native: boolean = false;
  sqlite?: SQLiteConnection;
  platform: string;

  constructor() {
  }
  /**
   * Plugin Initialization
   */
  init() {
    this.platform = Capacitor.getPlatform();
    this.native = this.isNative();

    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  private isNative() {
    return this.platform === 'ios' || this.platform === 'android'
  }

  /**
   * Echo a value
   * @param value 
   */
  async echo(value: string): Promise<capEchoResult> {
    const sqlite = this.getSQLite();

    return sqlite.echo(value);
  }

  async isSecretStored(): Promise<capSQLiteResult> {
    if (!this.native) {
      throw new Error(`Not implemented for ${this.platform} platform`);
    }

    const sqlite = this.getSQLite();
    return sqlite.isSecretStored();
  }

  async setEncryptionSecret(passphrase: string): Promise<void> {
    const sqlite = this.getSQLite();
    return sqlite.setEncryptionSecret(passphrase);
  }

  async changeEncryptionSecret(passphrase: string, oldpassphrase: string): Promise<void> {
    if (!this.native) {
      return Promise.reject(new Error(`Not implemented for ${this.platform} platform`));
    }

    const sqlite = this.getSQLite();
    return sqlite.changeEncryptionSecret(passphrase, oldpassphrase);
  }

  /**
   * addUpgradeStatement
   * @param database 
   * @param fromVersion 
   * @param toVersion 
   * @param statement 
   * @param set 
   */
  async addUpgradeStatement(database: string, fromVersion: number,
    toVersion: number, statement: string,
    set?: capSQLiteSet[])
    : Promise<void> {

    const sqlite = this.getSQLite();
    return sqlite.addUpgradeStatement(database, fromVersion, toVersion, statement, set ? set : []);
  }

  /**
   * get a non-conformed database path
   * @param path
   * @param database
   * @returns Promise<capNCDatabasePathResult>
   * @since 3.3.3-1
   */
  async getNCDatabasePath(folderPath: string, database: string): Promise<capNCDatabasePathResult> {
    const sqlite = this.getSQLite();

    return sqlite.getNCDatabasePath(folderPath, database);
  }
  /**
   * Create a non-conformed database connection
   * @param databasePath
   * @param version
   * @returns Promise<SQLiteDBConnection>
   * @since 3.3.3-1
   */
  async createNCConnection(databasePath: string, version: number): Promise<SQLiteDBConnection> {
    const sqlite = this.getSQLite();

    const db: SQLiteDBConnection = await sqlite.createNCConnection(databasePath, version);
    if (db !== null) {
      return db;
    } else {
      throw new Error(`no db returned is null`);
    }
  }
  /**
   * Close a non-conformed database connection
   * @param databasePath
   * @returns Promise<void>
   * @since 3.3.3-1
   */
  async closeNCConnection(databasePath: string): Promise<void> {
    const sqlite = this.getSQLite();
    return sqlite.closeNCConnection(databasePath);
  }

  /**
   * Check if a non-conformed databaseconnection exists
   * @param databasePath
   * @returns Promise<capSQLiteResult>
   * @since 3.3.3-1
   */
  async isNCConnection(databasePath: string): Promise<capSQLiteResult> {
    const sqlite = this.getSQLite();
    return sqlite.isNCConnection(databasePath);
  }

  /**
   * Retrieve a non-conformed database connection
   * @param databasePath
   * @returns Promise<SQLiteDBConnection>
   * @since 3.3.3-1
   */
  async retrieveNCConnection(databasePath: string): Promise<SQLiteDBConnection> {
    const sqlite = this.getSQLite();
    return sqlite.retrieveNCConnection(databasePath);
  }

  /**
   * Check if a non conformed database exists
   * @param databasePath
   * @returns Promise<capSQLiteResult>
   * @since 3.3.3-1
   */
  async isNCDatabase(databasePath: string): Promise<capSQLiteResult> {
    const sqlite = this.getSQLite();
    return sqlite.isNCDatabase(databasePath);
  }

  /**
   * Create a connection to a database
   * @param database 
   * @param encrypted 
   * @param mode 
   * @param version 
   */
  async createConnection(database: string, encrypted: boolean,
    mode: string, version: number
  ): Promise<SQLiteDBConnection> {
    const sqlite = this.getSQLite();

    const db: SQLiteDBConnection = await sqlite.createConnection(database, encrypted, mode, version);

    if (db != null) {
      return db;
    } else {
      throw new Error(`no db returned is null`);
    }
  }

  /**
   * Close a connection to a database
   * @param database 
   */
  async closeConnection(database: string): Promise<void> {
    const sqlite = this.getSQLite();
    return sqlite.closeConnection(database);
  }
  /**
   * 
   * Retrieve an existing connection to a database
   * @param database 
   */
  async retrieveConnection(database: string): Promise<SQLiteDBConnection> {
    const sqlite = this.getSQLite();

    return sqlite.retrieveConnection(database);
  }

  /**
   * Retrieve all existing connections
   */
  async retrieveAllConnections(): Promise<Map<string, SQLiteDBConnection>> {
    const sqlite = this.getSQLite();
    const myConns = await sqlite.retrieveAllConnections();
    /*                let keys = [...myConns.keys()];
                    keys.forEach( (value) => {
                        console.log("Connection: " + value);
                    }); 
    */
    return myConns;
  }

  /**
   * Close all existing connections
   */
  async closeAllConnections(): Promise<void> {
    const sqlite = this.getSQLite();

    return sqlite.closeAllConnections();
  }

  /**
   * Check if connection exists
   * @param database 
   */
  async isConnection(database: string): Promise<capSQLiteResult> {
    const sqlite = this.getSQLite();

    return sqlite.isConnection(database);
  }

  /**
   * Check Connections Consistency
   * @returns 
   */
  async checkConnectionsConsistency(): Promise<capSQLiteResult> {
    const sqlite = this.getSQLite();

    return sqlite.checkConnectionsConsistency();
  }

  /**
   * Check if database exists
   * @param database 
   */
  async isDatabase(database: string): Promise<capSQLiteResult> {
    const sqlite = this.getSQLite();

    return sqlite.isDatabase(database);
  }
  /**
   * Get the list of databases
   */
  async getDatabaseList(): Promise<capSQLiteValues> {
    const sqlite = this.getSQLite();

    return sqlite.getDatabaseList();
  }
  /**
   * Get Migratable databases List
   */
  async getMigratableDbList(folderPath: string): Promise<capSQLiteValues> {
    this.ensureNative();

    const sqlite = this.getSQLite();

    if (!folderPath || folderPath.length === 0) {
      throw (new Error(`You must provide a folder path`));
    }
    return sqlite.getMigratableDbList(folderPath);
  }

  /**
   * Add "SQLite" suffix to old database's names
   */
  async addSQLiteSuffix(folderPath?: string, dbNameList?: string[]): Promise<void> {
    this.ensureNative();

    const sqlite = this.getSQLite();

    const path: string = folderPath ? folderPath : "default";
    const dbList: string[] = dbNameList ? dbNameList : [];
    return sqlite.addSQLiteSuffix(path, dbList);
  }

  /**
   * Delete old databases
   */
  async deleteOldDatabases(folderPath?: string, dbNameList?: string[]): Promise<void> {
    this.ensureNative();

    const sqlite = this.getSQLite();

    const path: string = folderPath ? folderPath : "default";
    const dbList: string[] = dbNameList ? dbNameList : [];
    return sqlite.deleteOldDatabases(path, dbList);
  }

  /**
   * Import from a Json Object
   * @param jsonstring 
   */
  async importFromJson(jsonstring: string): Promise<capSQLiteChanges> {
    const sqlite = this.getSQLite();

    return sqlite.importFromJson(jsonstring);
  }

  /**
   * Is Json Object Valid
   * @param jsonstring Check the validity of a given Json Object
   */

  async isJsonValid(jsonstring: string): Promise<capSQLiteResult> {
    const sqlite = this.getSQLite();

    return sqlite.isJsonValid(jsonstring);
  }

  /**
   * Copy databases from public/assets/databases folder to application databases folder
   */
  async copyFromAssets(overwrite?: boolean): Promise<void> {
    const mOverwrite: boolean = overwrite != null ? overwrite : true;
    console.log(`&&&& mOverwrite ${mOverwrite}`);

    const sqlite = this.getSQLite();

    return sqlite.copyFromAssets(mOverwrite);
  }

  /**
   * Initialize the Web store
   * @param database 
   */
  async initWebStore(): Promise<void> {
    if (this.platform !== 'web') {
      throw new Error(`not implemented for this platform: ${this.platform}`);
    }

    const sqlite = this.getSQLite();

    return sqlite.initWebStore();
  }

  /**
   * Save a database to store
   * @param database 
   */
  async saveToStore(database: string): Promise<void> {
    if (this.platform !== 'web') {
      return Promise.reject(new Error(`not implemented for this platform: ${this.platform}`));
    }

    const sqlite = this.getSQLite();
    return sqlite.saveToStore(database);
  }

  private getSQLite(): SQLiteConnection {
    if (this.sqlite === null) {
      throw new Error(`no connection open`);
    }

    return this.sqlite;
  }

  private ensureNative() {
    if (!this.native) {
      throw new Error(`Not implemented for ${this.platform} platform`);
    }
  }
}
