import * as mysql from 'mysql2/promise';

/**
 * Database Client for MySQL/MariaDB
 * Provides methods for database operations in tests
 */
export class DatabaseClient {
  private connection: mysql.Connection | null = null;
  private config: mysql.ConnectionOptions;

  constructor() {
    this.config = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'testdb',
    };
  }

  /**
   * Connect to the database
   */
  async connect(): Promise<void> {
    try {
      this.connection = await mysql.createConnection(this.config);
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }

  /**
   * Disconnect from the database
   */
  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.end();
      console.log('Database disconnected');
    }
  }

  /**
   * Execute a SELECT query
   */
  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    if (!this.connection) {
      throw new Error('Database not connected. Call connect() first.');
    }
    const [rows] = await this.connection.execute(sql, params);
    return rows as T[];
  }

  /**
   * Execute an INSERT, UPDATE, or DELETE query
   */
  async execute(sql: string, params?: any[]): Promise<mysql.ResultSetHeader> {
    if (!this.connection) {
      throw new Error('Database not connected. Call connect() first.');
    }
    const [result] = await this.connection.execute(sql, params);
    return result as mysql.ResultSetHeader;
  }

  /**
   * Get a single row from the database
   */
  async getOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
    const rows = await this.query<T>(sql, params);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Insert a record and return the inserted ID
   */
  async insert(table: string, data: Record<string, any>): Promise<number> {
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);
    
    const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
    const result = await this.execute(sql, values);
    return result.insertId;
  }

  /**
   * Update records
   */
  async update(table: string, data: Record<string, any>, where: string, whereParams?: any[]): Promise<number> {
    const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(data), ...(whereParams || [])];
    
    const sql = `UPDATE ${table} SET ${setClause} WHERE ${where}`;
    const result = await this.execute(sql, values);
    return result.affectedRows;
  }

  /**
   * Delete records
   */
  async delete(table: string, where: string, whereParams?: any[]): Promise<number> {
    const sql = `DELETE FROM ${table} WHERE ${where}`;
    const result = await this.execute(sql, whereParams);
    return result.affectedRows;
  }

  /**
   * Truncate a table (remove all rows)
   */
  async truncate(table: string): Promise<void> {
    await this.execute(`TRUNCATE TABLE ${table}`);
  }

  /**
   * Begin a transaction
   */
  async beginTransaction(): Promise<void> {
    if (!this.connection) {
      throw new Error('Database not connected. Call connect() first.');
    }
    await this.connection.beginTransaction();
  }

  /**
   * Commit a transaction
   */
  async commit(): Promise<void> {
    if (!this.connection) {
      throw new Error('Database not connected. Call connect() first.');
    }
    await this.connection.commit();
  }

  /**
   * Rollback a transaction
   */
  async rollback(): Promise<void> {
    if (!this.connection) {
      throw new Error('Database not connected. Call connect() first.');
    }
    await this.connection.rollback();
  }
}
