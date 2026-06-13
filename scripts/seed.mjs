// Seeds the `atv` MySQL database with rich mock data + locally-generated images.
// Idempotent: wipes catalog tables (brands/categories/blogs/atvs/atv_images),
// keeps & augments users + locations, then reseeds. Run: node scripts/seed.mjs
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { mkdir, writeFile, readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { atvSvg, brandSvg, categorySvg } from "./lib/svg.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SEED_DIR = path.join(ROOT, "public", "seed");

// --- load .env (simple parser) ---
try {
  const env = await readFile(path.join(ROOT, ".env"), "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {}

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const now = () => new Date().toISOString().slice(0, 19).replace("T", " ");

const BRANDS = [
  ["Honda", "#e60012"], ["Yamaha", "#0033a0"], ["Polaris", "#c8102e"],
  ["Can-Am", "#f2a900"], ["Kawasaki", "#3a8b1e"], ["Suzuki", "#1f3a93"],
  ["CFMoto", "#ff6a00"], ["Arctic Cat", "#00843d"], ["KTM", "#ff6600"],
  ["Kymco", "#00529b"], ["Hisun", "#d4001a"], ["Segway", "#0a6cff"],
  ["TGB", "#e2231a"], ["Stels", "#1b6ca8"], ["Aeon", "#6a1b9a"], ["Linhai", "#2e7d32"],
];

const CATEGORIES = [
  ["კვადროციკლი (ATV)", "#f97316"], ["UTV / Side-by-Side", "#0ea5e9"],
  ["სპორტული ATV", "#ef4444"], ["იუტილითი ATV", "#22c55e"],
  ["ბავშვის ATV", "#eab308"], ["ელექტრო ATV", "#14b8a6"],
  ["თოვლმავალი", "#6366f1"], ["აქსესუარები", "#a855f7"],
];

const MODELS = {
  Honda: ["FourTrax Rancher", "FourTrax Foreman", "TRX 450R", "Pioneer 1000", "Rubicon 520"],
  Yamaha: ["Grizzly 700", "Kodiak 450", "Raptor 700R", "Wolverine RMAX", "YXZ 1000R"],
  Polaris: ["Sportsman 570", "Sportsman 850", "RZR XP 1000", "Scrambler 850", "Ranger 1000"],
  "Can-Am": ["Outlander 650", "Outlander 1000", "Renegade 1000", "Maverick X3", "Commander 700"],
  Kawasaki: ["Brute Force 750", "Brute Force 300", "KFX 450R", "Mule Pro-FX", "Teryx KRX 1000"],
  Suzuki: ["KingQuad 500", "KingQuad 750", "QuadSport Z400", "Ozark 250"],
  CFMoto: ["CForce 600", "CForce 1000", "ZForce 950", "UForce 600"],
  "Arctic Cat": ["Alterra 570", "Alterra 700", "Wildcat XX", "Prowler Pro"],
  KTM: ["450 SX", "525 XC", "505 SX"],
  Kymco: ["MXU 700", "Maxxer 300", "UXV 700"],
  Hisun: ["Tactic 550", "Sector 750", "Strike 1000"],
  Segway: ["Snarler AT6", "Fugleman UT10", "Villain SX10"],
  TGB: ["Blade 600", "Target 550", "Blade 1000"],
  Stels: ["Guepard 800", "ATV 650", "Leopard 600"],
  Aeon: ["Cobra 520", "Crossland 700", "Elite 460"],
  Linhai: ["Hunter 200", "Yetti 400", "Bighorn 500"],
};
const GENERIC = ["Trail 400", "Adventure 500", "Cross 700", "Quad 250", "Hunter 650"];

const TRANSMISSIONS = ["ავტომატური (CVT)", "მექანიკური", "ნახევრად-ავტომატური"];
const FUELS = ["ბენზინი", "დიზელი", "ელექტრო"];
const DESC = (name, brand, year) =>
  `${brand} ${name} (${year}) — სანდო და მძლავრი კვადროციკლი ნებისმიერი რელიეფისთვის. ` +
  `მანქანა იდეალურ მდგომარეობაშია, რეგულარულად მომსახურებული. შესაფერისია როგორც სამუშაოდ, ` +
  `ასევე თავგადასავლებისთვის. ხელმისაწვდომია გარიგება და ტესტ-დრაივი.`;

async function writeSvg(rel, svg) {
  const full = path.join(SEED_DIR, rel);
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, svg, "utf8");
  return `/seed/${rel.split(path.sep).join("/")}`;
}

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "atv",
    multipleStatements: true,
  });
  console.log("Connected. Wiping catalog tables…");
  await conn.query(`
    SET FOREIGN_KEY_CHECKS=0;
    TRUNCATE TABLE atv_images;
    TRUNCATE TABLE atvs;
    TRUNCATE TABLE brands;
    TRUNCATE TABLE categories;
    TRUNCATE TABLE blogs;
    SET FOREIGN_KEY_CHECKS=1;
  `);

  // placeholder for runtime-created ATVs
  await writeSvg(path.join("atvs", "placeholder.svg"),
    atvSvg({ title: "ATV", brand: "MyKvadro", year: new Date().getFullYear(), color: "#f97316", variant: 0 }));

  // --- brands ---
  console.log("Seeding brands + logos…");
  const brandIds = {};
  for (const [title, color] of BRANDS) {
    const img = await writeSvg(path.join("brands", `${slug(title)}.svg`), brandSvg({ title, color }));
    const [r] = await conn.execute(
      "INSERT INTO brands (title, image, created_at, updated_at) VALUES (?,?,?,?)",
      [title, img, now(), now()]
    );
    brandIds[title] = r.insertId;
  }

  // --- categories ---
  console.log("Seeding categories + images…");
  const categoryIds = [];
  let ci = 0;
  for (const [title, color] of CATEGORIES) {
    const img = await writeSvg(path.join("categories", `cat-${++ci}.svg`), categorySvg({ title, color }));
    const [r] = await conn.execute(
      "INSERT INTO categories (title, image, is_active, created_at, updated_at) VALUES (?,?,1,?,?)",
      [title, img, now(), now()]
    );
    categoryIds.push(r.insertId);
  }

  // --- blogs ---
  console.log("Seeding blog posts…");
  const blogPosts = [
    ["როგორ ავირჩიოთ პირველი კვადროციკლი", "კვადროციკლის შერჩევისას გაითვალისწინეთ ძრავის მოცულობა, დანიშნულება და ბიუჯეტი. დამწყებთათვის რეკომენდებულია 250-450cc მოდელები..."],
    ["ATV-ის სეზონური მოვლის გზამკვლევი", "რეგულარული ტექნიკური მომსახურება ახანგრძლივებს კვადროციკლის სიცოცხლეს. შეამოწმეთ ზეთი, ფილტრები, ჯაჭვი და საბურავები..."],
    ["UTV vs ATV — რომელია თქვენთვის?", "Side-by-Side მანქანები გთავაზობთ მეტ კომფორტსა და უსაფრთხოებას, ATV კი მობილურობასა და სიმსუბუქეს. შევადაროთ ისინი..."],
    ["TOP 5 თავგადასავალი საქართველოში კვადროით", "თუშეთი, სვანეთი, ხევსურეთი — საქართველო სავსეა ულამაზესი ოფ-როუდ მარშრუტებით. აი ჩვენი რჩეული ხუთეული..."],
  ];
  let bi = 0;
  for (const [title, description] of blogPosts) {
    const img = await writeSvg(path.join("blog", `post-${++bi}.svg`),
      categorySvg({ title: "BLOG", color: pick(["#f97316", "#0ea5e9", "#22c55e", "#6366f1"]) }));
    await conn.execute(
      "INSERT INTO blogs (title, description, image, is_active, created_at, updated_at) VALUES (?,?,?,1,?,?)",
      [title, description, img, now(), now()]
    );
  }

  // --- users (ensure admin + test users with known password) ---
  console.log("Ensuring users…");
  const pwd = bcrypt.hashSync("password", 12);
  async function ensureUser(name, email, type) {
    const [rows] = await conn.execute("SELECT id FROM users WHERE email=? LIMIT 1", [email]);
    if (rows.length) {
      await conn.execute("UPDATE users SET name=?, user_type=?, password=?, updated_at=? WHERE id=?",
        [name, type, pwd, now(), rows[0].id]);
      return rows[0].id;
    }
    const [r] = await conn.execute(
      "INSERT INTO users (name, email, phone, user_type, password, created_at, updated_at) VALUES (?,?,?,?,?,?,?)",
      [name, email, `+9955${rand(10000000, 99999999)}`, type, pwd, now(), now()]
    );
    return r.insertId;
  }
  const adminId = await ensureUser("ადმინისტრატორი", "admin@mykvadro.ge", "admin");
  await ensureUser("Gega Gagua", "gegagagua@gmail.com", "admin"); // user's own login
  const userIds = [];
  const georgianNames = ["გიორგი ბერიძე", "ნინო ხარაზი", "დავით ლომიძე", "ანა ცქიტიშვილი", "ლევან ჯაფარიძე", "მარიამ კვარაცხელია", "ზურაბ ღოღობერიძე", "თამარ ნადირაძე"];
  for (let i = 1; i <= georgianNames.length; i++) {
    userIds.push(await ensureUser(georgianNames[i - 1], `user${i}@mykvadro.ge`, "user"));
  }
  userIds.push(adminId);

  // --- locations (ensure some active Georgian cities exist) ---
  const [cityRows] = await conn.query(
    "SELECT id FROM locations WHERE is_georgian=1 AND is_active=1 AND type='city'"
  );
  let cityIds = cityRows.map((r) => r.id);
  if (cityIds.length === 0) {
    const cities = ["თბილისი", "ბათუმი", "ქუთაისი", "რუსთავი", "გორი", "ზუგდიდი", "ფოთი", "თელავი"];
    for (const name of cities) {
      const [r] = await conn.execute(
        "INSERT INTO locations (name, country, type, is_georgian, is_active, created_at, updated_at) VALUES (?,?,?,1,1,?,?)",
        [name, "Georgia", "city", now(), now()]
      );
      cityIds.push(r.insertId);
    }
  }

  // --- ATVs (60) with 4 images each ---
  console.log("Seeding ATVs + gallery images…");
  const brandList = Object.keys(brandIds);
  const TARGET = 60;
  for (let i = 0; i < TARGET; i++) {
    const brand = pick(brandList);
    const color = BRANDS.find(([t]) => t === brand)[1];
    const model = pick(MODELS[brand] || GENERIC);
    const year = rand(2016, 2026);
    const name = `${brand} ${model}`;
    const price = rand(45, 620) * 100; // 4,500 – 62,000 ₾
    const mileage = year >= 2025 ? rand(0, 400) : rand(500, 26000);
    const cc = (model.match(/\d{3,4}/) || [String(rand(250, 1000))])[0];
    const engine = `${cc}cc`;
    const transmission = pick(TRANSMISSIONS);
    const fuel = pick(FUELS);
    const clearance = `${rand(240, 320)} მმ`;
    const isVip = Math.random() < 0.22 ? 1 : 0;
    const userId = pick(userIds);
    const categoryId = pick(categoryIds);
    const locationId = pick(cityIds);
    const created = new Date(Date.now() - rand(0, 120) * 86400000).toISOString().slice(0, 19).replace("T", " ");

    const [r] = await conn.execute(
      `INSERT INTO atvs
        (user_id, brand_id, category_id, location_id, name, price, year, clearance, mileage,
         transmission, fuel, isActive, isVip, engine, description, created_at, updated_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,1,?,?,?,?,?)`,
      [userId, brandIds[brand], categoryId, locationId, name, price, year, clearance, mileage,
       transmission, fuel, isVip, engine, DESC(model, brand, year), created, created]
    );
    const atvId = r.insertId;
    const imgCount = rand(3, 5);
    for (let n = 0; n < imgCount; n++) {
      const url = await writeSvg(
        path.join("atvs", `atv-${atvId}-${n + 1}.svg`),
        atvSvg({ title: model, brand, year, color, variant: n })
      );
      await conn.execute(
        `INSERT INTO atv_images (atv_id, url, type, alt_text, sort_order, is_primary, is_active, created_at, updated_at)
         VALUES (?,?,?,?,?,?,1,?,?)`,
        [atvId, url, "image", `${name} ${n + 1}`, n + 1, n === 0 ? 1 : 0, now(), now()]
      );
    }
  }

  const [[counts]] = await conn.query(
    "SELECT (SELECT COUNT(*) FROM atvs) atvs, (SELECT COUNT(*) FROM atv_images) imgs, (SELECT COUNT(*) FROM brands) brands, (SELECT COUNT(*) FROM categories) cats, (SELECT COUNT(*) FROM blogs) blogs, (SELECT COUNT(*) FROM users) users"
  );
  console.log("Done:", counts);
  console.log("Admin login: admin@mykvadro.ge / password");
  await conn.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
