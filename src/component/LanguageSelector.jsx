const LanguageSelector = ({ languages, selectedLanguage, setSelectedLanguage }) => {
  return (
    <select
      value={selectedLanguage}
      onChange={(e) => setSelectedLanguage(e.target.value)}
      className="border rounded p-2"
    >
      {Object.entries(languages).map(([key, value]) => (
        <option key={key} value={key}>
          {value}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelector;