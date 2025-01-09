// 'use client'
import React, { useState } from "react";
import InterviewLink from "./InterviewLink";
import { useToast } from "../context/Toast";

function InterviewForm() {
  const [file, setFile] = useState(null);
  const [updateData, setUpdateData] = useState([]);
  const [resumeText, setResumeText] = useState("");
  const [keyValues, setKeyValues] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    job_title: "",
    resume: null,
    job_description: null,
    years_expriance: "",
  });
  console.log("qwrwer", updateData);
  const [fileNames, setFileNames] = useState({
    resume: "",
    job_description: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [link, setLink] = useState("");
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
      setFileNames((prevNames) => ({
        ...prevNames,
        [name]: files[0].name,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  //   const handleChange = (e) => {
  //     const { name, value, files } = e.target;
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       [name]: files ? files[0] : value,
  //     }));
  //   };
  const handleDeselectFile = (fileName) => {
    setFormData((prevData) => ({
      ...prevData,
      [fileName]: null,
    }));
    setFileNames((prevNames) => ({
      ...prevNames,
      [fileName]: "",
    }));
  };

  const shape = [
    {
      question:
        "Can you describe a complex AWS architecture you designed and implemented for a previous employer and discuss the specific AWS services you used?",
    },
  ];
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    const prompt = `Take this information name: ${formData.name} job titel : ${formData.job_title} years of expiriance ${formData.years_expriance}also Extracted resume text: ${resumeText}\n\nAdditional information: \n\nGenerate 10 interview questions based on the above information.format the response as JSON as a array of objects use this format: ${shape} `;
    const res = await fetch("/api/chatgpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });
    const res2 = await fetch("/api/brain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ occupation: formData }),
    });

    const data = await res.json();
    console.log("zcxawe:--", { ff: data?.questions, res });
    localStorage.setItem("user_data", JSON.stringify(formData));
    setUpdateData(data);
  };

  return (
    <>
      {isSubmitted ? (
        <InterviewLink link={link} />
      ) : (
        <form
          className="max-w-lg mx-auto p-8 space-y-6 bg-white bg-opacity-10 shadow-lg rounded-lg"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block text-white ">Name</label>
            <input
              type="text"
              name="name"
              className="mt-1 p-2 w-full border rounded-md"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-white">Email</label>
            <input
              type="email"
              name="email"
              className="mt-1 p-2 w-full border rounded-md"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          {/* <div>
        <label className="block text-white">Message</label>
        <textarea
          name="message"
          className="mt-1 p-2 w-full border rounded-md"
          value={formData.message}
          onChange={handleChange}
        />
      </div> */}
          <div>
            <label className="block text-white">Job Title</label>
            <input
              type="job_title"
              name="job_title"
              className="mt-1 p-2 w-full border rounded-md"
              value={formData.job_title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-white">Years Of Expiriance</label>
            <input
              type="years_expriance"
              name="years_expriance"
              className="mt-1 p-2 w-full border rounded-md"
              value={formData.years_expriance}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-white">Resume</label>
            <input
              type="file"
              name="resume"
              accept="application/pdf"
              className="mt-1 p-2 w-full border rounded-md"
              // onChange={handleChange}
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
            {fileNames.resume && (
              <div className="mt-2 text-sm text-gray-600">
                Selected file: {fileNames.resume}
                <button
                  type="button"
                  className="ml-2 text-red-600"
                  onClick={() => handleDeselectFile("resume")}
                >
                  X
                </button>
              </div>
            )}
          </div>
          <div>
            <label className="block text-white">Job Discription</label>
            <input
              type="file"
              name="job_description"
              accept="application/pdf"
              className="mt-1 p-2 w-full border rounded-md"
              onChange={handleChange}
              required
            />
            {fileNames.job_description && (
              <div className="mt-2 text-sm text-gray-600">
                Selected file: {fileNames.job_description}
                <button
                  type="button"
                  className="ml-2 text-red-600"
                  onClick={() => handleDeselectFile("job_description")}
                >
                  X
                </button>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Submit
          </button>
        </form>
      )}
    </>
  );
}

export default InterviewForm;
