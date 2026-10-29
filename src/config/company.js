// Контактные данные и адреса внешних сервисов — в одном месте вместо дублирования по страницам.

export const COMPANY_NAME = "Ko'kcha eshiklar";

export const PHONE_DISPLAY = "+998 90 130 10 10";
export const PHONE_TEL = "+998901301010";
export const EMAIL = "info@kokscha.uz";
export const WORKING_HOURS = "09:00–20:00";

export const INSTAGRAM_URL = "https://www.instagram.com/kokcha.eshiklari.uz";
export const INSTAGRAM_HANDLE = "@kokcha.eshiklari.uz";

// Шоурум: Ташкент, Шайхантахурский район, Себзар-7 (координаты приблизительные, как на прежнем сайте)
export const SHOWROOM_COORDS = [41.336194, 69.256306];
export const SHOWROOM_MAP_URL = `https://www.google.com/maps?q=${SHOWROOM_COORDS[0]},${SHOWROOM_COORDS[1]}`;

// CRM: и каталог, и заявки идут через /api на домене сайта
// (proxy в vite.config.js, rewrite в vercel.json → crm-kukcha.vercel.app/api/*).
// Прямой запрос из браузера на CRM блокируется CORS: CRM разрешает только свой домен.
// Эндпоинт, метод и тело запроса заявки те же, что и раньше.
export const CRM_ORIGIN = "https://crm-kukcha.vercel.app";
export const LEADS_URL = "/api/leads";
