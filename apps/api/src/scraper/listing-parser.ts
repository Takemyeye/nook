export interface ParsedPrice {
  price: number | null;
  currency: 'USD' | 'GEL' | null;
}

const PRICE_MIN = 50;
const PRICE_MAX = 20000;

const USD_PATTERNS = [
  /\$\s?(\d[\d\s.,]{0,6}\d|\d)/,
  /(\d[\d\s.,]{0,6}\d|\d)\s?\$/,
  /(\d[\d\s.,]{0,6}\d|\d)\s?(?:usd|долл\w*)/i,
];

const GEL_PATTERNS = [
  /(\d[\d\s.,]{0,6}\d|\d)\s?₾/,
  /(\d[\d\s.,]{0,6}\d|\d)\s?(?:gel|лари)/i,
];

const matchAmount = (text: string, patterns: RegExp[]): number | null => {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const amount = Number(match[1].replace(/[\s.,]/g, ''));
      if (amount >= PRICE_MIN && amount <= PRICE_MAX) {
        return amount;
      }
    }
  }
  return null;
};

export const parsePrice = (text: string): ParsedPrice => {
  const usd = matchAmount(text, USD_PATTERNS);
  if (usd !== null) {
    return { price: usd, currency: 'USD' };
  }
  const gel = matchAmount(text, GEL_PATTERNS);
  if (gel !== null) {
    return { price: gel, currency: 'GEL' };
  }
  return { price: null, currency: null };
};

const ROOMS_MIN = 1;
const ROOMS_MAX = 9;

const matchCount = (text: string, patterns: RegExp[]): number | null => {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const count = Number(match[1]);
      if (count >= ROOMS_MIN && count <= ROOMS_MAX) {
        return count;
      }
    }
  }
  return null;
};

const ROOMS_PATTERNS = [
  /(?<!\d)(\d)(?!\d)[ \t]*[-–]?[ \t]*[хx]?[ \t]*[-–]?[ \t]*(?:комн|room|ოთახ)/i,
  /(?:комнат\w*|rooms?|ოთახ\w*)[ \t]*[:\-–][ \t]*(\d)(?!\d)/i,
];

const BEDROOMS_PATTERNS = [
  /(?<!\d)(\d)(?!\d)[ \t]*[-–]?[ \t]*(?:спальн|bed(?:room)?s?\b|საძინებ)/i,
  /(?:спальн\w*|bedrooms?|beds?)[ \t]*[:\-–][ \t]*(\d)(?!\d)/i,
];

export const parseRooms = (text: string): number | null => matchCount(text, ROOMS_PATTERNS);

export const parseBedrooms = (text: string): number | null => matchCount(text, BEDROOMS_PATTERNS);

const AREA_MIN = 15;
const AREA_MAX = 1000;

export const parseArea = (text: string): number | null => {
  const match = text.match(/(?<!\d)(\d{2,4})[ \t]*(?:кв\.?\s?м|м2|м²|m2|m²|sq\.?\s?m|კვ)/i);
  if (!match) {
    return null;
  }
  const area = Number(match[1]);
  return area >= AREA_MIN && area <= AREA_MAX ? area : null;
};

const DISTRICTS: Array<[string, string[]]> = [
  ['Vake', ['vake', 'ваке']],
  ['Saburtalo', ['saburtalo', 'сабуртало']],
  ['Vera', ['vera', 'вера']],
  ['Sololaki', ['sololaki', 'сололаки']],
  ['Mtatsminda', ['mtatsminda', 'мтацминда']],
  ['Chugureti', ['chugureti', 'чугурети']],
  ['Didube', ['didube', 'дидубе']],
  ['Gldani', ['gldani', 'глдани']],
  ['Isani', ['isani', 'исани']],
  ['Samgori', ['samgori', 'самгори']],
  ['Ortachala', ['ortachala', 'ортачала']],
  ['Avlabari', ['avlabari', 'авлабар']],
  ['Marjanishvili', ['marjanishvili', 'марджанишвили']],
  ['Didi Dighomi', ['didi dighomi', 'диди дигоми', 'дигоми']],
  ['Varketili', ['varketili', 'варкетили']],
  ['Nadzaladevi', ['nadzaladevi', 'надзаладеви']],
  ['Old Tbilisi', ['старый город', 'старом городе', 'old town']],
];

export const parseDistrict = (text: string): string | null => {
  const lower = text.toLowerCase();
  for (const [name, variants] of DISTRICTS) {
    if (variants.some((variant) => lower.includes(variant))) {
      return name;
    }
  }
  return null;
};

const EMOJI_AND_DECORATION =
  /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}\u{2764}]/gu;

const TITLE_MAX_LENGTH = 90;
const FALLBACK_TITLE = 'Apartment in Tbilisi';

export const parseTitle = (text: string): string => {
  const firstLine = text
    .split('\n')
    .map((line) => line.replace(EMOJI_AND_DECORATION, '').replace(/^[#\s*•·▪◾–—-]+/, '').trim())
    .find((line) => line.length > 0);
  if (!firstLine) {
    return FALLBACK_TITLE;
  }
  return firstLine.length > TITLE_MAX_LENGTH
    ? `${firstLine.slice(0, TITLE_MAX_LENGTH).trimEnd()}…`
    : firstLine;
};

const RENT_KEYWORDS = /сда[еёмю]|аренд|rent|ქირავდება/i;
const TESTIMONIAL_MARKERS = /отзыв/i;

export const isSalePost = (text: string): boolean =>
  /прода|sale|იყიდება/i.test(text) && !RENT_KEYWORDS.test(text);

export const isNoisePost = (text: string, price: number | null): boolean =>
  price === null && (TESTIMONIAL_MARKERS.test(text) || !RENT_KEYWORDS.test(text));
