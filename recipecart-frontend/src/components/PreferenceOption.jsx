function PreferenceOption({ label, isSelected, onClick }) {
  const className = `preference-option ${isSelected ? 'selected' : ''}`;
  
  return (
    <div className={className} onClick={onClick}>
      {label}
    </div>
  );
}

export default PreferenceOption;