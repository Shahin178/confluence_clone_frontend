import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { formatDistanceToNow } from "date-fns";

const DocumentList = () => {
  const [search, setSearch] = useState("");
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await api.get("/docs");
      console.log("Fetched documents:", data.data);
      
      setDocs(data.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocs = docs.filter(
    (doc) =>
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    navigate("/edit");
  };

  const handleEdit = (_id) => {
    console.log("Editing document with ID:", _id);
    
    navigate(`/edit/${_id}`);
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search documents..."
          className="border border-gray-300 rounded-lg px-4 py-2 w-2/3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <button
          onClick={handleCreate}
          className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow transition-colors"
        >
          + Create New Doc
        </button>
      </div>
      <div className="grid gap-6">
        {filteredDocs.length === 0 ? (
          <div className="text-center text-gray-500">No documents found.</div>
        ) : (
          filteredDocs.map((doc) => (
            <div
              key={doc._id}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-xl transition-shadow border border-gray-100"
            >
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-1">
                  {doc.title}
                </h3>
                <p className="text-gray-700 mb-2 line-clamp-2">{doc.content}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span className="font-medium text-blue-700">
                    {doc.author.username}
                  </span>
                  <span>
                    {doc.lastModified
                      ? `Last update ${formatDistanceToNow(
                          new Date(doc.lastModified),
                          { addSuffix: true }
                        )}`
                      : ""}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleEdit(doc._id)}
                className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-semibold shadow transition-colors"
              >
                Edit
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DocumentList;
