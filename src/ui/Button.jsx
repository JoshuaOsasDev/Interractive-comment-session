function Button({ onClick, type, className, children, disabled }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={className}
    >
      {children}
    </button>
  );
}

export default Button;
