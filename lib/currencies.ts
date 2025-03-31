export const Currencies = [
    { value: "USD", label: "$ US Dollar", locale: "en-US" },
    { value: "EUR", label: "€ Euro", locale: "de-DE" },
    { value: "GBP", label: "£ British Pound", locale: "en-GB" },
    { value: "JPY", label: "¥ Japanese Yen", locale: "ja-JP" },
    { value: "AUD", label: "$ Australian Dollar", locale: "en-AU" },
    { value: "CAD", label: "$ Canadian Dollar", locale: "en-CA" },
    { value: "CHF", label: "CHF Swiss Franc", locale: "fr-CH" },
    { value: "CNY", label: "¥ Chinese Yuan", locale: "zh-CN" },
    { value: "INR", label: "₹ Indian Rupee", locale: "hi-IN" },
    { value: "BRL", label: "R$ Brazilian Real", locale: "pt-BR" },
    { value: "ZAR", label: "R South African Rand", locale: "en-ZA" },
    { value: "MXN", label: "$ Mexican Peso", locale: "es-MX" },
    { value: "RUB", label: "₽ Russian Ruble", locale: "ru-RU" },
    { value: "KRW", label: "₩ South Korean Won", locale: "ko-KR" },
    { value: "SGD", label: "$ Singapore Dollar", locale: "en-SG" },
    { value: "HKD", label: "$ Hong Kong Dollar", locale: "zh-HK" },
    { value: "SEK", label: "kr Swedish Krona", locale: "sv-SE" },
    { value: "NZD", label: "$ New Zealand Dollar", locale: "en-NZ" },
    { value: "TRY", label: "₺ Turkish Lira", locale: "tr-TR" },
    { value: "AED", label: "د.إ UAE Dirham", locale: "ar-AE" }
];

export type Currency = (typeof Currencies)[0];