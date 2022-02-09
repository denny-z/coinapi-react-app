type NameToSymbol = {
  [key: string]: string,
};

const CURRENCIES_NAME_TO_SYMBOL: NameToSymbol = {
  'USD': '$',
};

export default function formatPrice(value: number, pair?: Pair): string {
  let result = value < 1 ? value.toFixed(6) : value.toFixed(2);
  if (pair != null) {
    const symbol = CURRENCIES_NAME_TO_SYMBOL[pair.right];
    if (symbol) {
      result = `${symbol} ${result}`;
    }
  }
  return result;
}
