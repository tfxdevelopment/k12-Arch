/**
 * Repository Pattern Example
 * Demonstrates using Repository pattern with User management
 */

const UserRepository = require('./repositories/UserRepository');
const UserService = require('./services/UserService');

async function main() {
  console.log('=== Repository Pattern Example ===\n');

  // Initialize repository and service
  const userRepository = new UserRepository();
  const userService = new UserService(userRepository);

  try {
    // 1. Create users
    console.log('1. Creating users...');
    const user1 = await userService.createUser('John Doe', 'john@example.com');
    const user2 = await userService.createUser('Jane Smith', 'jane@example.com');
    const user3 = await userService.createUser('Bob Johnson', 'bob@example.com');
    console.log(`   Created ${user1.name} (${user1.id})`);
    console.log(`   Created ${user2.name} (${user2.id})`);
    console.log(`   Created ${user3.name} (${user3.id})`);

    // 2. Get user by ID
    console.log('\n2. Getting user by ID...');
    const fetchedUser = await userService.getUserById(user1.id);
    console.log(`   Found: ${fetchedUser.name} - ${fetchedUser.email}`);

    // 3. Get user by email
    console.log('\n3. Getting user by email...');
    const userByEmail = await userService.getUserByEmail('jane@example.com');
    console.log(`   Found: ${userByEmail.name} (${userByEmail.id})`);

    // 4. Update user
    console.log('\n4. Updating user...');
    const updatedUser = await userService.updateUser(user2.id, 'Jane Doe', 'jane.doe@example.com');
    console.log(`   Updated: ${updatedUser.name} - ${updatedUser.email}`);

    // 5. Deactivate user
    console.log('\n5. Deactivating user...');
    await userService.deactivateUser(user3.id);
    const deactivatedUser = await userService.getUserById(user3.id);
    console.log(`   ${deactivatedUser.name} is active: ${deactivatedUser.isActive}`);

    // 6. Get all active users
    console.log('\n6. Getting all active users...');
    const activeUsers = await userService.getActiveUsers();
    console.log(`   Active users: ${activeUsers.length}`);
    activeUsers.forEach(u => console.log(`   - ${u.name} (${u.email})`));

    // 7. Get user statistics
    console.log('\n7. User statistics...');
    const stats = await userService.getUserStats();
    console.log(`   Total users: ${stats.total}`);
    console.log(`   Active users: ${stats.active}`);
    console.log(`   Inactive users: ${stats.inactive}`);

    // 8. Pagination example
    console.log('\n8. Pagination example...');
    const page1 = await userService.getAllUsers(1, 2);
    console.log(`   Page ${page1.page}/${page1.totalPages} (showing ${page1.users.length} of ${page1.totalCount})`);
    page1.users.forEach(u => console.log(`   - ${u.name}`));

    // 9. Try to create duplicate user (should fail)
    console.log('\n9. Attempting to create duplicate user...');
    try {
      await userService.createUser('Duplicate', 'john@example.com');
    } catch (error) {
      console.log(`   Error (expected): ${error.message}`);
    }

    // 10. Delete user
    console.log('\n10. Deleting user...');
    await userService.deleteUser(user3.id);
    console.log(`   Deleted user ${user3.id}`);
    
    const finalStats = await userService.getUserStats();
    console.log(`   Remaining users: ${finalStats.total}`);

    console.log('\n=== Example completed successfully! ===');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the example
main().catch(console.error);
