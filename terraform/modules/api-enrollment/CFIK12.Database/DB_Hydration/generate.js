import { faker } from '@faker-js/faker';
import sql from 'mssql';

// Database Configuration
const dbConfig = {
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD, 
    server: process.env.DB_SERVER, 
    database: process.env.DB_NAME, 
    options: {
        encrypt: true, // Required for Azure SQL
        trustServerCertificate: true,
    }
};

// Function to create the table if it does not exist
async function createTable(pool) {
    const createTableQuery = `
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

    try {
        await pool.request().query(createTableQuery);
        console.log("Table 'FakeUsers' ensured.");
    } catch (err) {
        console.error("Error creating table:", err);
    }
}

// Function to generate fake data
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

// Function to insert data into Azure SQL
async function insertDataIntoDB() {
    try {
        let pool = await sql.connect(dbConfig);
        console.log("Connected to database.");

        // Ensure the table exists before inserting data
        await createTable(pool);

        for (let i = 0; i < 1000; i++) {
            let data = generateFakeData();

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

        console.log("Data inserted successfully.");
        await pool.close();
    } catch (err) {
        console.error("Error inserting data:", err);
    }
}

// Run the function
insertDataIntoDB();
