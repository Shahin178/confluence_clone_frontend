import React, { useState, useEffect } from "react";
import api from "../api";
import { formatDistanceToNow } from "date-fns";

const PublicDocument = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    try {
      const data = await api.get("/docs/public");
      setDocs(data.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold mb-4">Public Documents</h2>
      {docs.length === 0 && <div>No public documents found.</div>}
      {docs.map((doc) => (
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
                {doc.author?.username || "Unknown"}
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
        </div>
      ))}
    </div>
  );
};

export default PublicDocument;
