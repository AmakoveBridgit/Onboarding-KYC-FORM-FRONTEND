import React, { useEffect, useState } from "react";
import API from "../api/api";

const SubmissionList = () => {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    API.get("submissions/")
      .then((res) => setSubmissions(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Submissions</h1>
      <ul>
        {submissions.map((s) => (
          <li key={s.id}>
            Form: {s.form} | Status: {s.status} | Submitted By: {s.submitted_by}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubmissionList;
