import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function FormDetails() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [data, setData] = useState({});
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    async function fetchForm() {
      try {
        const res = await axios.get(`https://amak.pythonanywhere.com/api/forms/forms/${id}/`);
        
        const normalizedSchema = {
          ...res.data,
          schema: {
            fields: res.data.schema.fields.map((field) => ({
              ...field,
              name: field.key || field.name,
              type: field.type === "select" ? "dropdown" : field.type,
            })),
          },
        };

        setForm(normalizedSchema);
      } catch (err) {
        setError("Failed to load form.");
      } finally {
        setLoading(false);
      }
    }
    fetchForm();
  }, [id]);

  const handleChange = (fieldName, value) => {
    setData((prev) => ({ ...prev, [fieldName]: value }));
    setValidationErrors((prev) => ({ ...prev, [fieldName]: "" }));
  };

  const handleFileChange = (fieldName, fileList) => {
    setFiles((prev) => ({ ...prev, [fieldName]: fileList }));
    setValidationErrors((prev) => ({ ...prev, [fieldName]: "" }));
  };

  const validateForm = () => {
    let errors = {};
    form.schema.fields.forEach((field) => {
      if (field.required && !data[field.name] && !files[field.name]) {
        errors[field.name] = "This field is required";
      }
    });
    console.log("Validation errors:", errors);
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🟢 Submit button clicked");
    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    if (!validateForm()) {
      console.warn("Form validation failed");
      setSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("form", form.id);
    formData.append("form_version", form.version);
    formData.append("form_snapshot", JSON.stringify(form.schema));
    formData.append("data", JSON.stringify(data));

    Object.keys(files).forEach((fieldKey) => {
      Array.from(files[fieldKey]).forEach((file) => {
        formData.append("files", file);
        formData.append("file_field_keys", fieldKey);
      });
    });

    try {
      const res = await axios.post(
        "https://amak.pythonanywhere.com/api/forms/submissions/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("✅ Response from backend:", res.data);

      if (res.status === 201 || res.data.message) {
        setSuccessMessage("Form submitted successfully!");
        setData({});
        setFiles({});
      } else {
        setError("Unexpected response from server.");
      }
    } catch (err) {
      console.error("❌ Submission failed:", err);
      setError("Failed to submit form. Check console for details.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading form...</p>;
  if (error && !form) return <p className="text-danger text-center mt-5">{error}</p>;

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <h2 className="text-center text-success mb-3">{form?.name}</h2>
        <p className="text-muted text-center">{form?.description}</p>
        <hr />

        {successMessage && (
          <div className="alert alert-success text-center">{successMessage}</div>
        )}

        {error && <div className="alert alert-danger text-center">{error}</div>}

        <form onSubmit={handleSubmit}>
          {form.schema.fields.map((field, idx) => {
            const fieldKey = field.name || `field_${idx}`;
            const errorMsg = validationErrors[fieldKey];

            return (
              <div key={fieldKey} className="mb-3">
                <label className="form-label">
                  {field.label}
                  {field.required && <span className="text-danger">*</span>}
                </label>

                {/* Render input based on type */}
                {field.type === "text" && (
                  <input
                    type="text"
                    className="form-control"
                    value={data[fieldKey] || ""}
                    onChange={(e) => handleChange(fieldKey, e.target.value)}
                  />
                )}

                {field.type === "number" && (
                  <input
                    type="number"
                    className="form-control"
                    value={data[fieldKey] || ""}
                    onChange={(e) => handleChange(fieldKey, e.target.value)}
                  />
                )}

                {field.type === "date" && (
                  <input
                    type="date"
                    className="form-control"
                    value={data[fieldKey] || ""}
                    onChange={(e) => handleChange(fieldKey, e.target.value)}
                  />
                )}

                {field.type === "textarea" && (
                  <textarea
                    className="form-control"
                    rows="3"
                    value={data[fieldKey] || ""}
                    onChange={(e) => handleChange(fieldKey, e.target.value)}
                  />
                )}

                {field.type === "dropdown" && (
                  <select
                    className="form-control"
                    value={data[fieldKey] || ""}
                    onChange={(e) => handleChange(fieldKey, e.target.value)}
                  >
                    <option value="">Select...</option>
                    {field.options &&
                      field.options.map((opt, i) => (
                        <option key={i} value={opt.value || opt}>
                          {opt.label || opt}
                        </option>
                      ))}
                  </select>
                )}

                {field.type === "radio" && (
                  <div>
                    {field.options?.map((opt, i) => (
                      <div key={i} className="form-check">
                        <input
                          type="radio"
                          className="form-check-input"
                          name={fieldKey}
                          value={opt.value || opt}
                          checked={data[fieldKey] === (opt.value || opt)}
                          onChange={(e) => handleChange(fieldKey, e.target.value)}
                        />
                        <label className="form-check-label">
                          {opt.label || opt}
                        </label>
                      </div>
                    ))}
                  </div>
                )}

                {field.type === "checkbox" && (
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={!!data[fieldKey]}
                      onChange={(e) => handleChange(fieldKey, e.target.checked)}
                    />
                    <label className="form-check-label">{field.label}</label>
                  </div>
                )}

                {field.type === "file" && (
                  <input
                    type="file"
                    className="form-control"
                    multiple
                    onChange={(e) => handleFileChange(fieldKey, e.target.files)}
                  />
                )}

                {errorMsg && (
                  <small className="text-danger d-block mt-1">{errorMsg}</small>
                )}
              </div>
            );
          })}

          <div className="text-center">
            <button
              type="submit"
              className="btn btn-success mt-3 px-4"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Form"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormDetails;
