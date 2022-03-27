import { Injectable } from '@angular/core';
import { CapacitorSQLite, capEchoResult, capNCDatabasePathResult, capSQLiteChanges, capSQLiteResult, capSQLiteSet, capSQLiteValues, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class SqliteOfficialService {

  native: boolean = this.isNative();
  sqliteConnection: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);;
  platform = Capacitor.getPlatform();

  constructor() {
    if (this.platform === 'web') {
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
      await this.sqliteConnection.initWebStore();
    } else {
      console.error('Cannot init web. Cannot find "jeepSqliteEl" element in dom.');
    }
  }

  private isNative() {
    return this.platform === 'ios' || this.platform === 'android'
  }

  /**
   * Echo a value
   * @param value 
   */
  async echo(value: string): Promise<capEchoResult> {
    return this.sqliteConnection.echo(value);
  }

  async openDB(databasename: string): Promise<SQLiteDBConnection> {
    // connectionConsistency: mindestens eine Verbindung ist offen
    const connectionConsistency = (await this.sqliteConnection.checkConnectionsConsistency()).result;
    const connectionToDatabaseAlreadyOpen = (await this.sqliteConnection.isConnection(databasename)).result;

    let dbConnection: SQLiteDBConnection;

    if (connectionConsistency && connectionToDatabaseAlreadyOpen) {
      dbConnection = await this.sqliteConnection.retrieveConnection(databasename);
    } else {
      dbConnection = await this.sqliteConnection
        .createConnection(databasename, false, 'no-encryption', 1);
    }
    await dbConnection.open();

    return dbConnection;
  }

  async isSecretStored(): Promise<capSQLiteResult> {
    if (!this.native) {
      throw new Error(`Not implemented for ${this.platform} platform`);
    }

    return this.sqliteConnection.isSecretStored();
  }

  async setEncryptionSecret(passphrase: string): Promise<void> {
    return this.sqliteConnection.setEncryptionSecret(passphrase);
  }

  async changeEncryptionSecret(passphrase: string, oldpassphrase: string): Promise<void> {
    if (!this.native) {
      return Promise.reject(new Error(`Not implemented for ${this.platform} platform`));
    }

    return this.sqliteConnection.changeEncryptionSecret(passphrase, oldpassphrase);
  }

  /**
   * addUpgradeStatement
   * @param database 
   * @param fromVersion 
   * @param toVersion 
   * @param statement 
   * @param set 
   */
  async addUpgradeStatement(
    database: string,
    fromVersion: number,
    toVersion: number,
    statement: string,
    set?: capSQLiteSet[]
  )
    : Promise<void> {
    return this.sqliteConnection.addUpgradeStatement(database, fromVersion, toVersion, statement, set ? set : []);
  }

  /**
   * get a non-conformed database path
   * @param path
   * @param database
   * @returns Promise<capNCDatabasePathResult>
   * @since 3.3.3-1
   */
  async getNCDatabasePath(folderPath: string, database: string): Promise<capNCDatabasePathResult> {
    return this.sqliteConnection.getNCDatabasePath(folderPath, database);
  }
  /**
   * Create a non-conformed database connection
   * @param databasePath
   * @param version
   * @returns Promise<SQLiteDBConnection>
   * @since 3.3.3-1
   */
  async createNCConnection(databasePath: string, version: number): Promise<SQLiteDBConnection> {
    const db: SQLiteDBConnection = await this.sqliteConnection.createNCConnection(databasePath, version);
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
    return this.sqliteConnection.closeNCConnection(databasePath);
  }

  /**
   * Check if a non-conformed databaseconnection exists
   * @param databasePath
   * @returns Promise<capSQLiteResult>
   * @since 3.3.3-1
   */
  async isNCConnection(databasePath: string): Promise<capSQLiteResult> {
    return this.sqliteConnection.isNCConnection(databasePath);
  }

  /**
   * Retrieve a non-conformed database connection
   * @param databasePath
   * @returns Promise<SQLiteDBConnection>
   * @since 3.3.3-1
   */
  async retrieveNCConnection(databasePath: string): Promise<SQLiteDBConnection> {
    return this.sqliteConnection.retrieveNCConnection(databasePath);
  }

  /**
   * Check if a non conformed database exists
   * @param databasePath
   * @returns Promise<capSQLiteResult>
   * @since 3.3.3-1
   */
  async isNCDatabase(databasePath: string): Promise<capSQLiteResult> {
    return this.sqliteConnection.isNCDatabase(databasePath);
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
    const db: SQLiteDBConnection = await this.sqliteConnection.createConnection(database, encrypted, mode, version);

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
    return this.sqliteConnection.closeConnection(database);
  }
  /**
   * 
   * Retrieve an existing connection to a database
   * @param database 
   */
  async retrieveConnection(database: string): Promise<SQLiteDBConnection> {
    return this.sqliteConnection.retrieveConnection(database);
  }

  /**
   * Retrieve all existing connections
   */
  async retrieveAllConnections(): Promise<Map<string, SQLiteDBConnection>> {
    const myConns = await this.sqliteConnection.retrieveAllConnections();
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
    return this.sqliteConnection.closeAllConnections();
  }

  /**
   * Check if connection exists
   * @param database 
   */
  async isConnection(database: string): Promise<capSQLiteResult> {
    return this.sqliteConnection.isConnection(database);
  }

  /**
   * Check Connections Consistency
   * @returns 
   */
  async checkConnectionsConsistency(): Promise<capSQLiteResult> {
    return this.sqliteConnection.checkConnectionsConsistency();
  }

  /**
   * Check if database exists
   * @param database 
   */
  async isDatabase(database: string): Promise<capSQLiteResult> {
    return this.sqliteConnection.isDatabase(database);
  }
  /**
   * Get the list of databases
   */
  async getDatabaseList(): Promise<capSQLiteValues> {
    return this.sqliteConnection.getDatabaseList();
  }
  /**
   * Get Migratable databases List
   */
  async getMigratableDbList(folderPath: string): Promise<capSQLiteValues> {
    this.ensureNative();

    if (!folderPath || folderPath.length === 0) {
      throw (new Error(`You must provide a folder path`));
    }
    return this.sqliteConnection.getMigratableDbList(folderPath);
  }

  /**
   * Add "SQLite" suffix to old database's names
   */
  async addSQLiteSuffix(folderPath?: string, dbNameList?: string[]): Promise<void> {
    this.ensureNative();

    const path: string = folderPath ? folderPath : "default";
    const dbList: string[] = dbNameList ? dbNameList : [];
    return this.sqliteConnection.addSQLiteSuffix(path, dbList);
  }

  /**
   * Delete old databases
   */
  async deleteOldDatabases(folderPath?: string, dbNameList?: string[]): Promise<void> {
    this.ensureNative();

    const path: string = folderPath ? folderPath : "default";
    const dbList: string[] = dbNameList ? dbNameList : [];
    return this.sqliteConnection.deleteOldDatabases(path, dbList);
  }

  /**
   * Import from a Json Object
   * @param jsonstring 
   */
  async importFromJson(jsonstring: string): Promise<capSQLiteChanges> {
    return this.sqliteConnection.importFromJson(jsonstring);
  }

  /**
   * Is Json Object Valid
   * @param jsonstring Check the validity of a given Json Object
   */

  async isJsonValid(jsonstring: string): Promise<capSQLiteResult> {
    return this.sqliteConnection.isJsonValid(jsonstring);
  }

  /**
   * Copy databases from public/assets/databases folder to application databases folder
   */
  async copyFromAssets(overwrite?: boolean): Promise<void> {
    const mOverwrite: boolean = overwrite != null ? overwrite : true;
    console.log(`&&&& mOverwrite ${mOverwrite}`);

    return this.sqliteConnection.copyFromAssets(mOverwrite);
  }

  /**
   * Initialize the Web store
   * @param database 
   */
  async initWebStore(): Promise<void> {
    if (this.platform !== 'web') {
      throw new Error(`not implemented for this platform: ${this.platform}`);
    }

    return this.sqliteConnection.initWebStore();
  }

  /**
   * Save a database to store
   * @param database 
   */
  async saveToStore(database: string): Promise<void> {
    if (this.platform !== 'web') {
      return Promise.reject(new Error(`not implemented for this platform: ${this.platform}`));
    }

    return this.sqliteConnection.saveToStore(database);
  }

  private ensureNative() {
    if (!this.native) {
      throw new Error(`Not implemented for ${this.platform} platform`);
    }
  }
}
