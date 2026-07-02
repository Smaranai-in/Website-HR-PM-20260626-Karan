import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Award,
  Brain,
  ArrowRight,
  Users,
  Trophy,
  TrendingUp,
  Sparkles,
  BookOpen,
  Code,
  GraduationCap,
  Star,
  Lightbulb,
  Clock,
  Mail,
  MessageCircle,
  MessageSquare,
} from "lucide-react";
import Login from "./Login";
import SignUp from "./SignUp";
import SignUpOtp from "./SignUpOtp";
import ForgotEmail from "./ForgotEmail";
import ForgotOtpVerify from "./ForgotOtpVerify";
import { useAuthModal } from "../context/AuthModalContext";
import { useNavigate } from "react-router-dom";
import {
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaYoutube,
} from "react-icons/fa";
import { supabase } from "../supabaseClient";

const Home = () => {
  const { user, activePage, setActivePage, } = useAuthModal();

  // Store email to pass between pages
  const [signupEmail, setSignupEmail] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = () => setActivePage(null);

  const { loadingUser } = useAuthModal();
  const navigate = useNavigate();
const handleContactSubmit = async (e) => {
  e.preventDefault();

  if (!name.trim()) return toast.error("Name is required");
  if (!email.trim()) return toast.error("Email is required");
  if (!description.trim()) return toast.error("Message is required");

  try {
    setLoading(true);
if (!user) {
  return toast.error("Please login first");
}
    const {
  data: { session },
} = await supabase.auth.getSession();

if (!session) {
  throw new Error("Please login again");
}

const response = await fetch(
  `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/w_edge`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      action: "create_contact_message",

      name: name.trim(),
      email: email.trim(),
      message: description.trim(),
    }),
  }
);

const result = await response.json();

if (!response.ok) {
  throw new Error(result.error);
}

    toast.success("Message sent successfully");

    setName("");
    setEmail("");
    setDescription("");
  } catch (err) {
    toast.error(err.message);
  } finally {
    setLoading(false);
  }
};


  const renderPage = () => {
    switch (activePage) {
      case "login":
        return (
          <Login
            onClose={handleClose}
            onSignup={() => setActivePage("signup")}
            onForgot={() => setActivePage("forgot")}
          />
        );

      case "signup":
        return (
          <SignUp
            email={signupEmail}
            setemail={setSignupEmail}
            onClose={handleClose}
            onSubmit={() => setActivePage("login")}
            onLogin={() => setActivePage("login")}
          />
        );

      case "forgot":
        return (
          <ForgotEmail
            email={forgotEmail}
            setemail={setForgotEmail}
            onClose={handleClose}
            onSubmit={() => setActivePage("login")}
          />
        );

      case "forgotverify":
        return (
          <ForgotOtpVerify
            email={forgotEmail}
            onClose={handleClose}
            onSubmit={() => setActivePage("login")}
          />
        );

      default:
        return null;
    }
  };





  // Smooth Scroll Function
  const scrollToSection = (id, offset = 100) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative overflow-hidden px-8 pt-14  bg-white dark:bg-[#0A0F2C] transition-all duration-700">
      {/* 🎨 Confined Hero Gradient Mesh */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        {/* Soft glowing mesh */}
        <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[140%] bg-[radial-gradient(circle_at_30%_40%,rgba(0,255,180,0.3)_0%,transparent_70%),radial-gradient(circle_at_80%_20%,rgba(0,200,255,0.25)_0%,transparent_65%),radial-gradient(circle_at_50%_90%,rgba(80,255,200,0.25)_0%,transparent_75%)] blur-3xl"></div>

        {/* White center glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.9)_0%,transparent_70%)] opacity-70"></div>

        {/* Subtle vignette for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_80%,rgba(0,0,0,0.05)_100%)] opacity-10"></div>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        {/* ========= LEFT CONTENT ========= */}
        <div id="home" className="space-y-8 relative">
          {/* 🔰 SmaranAI Logo + tagline */}

          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-50 text-emerald-700 font-medium shadow-md border border-emerald-100 mt-12">
            <Brain className="w-4 h-4 text-emerald-600" />
            Your Academic Success Partner
          </div>

          <h1 className="text-[3.8rem] md:text-[4rem] font-semibold leading-[1.1] tracking-tight text-[#0D1B2A] drop-shadow-sm">
            <span className="block text-[#0D1B2A] dark:text-white">
              Unlock Your
            </span>

            <span className="block bg-gradient-to-r from-[#00A884] via-[#00C6B1] to-[#00D4FF] text-transparent bg-clip-text">
              Potential
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-gray-600 dark:text-gray-300 text-[1.1rem] max-w-lg leading-relaxed">
            Transform your academic journey with expert guidance in Research,
            Projects, and AI/Data Science. We provide comprehensive support from
            concept to publication.
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={() => scrollToSection("services", 120)}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-xl hover:scale-[1.03] transition-all"
            >
              Explore Services <ArrowRight size={18} />
            </button>

            <button
              onClick={() => scrollToSection("contact", 120)}
              className="flex items-center gap-2 bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-200 px-6 py-3 rounded-xl font-medium border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg hover:scale-[1.03] transition-all"
            >
              Get in Touch →
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-8 mt-12">
            {[
              {
                icon: <Users className="w-7 h-7 text-emerald-500 mb-2" />,
                value: "500+",
                label: "Students Helped",
              },
              {
                icon: <Trophy className="w-7 h-7 text-emerald-500 mb-2" />,
                value: "50+",
                label: "Projects Done",
              },
              {
                icon: <TrendingUp className="w-7 h-7 text-emerald-500 mb-2" />,
                value: "98%",
                label: "Success Rate",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center bg-white dark:bg-[#0E1835]/90 rounded-2xl p-8 
      shadow-[0_10px_25px_rgba(0,0,0,0.05),0_4px_35px_rgba(20,200,160,0.15)] 
      dark:shadow-[0_10px_25px_rgba(0,255,200,0.05),0_4px_35px_rgba(0,255,200,0.1)] 
      transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,255,180,0.25)]"
              >
                {item.icon}
                <p className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">
                  {item.value}
                </p>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ========= RIGHT IMAGE ========= */}
        <div className="relative flex justify-center items-center">
          <div className="relative w-full max-w-lg">
            {/* Glow background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/60 via-cyan-100/40 to-transparent rounded-3xl blur-2xl"></div>

            {/* Robot Image */}
            <img
              src={process.env.PUBLIC_URL + "/robot.png"}
              alt="AI Robot"
              className="rounded-[2rem] w-full h-[500px] object-cover object-center relative z-10 shadow-[0_25px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_60px_rgba(0,255,200,0.05)]"
            />

            {/* Floating badges */}
            <div className="absolute top-6 right-6 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 z-20">
              <Award className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Award Winning
              </span>
            </div>

            <div className="absolute bottom-6 left-6 bg-white dark:bg-slate-800 rounded-2xl px-4 py-2 shadow-lg flex items-center gap-2 z-20">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                98% Success
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========= OUR SERVICES SECTION ========= */}
      <div id="services" className="max-w-7xl mx-auto mt-32 text-center">
        {/* Tag */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-50 text-emerald-700 font-medium shadow-md border border-emerald-100 mb-4">
          <Star className="w-4 h-4 text-emerald-600" />
          Our Services
        </div>

        {/* Heading */}
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Comprehensive Academic Support
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-16">
          Everything you need to excel in your academic journey
        </p>

        {/* Services Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              title: "Research Support",
              route: "/ResearchSupport",
              desc: "Comprehensive guidance from topic selection to publication for your academic research endeavors.",
              features: [
                "Topic Selection & Literature Review",
                "Methodology & Data Collection",
                "Statistical Analysis & Manuscript Prep",
              ],
              icon: <BookOpen className="w-6 h-6 text-white" />,
              img: process.env.PUBLIC_URL + "/research.jpg",
              gradient: "from-emerald-500/70 to-teal-600/70",
            },
            {
              title: "Industrial / Academic Projects",
              route: "/AcademicProjects",
              desc: "Expert mentorship for university projects to ensure quality output and skill development.",
              features: [
                "Conceptualization & Planning",
                "Code Review & Optimization",
                "Report Writing & Presentation",
              ],
              icon: <Code className="w-6 h-6 text-white" />,
              img: process.env.PUBLIC_URL + "/projects.jpg",
              gradient: "from-cyan-500/70 to-blue-600/70",
            },
            {
              title: "GenAI/DS Micro Courses",
              route: "/courses",
              desc: "Bite-sized practical courses to upskill quickly — perfect for busy students and professionals.",
              features: [
                "Data Analysis with Python",
                "Machine Learning Basics",
                "Prompt Engineering & RAG",
              ],
              icon: <GraduationCap className="w-6 h-6 text-white" />,
              img: process.env.PUBLIC_URL + "/courses.jpg",
              gradient: "from-indigo-500/70 to-blue-700/70",
            },
          ].map((service, index) => (
            <div
              key={index}
              onClick={() => {
                if (!user) {
                  setActivePage("login");
                  return;
                }
                navigate(service.route);
              }}
              className="cursor-pointer rounded-3xl overflow-hidden shadow-md bg-white dark:bg-[#0E1835]/90
             hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative"
            >
              {/* Background Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={service.img}
                  alt={service.title}
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.gradient}`}
                ></div>

                {/* Icon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {service.icon}
                </div>

                {/* Popular Tag */}
                <span className="absolute bottom-4 right-4 text-xs font-medium bg-white/25 text-white px-3 py-1 rounded-full backdrop-blur-md">
                  🔥 Popular
                </span>
              </div>

              {/* Content */}
              <div className="p-6 text-left">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {service.title} →
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {service.desc}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feat, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* ========= TECHNOLOGY STACK SECTION ========= */}
        <div id="TechStack" className="max-w-7xl mx-auto mt-32 text-center">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-50 text-emerald-700 font-medium shadow-md border border-emerald-100 mb-4">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Our Technology Stack
          </div>

          {/* Heading */}
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Powered by Cutting-Edge AI
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-16">
            Leveraging the latest advances in artificial intelligence and
            machine learning
          </p>

          {/* Tech Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                title: "Deep Learning",
                desc: "Neural networks that understand and adapt to your learning style",
                iconColor: "from-sky-400 to-blue-500",
                icon: <Brain className="w-6 h-6 text-white drop-shadow-lg" />,
              },
              {
                title: "NLP Models",
                desc: "Advanced language models for intelligent content generation",
                iconColor: "from-emerald-400 to-teal-500",
                icon: (
                  <BookOpen className="w-6 h-6 text-white drop-shadow-lg" />
                ),
              },
              {
                title: "GPU Computing",
                desc: "High-performance processing for real-time AI assistance",
                iconColor: "from-violet-500 to-purple-600",
                icon: <Code className="w-6 h-6 text-white drop-shadow-lg" />,
              },
              {
                title: "AI Automation",
                desc: "Smart automation for research and project workflows",
                iconColor: "from-pink-500 to-fuchsia-500",
                icon: <Award className="w-6 h-6 text-white drop-shadow-lg" />,
              },
            ].map((tech, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white dark:bg-[#0E1835]/90 p-8 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 text-left group"
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tech.iconColor} flex items-center justify-center mb-5 shadow-lg`}
                >
                  {tech.icon}
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-500 transition-colors">
                  {tech.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {tech.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* ========= TESTIMONIALS SECTION ========= */}
        <div id="testimonials" className="max-w-7xl mx-auto mt-32 text-center">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-50 text-purple-700 font-medium shadow-md border border-purple-100 mb-4">
            <Sparkles className="w-4 h-4 text-purple-500" />
            Testimonials
          </div>

          {/* Heading */}
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            What Our Students Say
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-16">
            Real stories from students who achieved their goals with SmaranAI
          </p>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                gradient: "from-pink-500 to-fuchsia-500",
                quote:
                  "SmaranAI helped me publish my first research paper! The guidance was exceptional and the mentors were always available.",
                name: "Priya Sharma",
                role: "M.Tech Student",
                img: process.env.PUBLIC_URL + "/student1.jpg",
              },
              {
                gradient: "from-emerald-500 to-teal-500",
                quote:
                  "The project mentoring was outstanding. I learned more in 3 months than I did in 2 years. Highly recommend!",
                name: "Rahul Kumar",
                role: "B.Tech Final Year",
                img: process.env.PUBLIC_URL + "/student2.jpg",
              },
              {
                gradient: "from-blue-500 to-indigo-500",
                quote:
                  "The GenAI micro courses are perfect for working professionals. Concise, practical, and immediately applicable!",
                name: "Ananya Reddy",
                role: "Data Science Aspirant",
                img: process.env.PUBLIC_URL + "/student3.jpg",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="relative bg-white dark:bg-[#0E1835]/90 rounded-3xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden"
              >
                {/* Gradient top border */}
                <div
                  className={`h-1.5 w-full bg-gradient-to-r ${t.gradient}`}
                ></div>

                {/* Card Content */}
                <div className="p-8 text-left">
                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    {Array(5)
                      .fill(0)
                      .map((_, j) => (
                        <svg
                          key={j}
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 .587l3.668 7.568L24 9.753l-6 5.847 1.416 8.27L12 18.896l-7.416 4.974L6 15.6 0 9.753l8.332-1.598z" />
                        </svg>
                      ))}
                  </div>

                  {/* Quote icon */}
                  <div
                    className={`w-9 h-9 rounded-lg bg-gradient-to-br ${t.gradient} flex items-center justify-center mb-5`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h.01M15 12h.01M12 12h.01M7 8h10M7 16h10M4 6h16"
                      />
                    </svg>
                  </div>

                  {/* Quote */}
                  <p className="italic text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                    “{t.quote}”
                  </p>

                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <img
                      src={t.img}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {t.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* ========= INTERNSHIP CALL-TO-ACTION SECTION ========= */}
        <div id="internship" className="max-w-5xl mx-auto mt-32 mb-24">
          <div className="bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-3xl shadow-lg text-center text-white py-20 px-8 relative overflow-hidden">
            {/* Floating Icon */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-md">
              <Lightbulb className="w-7 h-7 text-white" />
            </div>

            {/* Title */}
            <h2 className="text-4xl font-semibold mb-4 mt-8">
              Join Our Internship Program
            </h2>
            <p className="text-white/90 text-lg max-w-2xl mx-auto leading-relaxed">
              Gain hands-on experience and work on real-world projects with our
              expert team. Apply now to kickstart your career in AI and Data
              Science.
            </p>

            {/* Buttons */}
            <div className="flex justify-center gap-4 mt-10">
              <button
                onClick={() => {
                  if (!user) {
                    setActivePage("login");

                    return;
                  }
                  navigate("/internapplication");
                }}
                className="bg-white text-emerald-600 font-medium px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                Apply Now <ArrowRight size={18} />
              </button>
              <button className="border border-white/80 text-white font-medium px-6 py-3 rounded-xl hover:bg-white/20 transition-all flex items-center gap-2">
                Learn More
              </button>
            </div>

            {/* Features Row */}
            <div className="flex flex-wrap justify-center gap-6 mt-10 text-white/90">
              {[
                { icon: <Clock className="w-5 h-5" />, text: "3–6 Months" },
                { icon: <Users className="w-5 h-5" />, text: "Limited Seats" },
                { icon: <Award className="w-5 h-5" />, text: "Certificate" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-5 py-2.5 rounded-xl text-sm font-medium border border-white/20 shadow-sm"
                >
                  {item.icon}
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* ========= CONTACT / GET IN TOUCH SECTION ========= */}
        <div id="contact" className="max-w-7xl mx-auto mt-32 mb-24 text-center">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-50 text-emerald-700 font-medium shadow-md border border-emerald-100 mb-4">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Get In Touch
          </div>

          {/* Heading */}
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Let's Start Your Journey
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-16">
            Have questions? We're here to help you succeed.
          </p>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-[#0E1835]/90 rounded-2xl shadow-md p-8 text-left border-t-4 border-emerald-400 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <Mail className="w-6 h-6 text-emerald-500" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Send Us a Message
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Fill out the form and we'll get back to you within 24 hours.
              </p>

              {/* --- Send Message Form --- */}
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-emerald-400 outline-none"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-emerald-400 outline-none"
                />
                <textarea
                  placeholder="Your Message"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-emerald-400 outline-none"
                ></textarea>

                <button
                  type="submit"
                  disabled={loading || !user} // ⬅ user must exist
                  className="w-full bg-emerald-500 text-white font-medium px-5 py-3 rounded-lg 
             hover:bg-emerald-600 transition-all flex justify-center items-center gap-2
             disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    "Sending..."
                  ) : !user ? (
                    "Login to send message"
                  ) : (
                    <>
                      Send Message <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* --- WhatsApp Contact --- */}
            <div className="bg-white dark:bg-[#0E1835]/90 rounded-2xl shadow-md p-8 text-left border-t-4 border-teal-400 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <MessageCircle className="w-6 h-6 text-teal-500" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Connect on WhatsApp
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Chat with us directly for instant support
              </p>
              <div className="bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/10 rounded-2xl p-8 mb-6 flex justify-center items-center shadow-inner">
                <MessageSquare className="w-12 h-12 text-teal-500" />
              </div>
              <button
                onClick={() =>
                  window.open("https://wa.me/919999999999", "_blank")
                }
                className="w-full border border-teal-500 text-teal-600 font-medium px-5 py-3 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all flex justify-center items-center gap-2"
              >
                <MessageCircle size={18} /> Chat on WhatsApp
              </button>
            </div>

            {/* --- AI Bot Image --- */}
            <div className="col-span-1 md:col-span-1">
              <img
                src={process.env.PUBLIC_URL + "/ai-bot.jpg"}
                alt="AI Bot Assistant"
                className="w-full rounded-2xl shadow-lg object-cover"
              />
            </div>

            {/* --- Email Section --- */}
            <div className="bg-white dark:bg-[#0E1835]/90 rounded-2xl shadow-md p-8 text-left border-t-4 border-emerald-400 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="w-6 h-6 text-emerald-500" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Email Us
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We typically respond within 24 hours
                </p>
              </div>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=admin@SmaranAI.in"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl px-6 py-4 flex items-center justify-between text-emerald-700 dark:text-emerald-400 font-medium shadow-inner hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all"
              >
                admin@SmaranAI.in <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* ========= FOOTER SECTION ========= */}
        <footer className="mt-32 border-t border-gray-700 bg-[#ffffff] dark:bg-[#0b0f17] py-16 dark:text-gray-300">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-gray-300">
            {/* BRAND INFO */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-emerald-400 font-semibold text-xl">
                    SmaranAI
                  </h2>
                  <p className="text-gray-400 text-sm dark:text-gray-500">
                    Excellence in Education
                  </p>
                </div>
              </div>

              <p className="text-gray-400 dark:text-gray-500 leading-relaxed">
                Empowering students to achieve academic excellence through
                expert guidance and innovative learning solutions.
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-4 mt-6">
                {[
                  { icon: <FaLinkedin />, link: "https://linkedin.com" },
                  { icon: <FaTwitter />, link: "https://twitter.com" },
                  { icon: <FaInstagram />, link: "https://instagram.com" },
                  { icon: <FaFacebook />, link: "https://facebook.com" },
                  { icon: <FaYoutube />, link: "https://youtube.com" },
                ].map((item, i) => (
                  <a
                    key={i}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#1E2A3A] dark:bg-[#101826] hover:bg-[#243447] dark:hover:bg-[#172033]
                 flex items-center justify-center transition text-white"
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>

         {/* QUICK LINKS */}
<div>
  <h3 className="font-semibold text-white dark:text-gray-200 mb-4 text-lg">
    Quick Links
  </h3>

  <ul className="space-y-3 text-sm">
    <li>
      <button
        onClick={() => scrollToSection("home")}
        className="hover:text-emerald-400 transition cursor-pointer"
      >
        Home
      </button>
    </li>

    <li>
      <button
        onClick={() => scrollToSection("services")}
        className="hover:text-emerald-400 transition cursor-pointer"
      >
        Services
      </button>
    </li>

    <li>
      <Link
        to="/courses"
        className="hover:text-emerald-400 transition"
      >
        Courses
      </Link>
    </li>

    <li>
      <Link
        to="/AboutPage"
        className="hover:text-emerald-400 transition"
      >
        About Us
      </Link>
    </li>

    <li>
      <button
        onClick={() => scrollToSection("contact")}
        className="hover:text-emerald-400 transition cursor-pointer"
      >
        Contact
      </button>
    </li>

    <li>
      <button
        onClick={() => scrollToSection("internship")}
        className="hover:text-emerald-400 transition cursor-pointer"
      >
        Apply Internship
      </button>
    </li>
  </ul>
</div>
            {/* CONTACT INFO */}
            <div>
              <h3 className="font-semibold text-white dark:text-gray-200 mb-4 text-lg">
                Contact Us
              </h3>
              <ul className="space-y-3 text-sm text-gray-400 dark:text-gray-500">
                <li>Academic Innovation Center, Kerala, India</li>
                <li>📞 +91 71504 34590</li>
                <li>✉️ admin@SmaranAI.in</li>
              </ul>
            </div>

            {/* STAY UPDATED */}
            <div>
              <h3 className="font-semibold text-white dark:text-gray-200 mb-4 text-lg">
                Stay Updated
              </h3>
              <p className="text-gray-400 dark:text-gray-500 mb-4 text-sm">
                Subscribe for the latest updates & insights.
              </p>

              <div className="flex items-center bg-[#162032] dark:bg-[#101826] rounded-xl overflow-hidden border border-gray-700 dark:border-gray-600">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-transparent px-4 py-3 w-full outline-none text-gray-300 dark:text-gray-400"
                />
                <button className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white px-5 py-3 text-sm font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* BOTTOM FOOTER */}
          <div className="mt-14 border-t border-gray-700 dark:border-gray-600 pt-6 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-6 text-sm text-gray-500 dark:text-gray-400">
            <p>© 2025 SmaranAI. All rights reserved.</p>
            <p>
              Made with <span className="text-red-500">❤️</span> for students
            </p>
          </div>
        </footer>
      </div>
      {activePage && (
        <div className="fixed top-[40px] right-[30px] z-[9999]">
          <div className="mt-2">{renderPage()}</div>
        </div>
      )}


    </section>
  );
};

export default Home;
