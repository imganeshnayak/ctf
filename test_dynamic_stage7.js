import { generateDynamicStage7 } from './backend/utils/stage7Generator.js';

// Test with different user IDs
const testUserIds = [
    '507f1f77bcf86cd799439011',
    '507f1f77bcf86cd799439012',
    '507f1f77bcf86cd799439013'
];

console.log('='.repeat(70));
console.log('  TESTING DYNAMIC STAGE 7 GENERATION');
console.log('='.repeat(70));
console.log();

testUserIds.forEach((userId, index) => {
    console.log(`\nUser ${index + 1} (ID: ${userId}):`);
    console.log('-'.repeat(70));

    const content = generateDynamicStage7(userId);

    // Extract key information from the HTML
    const hashMatch = content.match(/Encoded Hash \((.*?)\):/);
    const valueMatch = content.match(/<code[^>]*>(.*?)<\/code>/s);

    if (hashMatch && valueMatch) {
        const format = hashMatch[1];
        const value = valueMatch[1].trim();

        console.log(`Encoding Format: ${format}`);
        console.log(`Encoded Value: ${value.substring(0, 50)}${value.length > 50 ? '...' : ''}`);

        // Check algorithm order
        const algoMatches = content.match(/Algorithm #\d+: (\w+)/g);
        if (algoMatches) {
            console.log(`Algorithm Order: ${algoMatches.map(m => m.split(': ')[1]).join(', ')}`);
        }
    }
});

console.log();
console.log('='.repeat(70));
console.log('  Each user gets a unique challenge!');
console.log('  - Different encoding format (hex/binary/decimal)');
console.log('  - Shuffled algorithm order');
console.log('  - Same correct answer: HASH_MASTER');
console.log('='.repeat(70));
