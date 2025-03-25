import { DefaultAzureCredential } from '@azure/identity';
import sql from 'mssql';
import { faker } from '@faker-js/faker';

// Required Environment Variables
const server = process.env.DB_SERVER;
const database = process.env.DB_NAME;

if (!server || !database) {
  console.error("Missing required environment variables: DB_SERVER or DB_NAME");
  process.exit(1);
}

// Get an access token from Azure AD for Azure SQL
async function getToken() {
  const credential = new DefaultAzureCredential();
  const tokenResponse = await credential.getToken("https://database.windows.net/");
  return tokenResponse.token;
}

// SQL Connection Config
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
      accessToken: token
    }
  };
}

// Ensure table exists
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

// Insert fake data
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

// Main
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
