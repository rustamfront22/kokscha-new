import { defineStore } from "pinia";
import { computed, ref } from "vue";
import axios from "axios";
import { CRM_ORIGIN } from "@/config/company";

// /api проксируется на CRM: vite.config.js (dev) и vercel.json (production).
const api = axios.create({
  baseURL: "/api",
});

// Приведение двери из CRM к формату карточки. Поля и формирование URL изображения
// сохранены как на прежнем сайте, чтобы не ломать совместимость.
export const mapDoorToProduct = (item = {}) => {
  return {
    id: item.id,
    title: item.model,
    description: item.description || "",
    price: item.price || 0, // в CRM цены нет; на сайте цена не показывается
    discountPercentage: 0,
    thumbnail: item.image
      ? /^https?:\/\//.test(item.image)
        ? item.image
        : CRM_ORIGIN + item.image
      : "",
    category: item.type || "doors",
    // Данных об остатках в CRM нет. Раньше сюда подставлялся «fill» (процент заполнения) —
    // это не остаток, поэтому поле оставлено пустым (используется только неподключённым store/cart.js).
    stock: null,
    type: item.type,
    style: item.style,
    color: item.color,
    size: item.size,
    fill: item.fill,
  };
};

// Кэш каталога на время сессии: при перезагрузке страницы двери показываются сразу,
// а свежий список тихо подтягивается в фоне. Хранятся только публичные данные из /doors.
const CACHE_KEY = "kokcha:doors";
const CACHE_TTL = 30 * 60 * 1000;

function readCache() {
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "null");
    if (cached && Array.isArray(cached.list) && cached.list.length && Date.now() - cached.at < CACHE_TTL) {
      return cached.list;
    }
  } catch {
    // нет доступа к sessionStorage или битые данные — просто грузим заново
  }
  return null;
}

function writeCache(list) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), list }));
  } catch {
    // квота / приватный режим — работаем без кэша
  }
}

export const useProductStore = defineStore("product", () => {
  const cached = readCache();
  const products = ref(cached ? cached.map(mapDoorToProduct) : []);
  const status = ref(cached ? "success" : "idle"); // idle | loading | success | error
  const error = ref(null);
  let pending = null;
  let revalidated = !cached;

  // Каталог небольшой (≈60 дверей) и отдаётся целиком, поэтому грузим его один раз
  // за сессию и дальше фильтруем на клиенте. Раньше каждый компонент запрашивал /doors заново.
  const fetchProducts = async ({ force = false } = {}) => {
    // Данные из кэша сессии уже на экране — один раз обновляем их в фоне, без скелетонов
    if (status.value === "success" && !force && !revalidated) {
      revalidated = true;
      if (!pending) {
        pending = api
          .get("/doors")
          .then(({ data }) => {
            const list = Array.isArray(data) ? data : data?.doors || [];
            if (list.length) {
              products.value = list.map(mapDoorToProduct);
              writeCache(list);
            }
          })
          .catch(() => {})
          .finally(() => {
            pending = null;
          });
      }
      return products.value;
    }
    if (status.value === "success" && !force) return products.value;
    if (pending) return pending;

    status.value = "loading";
    error.value = null;

    pending = api
      .get("/doors")
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : data?.doors || [];
        products.value = list.map(mapDoorToProduct);
        status.value = "success";
        revalidated = true;
        writeCache(list);
        return products.value;
      })
      .catch((e) => {
        status.value = "error";
        error.value = e;
        throw e;
      })
      .finally(() => {
        pending = null;
      });

    return pending;
  };

  const isLoading = computed(() => status.value === "loading" || status.value === "idle");

  // Категории = поле type, в порядке появления в CRM, с количеством моделей.
  const categories = computed(() => {
    const map = new Map();
    for (const p of products.value) {
      if (!p.type) continue;
      const entry = map.get(p.type);
      if (entry) entry.count += 1;
      else map.set(p.type, { name: p.type, count: 1, cover: p.thumbnail });
    }
    return [...map.values()];
  });

  const styles = computed(() => [...new Set(products.value.map((p) => p.style).filter(Boolean))]);

  const findById = (id) => products.value.find((p) => String(p.id) === String(id)) || null;

  // «Новинки»: последние добавленные в CRM модели (наибольший id).
  const latest = (limit = 10) =>
    [...products.value].sort((a, b) => Number(b.id) - Number(a.id)).slice(0, limit);

  const related = (product, limit = 8) => {
    if (!product) return [];
    const same = products.value.filter((p) => p.id !== product.id && p.type === product.type);
    const rest = products.value.filter((p) => p.id !== product.id && p.type !== product.type);
    return [...same, ...rest].slice(0, limit);
  };

  // ----- Прежний API store: сигнатуры и формат ответа сохранены -----
  const getProducts = async ({ limit = 12, skip = 0 } = {}) => {
    const list = await fetchProducts();
    return { data: { products: list.slice(skip, skip + limit), total: list.length } };
  };

  const getProductsByCategory = async (category) => {
    const list = (await fetchProducts()).filter((item) => item.type === category);
    return { data: { products: list, total: list.length } };
  };

  const getProduct = async (id) => {
    try {
      await fetchProducts();
      return { data: findById(id) };
    } catch (e) {
      return { data: null };
    }
  };

  const getCategories = async () => {
    await fetchProducts();
    return { data: categories.value.map((c) => c.name) };
  };

  return {
    products,
    status,
    error,
    isLoading,
    categories,
    styles,
    fetchProducts,
    findById,
    latest,
    related,
    getProducts,
    getProductsByCategory,
    getProduct,
    getCategories,
  };
});
