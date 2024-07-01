
type SearchProps = {
     search: string;
     setSearch: React.Dispatch<React.SetStateAction<string>>;
};

const Search: React.FC<SearchProps> = ({ search, setSearch }) => {
     return (
          <div className="w-full">
               <input placeholder="Search" className="bg-white rounded-full px-4 py-2 outline-none w-full" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
     )
}

export default Search