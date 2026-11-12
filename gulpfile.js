const { src, dest, watch, parallel, series } = require("gulp");

const scss = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const browserSync = require("browser-sync").create();
const uglify = require("gulp-uglify-es").default;
const autoprefixer = require("gulp-autoprefixer");
const del = require("del");
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const { readFileSync } = require('fs');
const { createHash } = require('crypto');
const { Transform } = require('stream');

function browsersync() {
  browserSync.init({
    server: {
      baseDir: "app/",
    },
  });
}

function cleanDist() {
  return del("dist");
}

async function images() {
  await Promise.all([
    copyImages('app/images', 'dist/images'),
    copyImages('app/blocks', 'dist/blocks'),
  ]);
}

async function copyImages(sourceDir, outputDir) {
  const imageFiles = await getImageFiles(sourceDir);
  
  for (const filePath of imageFiles) {
    const ext = path.extname(filePath).toLowerCase();
    const outputPath = path.join(outputDir, path.relative(sourceDir, filePath));
    
    // Создаем папку если не существует
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    
    if (ext === '.svg' || (sourceDir === 'app/blocks' && ext === '.webp')) {
      // SVG и готовые WebP блоков копируем без повторного сжатия
      await fs.copyFile(filePath, outputPath);
    } else if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
      // Остальные минифицируем через Sharp
      await sharp(filePath)
        .jpeg({ quality: 75, progressive: true })
        .png({ quality: 85, compressionLevel: 6 })
        .webp({ quality: 75 })
        .toFile(outputPath);
    } else {
      // Остальные файлы копируем
      await fs.copyFile(filePath, outputPath);
    }
  }
}

async function getImageFiles(dir) {
  const files = [];
  try {
    const items = await fs.readdir(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        files.push(...await getImageFiles(fullPath));
      } else if (/\.(jpg|jpeg|png|webp|gif|svg)$/i.test(item.name)) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Если папка не существует, просто игнорируем
    console.log(`Папка ${dir} не найдена, пропускаем...`);
  }
  
  return files;
}

function scripts() {
  return src("app/js/main.js")
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(dest("app/js"))
    .pipe(browserSync.stream());
}

function styles() {
  return src("app/scss/style.scss")
    .pipe(scss({ outputStyle: "compressed" }))
    .pipe(concat("style.min.css"))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 10 version"],
        grid: true,
      })
    )
    .pipe(dest("app/css"))
    .pipe(browserSync.stream());
}

function build() {
  const revisionedAssets = [
    'css/style.min.css',
    'js/app.js',
    'blocks/projects/projects-scroll.js',
  ];
  const versions = Object.fromEntries(revisionedAssets.map((asset) => [
    asset,
    createHash('sha256').update(readFileSync(path.join('app', asset))).digest('hex').slice(0, 12),
  ]));

  return src(
    [
      "app/css/**/*",           // Все файлы из папки css
      "app/fonts/**/*",
      "app/js/**/*",            // Все файлы из папки js
      "app/blocks/**/*.js",      // Скрипты изолированных блоков
      "app/*.html",
    ],
    { base: "app" }
  ).pipe(new Transform({
    objectMode: true,
    transform(file, encoding, callback) {
      if (path.extname(file.path) === '.html' && file.isBuffer()) {
        const html = file.contents.toString().replace(
          /((?:href|src)=["'])(css\/style\.min\.css|js\/app\.js|blocks\/projects\/projects-scroll\.js)(?:\?v=[^"']*)?(["'])/g,
          (match, prefix, asset, quote) => `${prefix}${asset}?v=${versions[asset]}${quote}`
        );
        file.contents = Buffer.from(html);
      }
      callback(null, file);
    },
  })).pipe(dest("dist"));
}

function watching() {
  watch(["app/scss/**/*.scss", "app/blocks/**/*.scss"], styles);
  watch(["app/js/**/*.js", "!app/js/main.min.js"], scripts);
  watch(["app/blocks/**/*.js"]).on("change", browserSync.reload);
  watch(["app/*.html"]).on("change", browserSync.reload);
}

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.cleanDist = cleanDist;

exports.build = series(styles, cleanDist, images, build);
exports.default = parallel(styles, scripts, browsersync, watching);
