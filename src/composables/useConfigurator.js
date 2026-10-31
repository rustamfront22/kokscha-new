import { computed, reactive, watch } from "vue";
import { useProductStore } from "@/store/product";

// Состояние конфигуратора дверей. Общее для конфигуратора и примерки в интерьере
// (модуль хранит один экземпляр на приложение) и сохраняется в localStorage.
//
// Модель данных строится только из реальных полей CRM:
//   коллекция = product.type, стиль = product.style, отделка = конкретная модель (её цвет),
//   размер = product.size. Сейчас у каждой модели один цвет, один размер и одно фото.
// Если CRM начнёт отдавать варианты (product.finishes / product.sizes / product.images),
// достаточно расширить адаптеры getFinishes() и getSizes() — интерфейс уже работает со списками.

const STORAGE_KEY = "kokcha:configuration";
export const CUSTOM_SIZE = "custom";

const selection = reactive({
  type: null,
  style: null,
  modelId: null,
  size: null,
});

let restored = false;

function readStored() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

function writeStored(value) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // приватный режим / квота — конфигуратор работает и без сохранения
  }
}

// Адаптеры вариантов модели: сейчас по одному реальному значению.
export function getFinishes(product) {
  return product ? [{ id: product.id, color: product.color, image: product.thumbnail }] : [];
}

export function getSizes(product) {
  if (!product) return [];
  const list = Array.isArray(product.sizes) ? product.sizes : [product.size];
  return [...new Set(list.filter(Boolean))];
}

export function useConfigurator() {
  const store = useProductStore();

  const collections = computed(() => store.categories.map((c) => c.name));

  const stylesFor = (type) => [
    ...new Set(store.products.filter((p) => p.type === type).map((p) => p.style).filter(Boolean)),
  ];

  const modelsFor = (type, style) =>
    store.products.filter((p) => p.type === type && (!style || p.style === style));

  const styles = computed(() => (selection.type ? stylesFor(selection.type) : []));
  const models = computed(() => (selection.type ? modelsFor(selection.type, selection.style) : []));
  const product = computed(() => store.findById(selection.modelId));
  const sizes = computed(() => getSizes(product.value));

  // Последнее автоматическое исправление выбора — показываем пользователю, чтобы не было «тихих» подмен.
  const notice = reactive({ key: null, params: {} });

  const pickModel = (type, style) => modelsFor(type, style)[0] || null;

  const setType = (type) => {
    notice.key = null;
    selection.type = type;
    const available = stylesFor(type);
    if (selection.style && !available.includes(selection.style)) {
      notice.key = "Style {style} is not available in the {collection} collection — showing {next}.";
      notice.params = { style: selection.style, collection: type, next: available[0] };
    }
    if (!available.includes(selection.style)) selection.style = available[0] || null;
    const current = store.findById(selection.modelId);
    if (!current || current.type !== type || current.style !== selection.style) {
      selection.modelId = pickModel(type, selection.style)?.id ?? null;
    }
    selection.size = getSizes(store.findById(selection.modelId))[0] || null;
  };

  const setStyle = (style) => {
    notice.key = null;
    selection.style = style;
    const current = store.findById(selection.modelId);
    if (!current || current.style !== style || current.type !== selection.type) {
      selection.modelId = pickModel(selection.type, style)?.id ?? null;
    }
    selection.size = getSizes(store.findById(selection.modelId))[0] || null;
  };

  const setModel = (id) => {
    notice.key = null;
    const p = store.findById(id);
    if (!p) return;
    selection.type = p.type;
    selection.style = p.style;
    selection.modelId = p.id;
    if (selection.size !== CUSTOM_SIZE) selection.size = getSizes(p)[0] || null;
  };

  const setSize = (size) => {
    selection.size = size;
  };

  // Начальное состояние: сохранённый выбор, если модель ещё есть в каталоге, иначе первая модель.
  const init = () => {
    if (restored || store.status !== "success" || !store.products.length) return;
    restored = true;
    const saved = readStored();
    const savedProduct = saved && store.findById(saved.modelId);
    if (savedProduct) {
      setModel(savedProduct.id);
      if (saved.size === CUSTOM_SIZE || getSizes(savedProduct).includes(saved.size)) selection.size = saved.size;
    } else {
      const first = store.latest(1)[0];
      if (first) setModel(first.id);
    }
  };

  watch(() => store.status, init, { immediate: true });

  watch(
    () => ({ ...selection }),
    (value) => {
      if (restored) writeStored(value);
    },
  );

  return {
    selection,
    collections,
    styles,
    models,
    product,
    sizes,
    notice,
    setType,
    setStyle,
    setModel,
    setSize,
    stylesFor,
    modelsFor,
  };
}
