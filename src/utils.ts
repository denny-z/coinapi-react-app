export default function formatPrice(value: number) {
  return value < 1 ? value.toFixed(6) : value.toFixed(2);
}