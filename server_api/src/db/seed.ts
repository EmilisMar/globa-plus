
import 'dotenv/config'
import { db } from '../providers/drizzle.provider'; // Adjust the import if needed
import { USERS_DATA, USERS_ADMIN_DATA } from './data/users.data';
import { UsersTable, UsersAdminsTable } from './tables/users.table'; // Adjust the import to match your table definitions

async function seedDatabase() {
    try {
        // Inserting User data
        for (const user of USERS_DATA) {
            await db.insert(UsersTable).values(user).execute();
        }

        // Inserting User Admin data
        for (const admin of USERS_ADMIN_DATA) {
            await db.insert(UsersAdminsTable).values(admin).execute();
        }

        console.log('Seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

// Execute the seeding function
seedDatabase();
