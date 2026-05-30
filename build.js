const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, 'dist');

console.log('=== Starting FRUTIX Production Build ===');

// 1. Clean and recreate dist directory
if (fs.existsSync(DIST_DIR)) {
    console.log('Cleaning existing dist directory...');
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
}
fs.mkdirSync(DIST_DIR);
console.log('Created clean dist directory.');

// Helper function to recursively copy directories
function copyFolderRecursiveSync(source, target) {
    let files = [];

    // Check if folder needs to be created or exists
    const targetFolder = path.join(target, path.basename(source));
    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder);
    }

    // Copy
    if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source);
        files.forEach(function (file) {
            const curSource = path.join(source, file);
            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, targetFolder);
            } else {
                fs.copyFileSync(curSource, path.join(targetFolder, file));
            }
        });
    }
}

// 2. Copy code files
const filesToCopy = ['index.html', 'style.css', 'main.js'];
filesToCopy.forEach(file => {
    const srcPath = path.join(__dirname, file);
    const destPath = path.join(DIST_DIR, file);
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${file} to dist/`);
    } else {
        console.error(`Error: Source file ${file} does not exist!`);
        process.exit(1);
    }
});

// 3. Copy assets folder recursively
const assetsSrc = path.join(__dirname, 'assets');
if (fs.existsSync(assetsSrc)) {
    copyFolderRecursiveSync(assetsSrc, DIST_DIR);
    console.log('Copied assets/ folder recursively to dist/assets/');
} else {
    console.warn('Warning: assets/ folder not found in workspace.');
}

// 4. Generate netlify.toml inside dist/ (for direct drag-and-drop deploys)
const netlifyConfig = `# netlify.toml - Custom caching & security configuration for FRUTIX
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "no-referrer-when-downgrade"
    Content-Security-Policy = "default-src 'self' https://cdnjs.cloudflare.com; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com https://use.fontawesome.com; font-src 'self' https://fonts.gstatic.com https://use.fontawesome.com; img-src 'self' data:; media-src 'self'; frame-src 'none'; object-src 'none';"

# Caching for assets (images & videos) - 1 year, immutable
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Caching for critical files - revalidate daily
[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=86400, must-revalidate"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=86400, must-revalidate"
`;

fs.writeFileSync(path.join(DIST_DIR, 'netlify.toml'), netlifyConfig);
console.log('Generated netlify.toml inside dist/');

// 5. Verification
console.log('\n--- Verifying Build Output ---');
let buildValid = true;
const expectedPaths = [
    path.join(DIST_DIR, 'index.html'),
    path.join(DIST_DIR, 'style.css'),
    path.join(DIST_DIR, 'main.js'),
    path.join(DIST_DIR, 'netlify.toml'),
    path.join(DIST_DIR, 'assets', 'videos', 'strawberry_anim.mp4'),
    path.join(DIST_DIR, 'assets', 'videos', 'mango_anim.mp4'),
    path.join(DIST_DIR, 'assets', 'images', 'grape_carton.png'),
    path.join(DIST_DIR, 'assets', 'images', 'strawberry_carton.jpg'),
    path.join(DIST_DIR, 'assets', 'images', 'mango_carton.jpg')
];

expectedPaths.forEach(p => {
    if (fs.existsSync(p)) {
        console.log(`[OK]  ${path.relative(DIST_DIR, p)}`);
    } else {
        console.error(`[ERR] Missing build output: ${path.relative(DIST_DIR, p)}`);
        buildValid = false;
    }
});

if (buildValid) {
    console.log('\n=== BUILD COMPLETED SUCCESSFULLY IN dist/ ===');
    process.exit(0);
} else {
    console.error('\n=== BUILD FAILED: Some files were not copied correctly ===');
    process.exit(1);
}
