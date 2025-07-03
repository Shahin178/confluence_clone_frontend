import { useState, useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";
import Select from "react-select";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import api from "../api";

const MenuBar = ({ editor }) => {
  if (!editor) return null;
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-2 py-1 rounded ${
          editor.isActive("bold") ? "bg-blue-200" : "bg-gray-100"
        }`}
      >
        <b>B</b>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-2 py-1 rounded ${
          editor.isActive("italic") ? "bg-blue-200" : "bg-gray-100"
        }`}
      >
        <i>I</i>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`px-2 py-1 rounded ${
          editor.isActive("underline") ? "bg-blue-200" : "bg-gray-100"
        }`}
      >
        <u>U</u>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`px-2 py-1 rounded ${
          editor.isActive("heading", { level: 1 })
            ? "bg-blue-200"
            : "bg-gray-100"
        }`}
      >
        H1
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-2 py-1 rounded ${
          editor.isActive("heading", { level: 2 })
            ? "bg-blue-200"
            : "bg-gray-100"
        }`}
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-2 py-1 rounded ${
          editor.isActive("bulletList") ? "bg-blue-200" : "bg-gray-100"
        }`}
      >
        • List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-2 py-1 rounded ${
          editor.isActive("orderedList") ? "bg-blue-200" : "bg-gray-100"
        }`}
      >
        1. List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        className="px-2 py-1 rounded bg-gray-100"
      >
        Undo
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        className="px-2 py-1 rounded bg-gray-100"
      >
        Redo
      </button>
      <button
        type="button"
        onClick={() =>
          editor.chain().focus().unsetAllMarks().clearNodes().run()
        }
        className="px-2 py-1 rounded bg-gray-100"
      >
        Clear
      </button>
    </div>
  );
};

const DocumentEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [allUsers, setAllUsers] = useState([]);
  const [sharedWith, setSharedWith] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!id);
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: "",
  });

  // Fetch all users for sharing
  useEffect(() => {
    api.get("auth/getAllUser").then(({ data }) => setAllUsers(data));
  }, []);

  // Fetch doc if editing
  useEffect(() => {
    if (id && editor) {
      api.get(`/docs/${id}`).then(({ data }) => {
        setTitle(data.title || "");
        setVisibility(data.visibility || "public");
        // Support both {userId: ...} and string id in sharedWith
        setSharedWith(
          (data.sharedWith || []).map((u) =>
            typeof u === "string" ? u : String(u.userId || u._id)
          )
        );
        editor.commands.setContent(data.content || "");
        setLoading(false);
      });
    } else if (!id) {
      setLoading(false);
    }
  }, [id, editor]);

  const handleSave = async () => {
    setSaving(true);
    const content = editor.getHTML();
    try {
      const payload = {
        title,
        content,
        visibility,
        sharedWith: visibility === "private" ? sharedWith : [],
      };
      if (id) {
        await api.put(`/docs/${id}`, payload);
      } else {
        await api.post("/docs", payload);
      }
      navigate("/");
    } catch (err) {
      alert("Error saving document");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Document Title"
        className="text-2xl font-semibold border-b-2 border-gray-300 w-full mb-4 focus:outline-none"
      />
      <div className="mb-4 flex gap-4 items-center">
        <label className="font-semibold">Visibility:</label>
        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
        {visibility === "private" && (
          <div style={{ minWidth: 250 }}>
            <label className="block mb-1 font-semibold">
              Share with users:
            </label>
            <Select
              isMulti
              options={allUsers.map((user) => ({
                value: String(user._id),
                label: user.username,
              }))}
              value={allUsers
                .filter((user) =>
                  sharedWith.map(String).includes(String(user._id))
                )
                .map((user) => ({
                  value: String(user._id),
                  label: user.username,
                }))}
              onChange={(selected) =>
                setSharedWith(selected.map((option) => option.value))
              }
              placeholder="Select users to share with..."
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
        )}
      </div>
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="prose max-w-full border rounded p-4 min-h-[200px] bg-white"
      />
      <div className="flex justify-end mt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold shadow mr-2 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
        <button
          onClick={() => navigate("/")}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded font-semibold shadow"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DocumentEdit;
