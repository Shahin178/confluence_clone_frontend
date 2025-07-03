import React from "react";
import DocumentList from "../components/DocumentList";
import PublicDocument from "../components/PublicDocument";

const Home = () => {
  const token = localStorage.getItem("token");
  return token ? <DocumentList /> : <PublicDocument />;
};

export default Home;
