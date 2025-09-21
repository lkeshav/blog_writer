import { useState } from 'react';
import { useAppDispatch } from '../shared/hooks';
import { searchBlogs, fetchBlogs } from '../features/blog/blogSlice';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const dispatch = useAppDispatch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      dispatch(searchBlogs({ query: query.trim() }));
    } else {
      dispatch(fetchBlogs());
    }
  };

  const handleClear = () => {
    setQuery('');
    dispatch(fetchBlogs());
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts..."
            className="search-input"
          />
          <button type="submit" className="search-btn">
            Search
          </button>
          {query && (
            <button type="button" onClick={handleClear} className="clear-btn">
              Clear
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
