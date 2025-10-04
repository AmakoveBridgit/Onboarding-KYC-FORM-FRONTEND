import React, { useEffect, useState } from "react";
import API from "../api/api";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const FormList = () => {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    API.get("forms/")
      .then((res) => setForms(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container py-5">
      {/* Page Header */}
      <div className="text-center mb-5">
        <h1 className="fw-bold text-success">Available Forms</h1>
        <p className="text-muted">
          Choose a form below to get started with your application or onboarding process.
        </p>
      </div>

      {/* Card Grid */}
      <div className="row g-4">
        {forms.length > 0 ? (
          forms.map((form) => (
            <div className="col-md-4" key={form.id}>
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title text-dark fw-semibold">
                      {form.name}
                    </h5>
                    <p className="card-text text-muted small">
                      {form.description || "No description available."}
                    </p>
                  </div>
                  <div className="mt-3 text-end">
                    <Link
                      to={`/forms/${form.id}`}
                      className="btn btn-success btn-sm rounded-pill px-3"
                    >
                      Fill Form
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted mt-3">Loading available forms...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormList;
