import React from "react";
import { Link } from "react-router-dom";
import PageNav from "../components/PageNav";
import AppLayout from "./AppLayout";
import AppNav from "../components/AppNav";

export default function Homepage() {
  return (
    <div>
      <PageNav />
      <AppNav />
      <h1>Wandering Cities</h1>

      <Link to="/app" element={<AppLayout />}>
        Move to app layout
      </Link>
    </div>
  );
}
