export default function ChatMessage({ message }) {
  return (
    <div>
      <strong>{message.username}: </strong>
      <span>{message.message}</span>
    </div>
  );
}
