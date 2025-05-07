import React, { useState } from 'react';

const WikiSearchInput = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === '') {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=search&srsearch=${value}`
    );
    const data = await res.json();
    const searchResults = data?.query?.search || [];
    setResults(searchResults.slice(0, 10));
    setShowDropdown(true);
  };

  const handleSelect = (title, pageid) => {
    setQuery(title);
    setShowDropdown(false);
    onSelect({ title, pageid }); 
  };

  return (
    <div className="relative w-[600px] group">
      <input
        type="text"
        placeholder="search..."
        value={query}
        onChange={handleChange}
        className="w-full h-[60px] text-center px-4 border-[2.5px] border-black text-base uppercase tracking-widest transition-all duration-200 focus:outline-none focus:border-[0.5px] focus:shadow-[-5px_-5px_0px_0px_black]"
      />
      {showDropdown && results.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-black mt-1 max-h-60 overflow-y-auto">
          {results.map(({ title, pageid }) => (
            <li
              key={pageid}
              onClick={() => handleSelect(title, pageid)}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer uppercase tracking-widest text-sm"
            >
              {title} <span className="text-gray-500 text-xs"></span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WikiSearchInput;
