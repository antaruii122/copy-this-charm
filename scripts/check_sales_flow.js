import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Checking Environment...');
const envPath = path.resolve(process.cwd(), '.env');
console.log(`  Path: ${envPath}`);
let supabaseUrl = process.env.VITE_SUPABASE_URL;
let supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach((line) => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes
            if (key === 'VITE_SUPABASE_URL') supabaseUrl = value;
            if (key === 'VITE_SUPABASE_ANON_KEY') supabaseKey = value;
        }
    });
}

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase Credentials in .env');
    process.exit(1);
}
console.log('✅ Environment Variables Found');

// 2. Check Critical Files
console.log('\n📂 Checking Critical Files...');
const criticalFiles = [
    'index.html',
    'src/main.tsx',
    'src/App.tsx',
    'src/pages/CourseLandingPage.tsx',
    'src/components/admin/VideoUploadManager.tsx'
];

let filesOk = true;
criticalFiles.forEach(file => {
    if (fs.existsSync(path.resolve(__dirname, '../', file))) {
        console.log(`  ✅ Found ${file}`);
    } else {
        console.error(`  ❌ MISSING ${file}`);
        filesOk = false;
    }
});

// 3. Check Database Connection
console.log('\n🔌 Checking Database Connection...');
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDb() {
    try {
        const { data, error } = await supabase.from('courses').select('count', { count: 'exact', head: true });

        if (error) throw error;

        console.log(`  ✅ Connected to Supabase!`);
        console.log(`  📊 "courses" table is accessible (Status: OK)`);

        // Check if there are active courses
        const { data: courses } = await supabase.from('courses').select('title, slug').limit(3);
        if (courses && courses.length > 0) {
            console.log('  📚 Found Active Courses:');
            courses.forEach(c => console.log(`     - ${c.title} (/cursos/${c.slug})`));
        } else {
            console.warn('  ⚠️ No courses found. Sales flow might look empty!');
        }

    } catch (err) {
        console.error('  ❌ Database Connection Failed:', err.message);
        process.exit(1);
    }
}

checkDb();
