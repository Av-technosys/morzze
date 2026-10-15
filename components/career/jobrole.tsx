"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoveRight, Upload, X } from "lucide-react";
import GeneralApplicationPopup from "./GeneralApplicationPopup";

type Job = {
  dept: string;
  location: string;
  type: string;
  title: string;
  exp: string;
};

type FieldProps = {
  label: string;
  placeholder: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const jobs: Job[] = [
  {
    dept: "DESIGN",
    location: "Gurugram, Haryana",
    type: "Full-time",
    title: "Designer",
    exp: "5-8 years experience",
  },
  {
    dept: "MARKETING",
    location: "Gurugram, Haryana",
    type: "Full-time",
    title: "Marketing",
    exp: "4-6 years experience",
  },
  {
    dept: "MANUFACTURING",
    location: "Faridabad, Haryana",
    type: "Full-time",
    title: "Manufacturing",
    exp: "3-5 years experience",
  },
  {
    dept: "SALES",
    location: "Mumbai, Maharashtra",
    type: "Full-time",
    title: "Sales",
    exp: "2-4 years experience",
  },
  {
    dept: "CUSTOMER SERVICE",
    location: "Gurugram, Haryana",
    type: "Full-time",
    title: "Customer Service",
    exp: "1-3 years experience",
  },
];

export default function CareersPositionsModal() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applicationOpen, setApplicationOpen] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    portfolio: "",
    coverLetter: "",
  });

  const [resume, setResume] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Resume must be PDF or DOC file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Resume must be under 5MB");
      return;
    }

    setResume(file);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email address is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (formData.phone.trim()) {
      const phoneRegex = /^[0-9+\-\s()]{9,11}$/;

      if (!phoneRegex.test(formData.phone)) {
        setError("Please enter a valid phone number");
        return;
      }
    }

    if (!resume) {
      setError("Resume / CV is required");
      return;
    }

    if (formData.coverLetter.trim().split(/\s+/).length > 500) {
      setError("Cover letter must be under 500 words");
      return;
    }

    if (!selectedJob) {
      setError("Please select a role before submitting");
      return;
    }

    try {
      setLoading(true);

      const dataToSend = new FormData();

      dataToSend.append("jobTitle", selectedJob.title);
      dataToSend.append("fullName", formData.fullName);
      dataToSend.append("phone", formData.phone);
      dataToSend.append("email", formData.email);
      dataToSend.append("portfolio", formData.portfolio);
      dataToSend.append("coverLetter", formData.coverLetter);
      dataToSend.append("resume", resume);

      const response = await fetch("/api/career", {
        method: "POST",
        body: dataToSend,
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Application submitted successfully!");

        setFormData({
          fullName: "",
          phone: "",
          email: "",
          portfolio: "",
          coverLetter: "",
        });

        setResume(null);
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-black text-white">
      <div className="px-4 md:px-8 lg:px-12 py-16 md:py-20 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[10px] uppercase tracking-[0.42em] text-[#7d7d7d] mb-3">
            Let&apos;s Team Up
          </p>
          <h2 className="text-[42px] md:text-[56px] font-semibold tracking-[-0.03em] mb-3">
            All <span className="text-[#d39b10]">Positions</span>
          </h2>
          <p className="text-[14px] text-[#7a7a7a]">5 positions available</p>
        </div>

        <div>
          {jobs.map((job, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              viewport={{ once: true }}
              className="border-t border-[#2b2b2b] py-7 flex flex-col md:flex-row md:items-center md:justify-between gap-5"
            >
              <div>
                <p className="text-[11px] text-[#b97712] tracking-[0.18em] mb-3">
                  {job.dept}{" "}
                  <span className="text-white/60 normal-case tracking-normal">
                    • {job.type}
                  </span>
                </p>
                <h3 className="text-[28px] md:text-[34px] font-medium mb-2">
                  {job.title}
                </h3>
                <p className="text-[13px] text-white/60">{job.exp}</p>
              </div>

              <button
                onClick={() => setSelectedJob(job)}
                className="w-[140px] h-11 rounded-full bg-[#e6aa12] text-black text-[13px] font-medium flex items-center justify-center gap-2 hover:bg-[#d39b10]"
              >
                Apply Now <MoveRight size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-[#121212] px-4 md:px-8 py-16 text-center">
        <p className="text-[10px] uppercase tracking-[0.42em] text-[#7d7d7d] mb-4">
          Don&apos;t See Your Role?
        </p>
        <h3 className="text-[34px] md:text-[44px] font-semibold mb-4">
          Send a General Application
        </h3>
        <p className="text-[14px] text-[#7a7a7a] mb-8">
          We&apos;re always interested in meeting talented people. Drop your
          resume and we&apos;ll be in touch.
        </p>

        <button
          type="button"
          onClick={() => setApplicationOpen(true)}
          className="inline-flex items-center px-10 h-11 bg-[#e6aa12] text-black text-[13px] font-medium"
        >
          Send Application
        </button>
      </div>

      <AnimatePresence>
        {selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-3 md:p-8"
          >
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-5xl bg-[#141414] border border-[#3a3a3a] p-5 md:p-8 relative max-h-[95vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="absolute top-5 right-5 text-white"
              >
                <X />
              </button>

              <h2 className="text-[32px] md:text-[40px] font-medium mb-6">
                {selectedJob.title}
              </h2>
              <p className="text-[20px] mb-8">Apply for this Role</p>

              {error && (
                <div className="mb-6 flex items-center gap-3 rounded-md border border-gray-300 bg-white px-4 py-3 shadow-lg">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-orange-500 text-white font-bold">
                    !
                  </div>
                  <p className="text-sm text-black">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-6 flex items-center gap-3 rounded-md border border-green-500 bg-green-500/10 px-4 py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-green-500 text-white font-bold">
                    ✓
                  </div>
                  <p className="text-sm text-green-400">{success}</p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-5 mb-5">
                <Field
                  label="Full Name *"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Your name"
                />
                <Field
                  label="Phone no."
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="XXXXXXXXXX"
                />
              </div>

              <Field
                label="Email Address *"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
              />

              <Field
                label="Linkedin / Portfolio URL"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                placeholder="Your Linkedin Profile"
              />

              <div className="mt-5">
                <label className="text-[12px] mb-2 block">Resume / CV *</label>

                <label className="h-[120px] border border-[#555555] flex flex-col items-center justify-center text-[#6f6f6f] text-[13px] cursor-pointer">
                  <Upload className="mb-2" />
                  {resume ? resume.name : "PDF or DOC, up to 5MB"}
                  <br />
                  Click to browse
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="mt-5">
                <label className="text-[12px] mb-2 block">
                  Cover letter 500 words
                </label>
                <textarea
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleChange}
                  placeholder="Why are you excited about this role at Morzze ?"
                  className="w-full h-[150px] border border-[#555555] bg-transparent px-4 py-3 text-[14px] outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 mt-6 bg-[#e6aa12] text-black text-[13px] font-semibold"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      <GeneralApplicationPopup
        open={applicationOpen}
        onClose={() => setApplicationOpen(false)}
      />
    </section>
  );
}

function Field({ label, placeholder, name, value, onChange }: FieldProps) {
  return (
    <div className="mt-5">
      <label className="text-[12px] mb-2 block">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-11 border border-[#555555] bg-transparent px-4 text-[14px] outline-none"
      />
    </div>
  );
}
