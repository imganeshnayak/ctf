import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from backend root
dotenv.config({ path: resolve(__dirname, '../.env') });

import connectDB from '../config/db.js';
import Stage from '../models/Stage.js';

// MCQ data for all 16 stages
const stageMcqs = [
    {
        stageNumber: 1,
        mcq: {
            question: 'In binary, flipping all bits of a number is known as:',
            options: ['Bit masking', "One's complement", "Two's complement", 'XOR operation'],
            correctIndex: 1
        }
    },
    {
        stageNumber: 2,
        mcq: {
            question: 'The Caesar Cipher used in this stage shifts letters by how many positions?',
            options: ['2', '5', '3', '13'],
            correctIndex: 2
        }
    },
    {
        stageNumber: 3,
        mcq: {
            question: 'A cipher that shifts based on a rotating key sequence is called:',
            options: ['Vigenère cipher', 'ROT13', 'Caesar cipher', 'Atbash cipher'],
            correctIndex: 0
        }
    },
    {
        stageNumber: 4,
        mcq: {
            question: 'Morse code was originally designed for which communication medium?',
            options: ['Radio waves', 'Telephone calls', 'Telegraph machines', 'Semaphore flags'],
            correctIndex: 2
        }
    },
    {
        stageNumber: 5,
        mcq: {
            question: 'Base64 encoding increases the size of data by approximately:',
            options: ['10%', '25%', '33%', '50%'],
            correctIndex: 2
        }
    },
    {
        stageNumber: 6,
        mcq: {
            question: 'A QR code stores data using which encoding?',
            options: ['Hexadecimal only', 'Binary patterns', 'Base64 grids', 'RGB pixels'],
            correctIndex: 1
        }
    },
    {
        stageNumber: 7,
        mcq: {
            question: 'MD5 is considered cryptographically broken primarily because of:',
            options: ['Slow speed', 'Collision vulnerabilities', 'Short key length', 'Reversibility'],
            correctIndex: 1
        }
    },
    {
        stageNumber: 8,
        mcq: {
            question: 'Steganography is the practice of:',
            options: ['Encrypting data strongly', 'Hiding data inside other data', 'Hashing passwords', 'Compressing files'],
            correctIndex: 1
        }
    },
    {
        stageNumber: 9,
        mcq: {
            question: 'In hexadecimal, the value FF equals what decimal number?',
            options: ['240', '255', '256', '128'],
            correctIndex: 1
        }
    },
    {
        stageNumber: 10,
        mcq: {
            question: 'ROT13 is a special case of which cipher?',
            options: ['Vigenère', 'Atbash', 'Caesar', 'Playfair'],
            correctIndex: 2
        }
    },
    {
        stageNumber: 11,
        mcq: {
            question: 'An IP address in IPv4 format uses how many bits?',
            options: ['16', '64', '128', '32'],
            correctIndex: 3
        }
    },
    {
        stageNumber: 12,
        mcq: {
            question: 'In cryptography, a "salt" is used to:',
            options: ['Speed up hashing', 'Prevent rainbow table attacks', 'Encrypt the key', 'Shorten the hash output'],
            correctIndex: 1
        }
    },
    {
        stageNumber: 13,
        mcq: {
            question: 'ASCII stands for:',
            options: [
                'American Standard Code for Information Interchange',
                'Advanced System Code for Internet Interface',
                'Automated Standard Cipher for Information Input',
                'American Signal Code for Integrated Input'
            ],
            correctIndex: 0
        }
    },
    {
        stageNumber: 14,
        mcq: {
            question: 'A brute-force attack tries to crack a password by:',
            options: [
                'Guessing using social engineering',
                'Intercepting network packets',
                'Trying every possible combination',
                'Exploiting software vulnerabilities'
            ],
            correctIndex: 2
        }
    },
    {
        stageNumber: 15,
        mcq: {
            question: 'The browser DevTools console is primarily used by developers to:',
            options: [
                'Design web page layouts',
                'Debug JavaScript and inspect page data',
                'Compress image files',
                'Manage server databases'
            ],
            correctIndex: 1
        }
    },
    {
        stageNumber: 16,
        mcq: {
            question: 'Whitespace steganography hides data using:',
            options: [
                'Invisible characters like spaces and tabs',
                'White-colored text on white background',
                'A special encoding algorithm',
                'Modified file metadata'
            ],
            correctIndex: 0
        }
    }
];

const seedMcqs = async () => {
    try {
        await connectDB();

        for (const item of stageMcqs) {
            const result = await Stage.updateOne(
                { stageNumber: item.stageNumber },
                { $set: { mcq: item.mcq } }
            );
            if (result.modifiedCount > 0) {
                console.log(`✅ Stage ${item.stageNumber}: MCQ added.`);
            } else if (result.matchedCount > 0) {
                console.log(`ℹ️  Stage ${item.stageNumber}: MCQ already set (no change).`);
            } else {
                console.warn(`⚠️  Stage ${item.stageNumber}: Not found in DB. Run seed.js first.`);
            }
        }

        console.log('\nAll stage MCQs seeded successfully!');
    } catch (error) {
        console.error('Error seeding MCQs:', error);
        throw error;
    }
};

export { seedMcqs };

// Run directly when called via `node scripts/seedMcq.js`
const isMain = process.argv[1]?.endsWith('seedMcq.js');
if (isMain) {
    seedMcqs().then(() => process.exit(0)).catch(() => process.exit(1));
}
