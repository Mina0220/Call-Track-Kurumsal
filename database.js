import pg from 'pg';
const { Pool } = pg;

// PostgreSQL bağlantısı
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Database tabloları oluştur
async function initDatabase() {
  const client = await pool.connect();
  try {
    // Calls tablosu
    await client.query(`
      CREATE TABLE IF NOT EXISTS calls (
        id BIGINT PRIMARY KEY,
        created_at TIMESTAMP,
        caller VARCHAR(255),
        company_name VARCHAR(500),
        contact_person VARCHAR(255),
        contact_title VARCHAR(255),
        contact_phone VARCHAR(50),
        new_contact_phone VARCHAR(50),
        industry VARCHAR(255),
        city VARCHAR(255),
        district VARCHAR(255),
        address_detail TEXT,
        call_date DATE,
        call_time TIME,
        result VARCHAR(255),
        notes TEXT,
        is_favorite BOOLEAN DEFAULT FALSE
      )
    `);

    // Tasks tablosu
    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id VARCHAR(255) PRIMARY KEY,
        person VARCHAR(255),
        date DATE,
        start_time TIME,
        end_time TIME,
        task_type VARCHAR(255),
        description TEXT,
        status VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Performance indexleri oluştur
    // Calls tablosu için indexler
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_calls_created_at ON calls(created_at DESC);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_calls_caller ON calls(caller);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_calls_result ON calls(result);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_calls_city ON calls(city);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_calls_industry ON calls(industry);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_calls_call_date ON calls(call_date DESC);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_calls_is_favorite ON calls(is_favorite);
    `);

    // Tasks tablosu için indexler
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_tasks_date ON tasks(date DESC);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_tasks_person ON tasks(person);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_tasks_date_time ON tasks(date DESC, start_time DESC);
    `);

    console.log('✅ Database tables and indexes initialized');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  } finally {
    client.release();
  }
}

// Tüm calls'ları getir
async function getAllCalls() {
  try {
    const result = await pool.query('SELECT * FROM calls ORDER BY created_at DESC');
    return result.rows.map(row => ({
      id: row.id,
      createdAt: row.created_at,
      caller: row.caller,
      companyName: row.company_name,
      contactPerson: row.contact_person,
      contactTitle: row.contact_title,
      contactPhone: row.contact_phone,
      newContactPhone: row.new_contact_phone,
      industry: row.industry,
      city: row.city,
      district: row.district,
      addressDetail: row.address_detail,
      callDate: row.call_date,
      callTime: row.call_time,
      result: row.result,
      notes: row.notes,
      isFavorite: row.is_favorite
    }));
  } catch (error) {
    console.error('Error getting calls:', error);
    return [];
  }
}

// Calls'ları güncelle (UPSERT kullanarak - daha performanslı ve güvenli)
async function updateCalls(calls) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Önce mevcut ID'leri al
    const existingIds = calls.map(c => c.id);

    // Listede olmayan kayıtları sil
    if (existingIds.length > 0) {
      await client.query('DELETE FROM calls WHERE id NOT IN (' + existingIds.map((_, i) => `$${i + 1}`).join(',') + ')', existingIds);
    } else {
      await client.query('DELETE FROM calls');
    }

    // Her kaydı UPSERT ile ekle/güncelle
    for (const call of calls) {
      await client.query(`
        INSERT INTO calls (
          id, created_at, caller, company_name, contact_person, contact_title,
          contact_phone, new_contact_phone, industry, city, district, address_detail,
          call_date, call_time, result, notes, is_favorite
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        ON CONFLICT (id) DO UPDATE SET
          created_at = EXCLUDED.created_at,
          caller = EXCLUDED.caller,
          company_name = EXCLUDED.company_name,
          contact_person = EXCLUDED.contact_person,
          contact_title = EXCLUDED.contact_title,
          contact_phone = EXCLUDED.contact_phone,
          new_contact_phone = EXCLUDED.new_contact_phone,
          industry = EXCLUDED.industry,
          city = EXCLUDED.city,
          district = EXCLUDED.district,
          address_detail = EXCLUDED.address_detail,
          call_date = EXCLUDED.call_date,
          call_time = EXCLUDED.call_time,
          result = EXCLUDED.result,
          notes = EXCLUDED.notes,
          is_favorite = EXCLUDED.is_favorite
      `, [
        call.id,
        call.createdAt,
        call.caller,
        call.companyName,
        call.contactPerson,
        call.contactTitle,
        call.contactPhone,
        call.newContactPhone,
        call.industry,
        call.city,
        call.district,
        call.addressDetail,
        call.callDate,
        call.callTime,
        call.result,
        call.notes,
        call.isFavorite || false
      ]);
    }

    await client.query('COMMIT');
    console.log(`✅ Upserted ${calls.length} calls`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating calls:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Tüm tasks'ları getir
async function getAllTasks() {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY date DESC, start_time DESC');
    return result.rows.map(row => ({
      id: row.id,
      person: row.person,
      date: row.date,
      startTime: row.start_time,
      endTime: row.end_time,
      taskType: row.task_type,
      description: row.description,
      status: row.status
    }));
  } catch (error) {
    console.error('Error getting tasks:', error);
    return [];
  }
}

// Tasks'ları güncelle (UPSERT kullanarak - daha performanslı ve güvenli)
async function updateTasks(tasks) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Önce mevcut ID'leri al
    const existingIds = tasks.map(t => t.id);

    // Listede olmayan kayıtları sil
    if (existingIds.length > 0) {
      await client.query('DELETE FROM tasks WHERE id NOT IN (' + existingIds.map((_, i) => `$${i + 1}`).join(',') + ')', existingIds);
    } else {
      await client.query('DELETE FROM tasks');
    }

    // Her kaydı UPSERT ile ekle/güncelle
    for (const task of tasks) {
      await client.query(`
        INSERT INTO tasks (
          id, person, date, start_time, end_time, task_type, description, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO UPDATE SET
          person = EXCLUDED.person,
          date = EXCLUDED.date,
          start_time = EXCLUDED.start_time,
          end_time = EXCLUDED.end_time,
          task_type = EXCLUDED.task_type,
          description = EXCLUDED.description,
          status = EXCLUDED.status
      `, [
        task.id,
        task.person,
        task.date,
        task.startTime,
        task.endTime,
        task.taskType,
        task.description,
        task.status
      ]);
    }

    await client.query('COMMIT');
    console.log(`✅ Upserted ${tasks.length} tasks`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating tasks:', error);
    throw error;
  } finally {
    client.release();
  }
}

export {
  pool,
  initDatabase,
  getAllCalls,
  updateCalls,
  getAllTasks,
  updateTasks
};
