import { WorkloadIdentityCredential } from "@azure/identity";
import fs from 'fs/promises';
import sql from 'mssql';
import { faker } from '@faker-js/faker';
import { exec } from 'child_process';
import { promisify } from 'util';

// Load from env
const server = process.env.DB_SERVER;
const database = process.env.DB_NAME;
const tenantId = process.env.AZURE_TENANT_ID;
const clientId = process.env.AZURE_CLIENT_ID;
const federatedTokenPath = process.env.FEDERATED_TOKEN_FILE || '/var/run/secrets/azure/tokens/azure-identity-token';

if (!server || !database || !tenantId || !clientId) {
  console.error("Missing required environment variables. Check DB_SERVER, DB_NAME, AZURE_TENANT_ID, AZURE_CLIENT_ID.");
  process.exit(1);
}

const execAsync = promisify(exec);

async function getToken() {
  try {
    const { stdout } = await execAsync(
      `az account get-access-token --resource https://database.windows.net/ --query accessToken -o tsv`
    );

    const token = stdout.trim();

    if (!token || typeof token !== 'string') {
      console.error("Access token is missing or not a string");
      process.exit(1);
    }

    return token;
  } catch (err) {
    console.error("Failed to retrieve token:", err);
    process.exit(1);
  }
}


// Create SQL connection config
async function getSqlConfig() {
  const token = await getToken();

  return {
    server,
    database,
    authentication: {
      type: 'azure-active-directory-access-token'
    },
    options: {
      encrypt: true,
      accessToken: token,
      trustServerCertificate: true
    }
  };
}

// Create table if it doesn't exist
async function createTable(pool) {
  const query = `
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='FakeUsers' AND xtype='U')
    CREATE TABLE FakeUsers (
        id INT IDENTITY(1,1) PRIMARY KEY,
        fullName NVARCHAR(255),
        firstName NVARCHAR(255),
        lastName NVARCHAR(255),
        phoneNumber NVARCHAR(50),
        email NVARCHAR(255),
        streetAddress NVARCHAR(255),
        city NVARCHAR(255),
        state NVARCHAR(255),
        zip NVARCHAR(50),
        companyName NVARCHAR(255)
    );
  `;
  await pool.request().query(query);
  console.log("Ensured 'FakeUsers' table exists.");
}

// Create fake data
function generateFakeData() {
  return {
    fullName: faker.person.fullName(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    phoneNumber: faker.phone.number(),
    email: faker.internet.email(),
    streetAddress: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    zip: faker.location.zipCode(),
    companyName: faker.company.name()
  };
}

// Main logic
async function insertData() {
  try {
    const config = await getSqlConfig();
    const pool = await sql.connect(config);

    await createTable(pool);

    for (let i = 0; i < 1000; i++) {
      const data = generateFakeData();

      await pool.request()
        .input('fullName', sql.NVarChar, data.fullName)
        .input('firstName', sql.NVarChar, data.firstName)
        .input('lastName', sql.NVarChar, data.lastName)
        .input('phoneNumber', sql.NVarChar, data.phoneNumber)
        .input('email', sql.NVarChar, data.email)
        .input('streetAddress', sql.NVarChar, data.streetAddress)
        .input('city', sql.NVarChar, data.city)
        .input('state', sql.NVarChar, data.state)
        .input('zip', sql.NVarChar, data.zip)
        .input('companyName', sql.NVarChar, data.companyName)
        .query(`
          INSERT INTO FakeUsers (fullName, firstName, lastName, phoneNumber, email, streetAddress, city, state, zip, companyName)
          VALUES (@fullName, @firstName, @lastName, @phoneNumber, @email, @streetAddress, @city, @state, @zip, @companyName)
        `);

      console.log(`Inserted record ${i + 1}`);
    }

    console.log("Data insertion completed.");
    await pool.close();
  } catch (err) {
    console.error("Error inserting data:", err);
    process.exit(1);
  }
}

insertData();
