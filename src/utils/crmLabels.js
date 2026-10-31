import i18n from "@/i18n";

// Переводы подписей из CRM. Коллекции, стили и цвета приходят из CRM как есть
// (в основном по-русски, часть — по-английски). Сами значения остаются ключами
// фильтров и ссылок (?cat=Неоклассика), переводится только отображаемый текст.
// Значение, которого нет в словаре, показывается без изменений.

const TYPES = {
  Неоклассика: { en: "Neoclassic", uz: "Neoklassika", zh: "新古典" },
  Минимализм: { en: "Minimalism", uz: "Minimalizm", zh: "极简" },
  Современная: { en: "Modern", uz: "Zamonaviy", zh: "现代" },
  Классика: { en: "Classic", uz: "Klassika", zh: "古典" },
  "Хай-тек": { en: "High-tech", uz: "Xay-tek", zh: "高科技" },
  "Hidden Door": { ru: "Скрытая дверь", uz: "Yashirin eshik", zh: "隐形门" },
  "3D Panel": { ru: "3D-панель", uz: "3D panel", zh: "3D 面板" },
};

const STYLES = {
  Минимализм: { en: "Minimalism", uz: "Minimalizm", zh: "极简" },
  Современный: { en: "Modern", uz: "Zamonaviy", zh: "现代" },
  Классик: { en: "Classic", uz: "Klassik", zh: "古典" },
  "Арт-деко": { en: "Art Deco", uz: "Art-deko", zh: "装饰艺术" },
  "Хай-тек": { en: "High-tech", uz: "Xay-tek", zh: "高科技" },
  Contemporary: { ru: "Контемпорари", uz: "Kontemporari", zh: "当代" },
  Luxury: { ru: "Люкс", uz: "Lyuks", zh: "奢华" },
  "White & Gold Classic": { ru: "Белая классика с золотом", uz: "Oq-oltin klassika", zh: "白金古典" },
  "3D Minimal": { ru: "3D-минимализм", uz: "3D minimal", zh: "3D 极简" },
  "Классика + Неоклассика": { en: "Classic + Neoclassic", uz: "Klassika + Neoklassika", zh: "古典 + 新古典" },
  "Luxury + Неоклассика": { ru: "Люкс + Неоклассика", en: "Luxury + Neoclassic", uz: "Lyuks + Neoklassika", zh: "奢华 + 新古典" },
};

// Цвета — по нормализованному названию (без «цвет», в нижнем регистре, ё → е).
const COLORS = {
  кремовый: { en: "Cream", uz: "Krem", zh: "奶油色" },
  "светло-бежевый": { en: "Light beige", uz: "Och bej", zh: "浅米色" },
  "теплый древесный": { en: "Warm wood", uz: "Iliq yog‘och", zh: "暖木色" },
  "светлый айвори": { en: "Light ivory", uz: "Och fil suyagi", zh: "浅象牙色" },
  "теплый песочный": { en: "Warm sand", uz: "Iliq qum", zh: "暖沙色" },
  графитовый: { en: "Graphite", uz: "Grafit", zh: "石墨色" },
  капучино: { en: "Cappuccino", uz: "Kapuchino", zh: "卡布奇诺色" },
  "натуральный дуб": { en: "Natural oak", uz: "Tabiiy eman", zh: "天然橡木" },
  венге: { en: "Wenge", uz: "Venge", zh: "胡桃木色" },
  "глубокий морской синий": { en: "Deep sea blue", uz: "To‘q dengiz ko‘ki", zh: "深海蓝" },
  "светлый белый": { en: "Light white", uz: "Och oq", zh: "亮白色" },
  "graphite grey": { ru: "Графитово-серый", uz: "Grafit kulrang", zh: "石墨灰" },
  терракотовый: { en: "Terracotta", uz: "Terrakota", zh: "赤陶色" },
  оливковый: { en: "Olive", uz: "Zaytun", zh: "橄榄色" },
  перламутровый: { en: "Pearl", uz: "Sadaf", zh: "珍珠色" },
  молочный: { en: "Milky", uz: "Sutrang", zh: "乳白色" },
  "дымчато-серый": { en: "Smoky grey", uz: "Tutunsimon kulrang", zh: "烟灰色" },
  "кофе с молоком": { en: "Café au lait", uz: "Sutli qahva", zh: "咖啡牛奶色" },
  "глубокий синий": { en: "Deep blue", uz: "To‘q ko‘k", zh: "深蓝色" },
  пудровый: { en: "Powder", uz: "Pudra", zh: "粉色" },
  "глубокий серый": { en: "Deep grey", uz: "To‘q kulrang", zh: "深灰色" },
  "светло-серый": { en: "Light grey", uz: "Och kulrang", zh: "浅灰色" },
  бежевый: { en: "Beige", uz: "Bej", zh: "米色" },
  "матовый белый": { en: "Matte white", uz: "Mat oq", zh: "哑光白" },
  "слоновая кость": { en: "Ivory", uz: "Fil suyagi", zh: "象牙色" },
  "теплый орех": { en: "Warm walnut", uz: "Iliq yong‘oq", zh: "暖胡桃色" },
  "темный шоколад": { en: "Dark chocolate", uz: "To‘q shokolad", zh: "深巧克力色" },
  "светлый дуб": { en: "Light oak", uz: "Och eman", zh: "浅橡木" },
  "бежево-песочный": { en: "Beige sand", uz: "Bej-qum", zh: "米沙色" },
  "серо-зеленый": { en: "Grey green", uz: "Kulrang-yashil", zh: "灰绿色" },
  "белый с золотом": { en: "White and gold", uz: "Oltinli oq", zh: "白金色" },
  "deep ocean teal": { ru: "Глубокий бирюзовый", uz: "To‘q firuza", zh: "深海青" },
  "оливково-зеленый": { en: "Olive green", uz: "Zaytun yashil", zh: "橄榄绿" },
  ореховый: { en: "Walnut", uz: "Yong‘oq", zh: "胡桃色" },
  "stone grey": { ru: "Каменно-серый", uz: "Tosh kulrang", zh: "石灰色" },
  белый: { en: "White", uz: "Oq", zh: "白色" },
  "темно синий": { en: "Dark blue", uz: "To‘q ko‘k", zh: "深蓝色" },
  "темно-синий": { en: "Dark blue", uz: "To‘q ko‘k", zh: "深蓝色" },
  синий: { en: "Blue", uz: "Ko‘k", zh: "蓝色" },
  баклажановый: { en: "Aubergine", uz: "Baqlajon", zh: "茄紫色" },
  красный: { en: "Red", uz: "Qizil", zh: "红色" },
  зеленый: { en: "Green", uz: "Yashil", zh: "绿色" },
  глины: { ru: "Глиняный", en: "Clay", uz: "Loy rang", zh: "陶土色" },
  глинистый: { ru: "Глиняный", en: "Clay", uz: "Loy rang", zh: "陶土色" },
  "ярко-зеленый": { en: "Bright green", uz: "Yorqin yashil", zh: "亮绿色" },
  коричневый: { en: "Brown", uz: "Jigarrang", zh: "棕色" },
  серый: { en: "Grey", uz: "Kulrang", zh: "灰色" },
  "темно-серый": { en: "Dark grey", uz: "To‘q kulrang", zh: "深灰色" },
};

const currentLocale = () => String(i18n.global.locale.value || "en");

const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

// Убираем служебное «цвет» (и опечатку «цыет») из названий вида «Кремовый цвет» / «Цвет Глины».
export function cleanColor(name = "") {
  return capitalize(
    String(name)
      .replace(/\s*ц(в|ы)ет\s*/gi, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

const colorKey = (name) => cleanColor(name).toLowerCase().replace(/ё/g, "е");

const pick = (dict, key, original, locale) => {
  const entry = dict[key];
  if (!entry) return original;
  return entry[locale] || original;
};

export function typeLabel(value, locale = currentLocale()) {
  return value ? pick(TYPES, value, value, locale) : "";
}

export function styleLabel(value, locale = currentLocale()) {
  return value ? pick(STYLES, value, value, locale) : "";
}

export function colorText(value, locale = currentLocale()) {
  if (!value) return "";
  return pick(COLORS, colorKey(value), cleanColor(value), locale);
}
