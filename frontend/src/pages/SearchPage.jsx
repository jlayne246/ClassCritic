import SearchBar from "../components/SearchBar";
import Data from "../CourseNames.json";

export default function SearchPage() {
  return <SearchBar placeholder="Enter a course name..." data={Data} />;
}
