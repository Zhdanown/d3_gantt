export default function withMessage(f, message) {
  console.log(message);
  return f;
}
