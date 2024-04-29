const Button = ({
  text,
  type,
  onClick,
  disabled,
  confirmButton,
}: {
  text: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  confirmButton?: boolean;
}) => {
  return (
    <>
      <button
        disabled={disabled}
        onClick={onClick}
        type={type}
        className={`bg-green-900 hover:bg-green-800 text-white font-bold py-2 rounded px-2
        ${disabled && "opacity-50"}
        `}
      >
        {text}
      </button>
    </>
  );
};

export default Button;