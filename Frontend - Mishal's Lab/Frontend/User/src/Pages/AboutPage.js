import React, { useEffect, useState } from "react";
import { Star, Award, Users, Target, Zap, Heart } from "lucide-react";

/**
 * Optimized AboutPage
 *
 * ✅ Uses fallback data if APIs are missing
 * ✅ Uses dynamic hero.bannerImage with DEFAULT_BANNER
 * ✅ Keeps your design, gradients, testimonials & sections
 * ✅ Safer mapping & fallbacks
 */

const DEFAULT_BANNER = process.env.PUBLIC_URL + "/mission-full.jpeg";
// Optional background accent for testimonials (put something similar in public if you want)
const TESTIMONIAL_BG = process.env.PUBLIC_URL + "/about-pattern.png";

export default function AboutPage() {
  const [hero, setHero] = useState(null);
  const [missionVision, setMissionVision] = useState(null);
  const [story, setStory] = useState([]);
  const [values, setValues] = useState([]);
  const [team, setTeam] = useState([]);
  const [stats, setStats] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Safe fetch helper
  const fetchSafe = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("network");
      return await res.json();
    } catch {
      return null;
    }
  };

  useEffect(() => window.scrollTo(0, 0), []);
  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);

      const [
        heroRes,
        mvRes,
        storyRes,
        valuesRes,
        teamRes,
        statsRes,
        /* whyRes (unused) */,
        testiRes,
      ] = await Promise.all([
        fetchSafe("/api/about/hero"),
        fetchSafe("/api/about/mission-vision"),
        fetchSafe("/api/about/story"),
        fetchSafe("/api/about/values"),
        fetchSafe("/api/about/team"),
        fetchSafe("/api/about/stats"),
        fetchSafe("/api/about/why-us"),
        fetchSafe("/api/about/testimonials"),
      ]);

      if (!mounted) return;

      // HERO
      setHero(
        heroRes ?? {
          title: "Revolutionizing Academic Support with AI-Driven Solutions",
          subtitle:
            "SmaranAI empowers students and researchers with practical research guidance, project mentorship, and hands-on AI learning.",
          bannerImage: DEFAULT_BANNER,
          buttonText: "Discover Our Story",
        }
      );

      // MISSION & VISION
      setMissionVision(
        mvRes ?? {
          missionHeading: "Our Mission",
          missionDescription:
            "To support students with learning, project guidance, research help, and internship preparation through practical mentorship and tools.",
          visionHeading: "Our Vision",
          visionDescription:
            "To create a supportive, AI-augmented environment where every learner can grow and succeed.",
        }
      );

      // STORY / TIMELINE
      setStory(
        Array.isArray(storyRes) && storyRes.length
          ? storyRes
          : [
            {
              year: "2021",
              title: "Founded",
              description:
                "SmaranAI launched to help students with projects and research.",
            },
            {
              year: "2022",
              title: "100+ Students",
              description:
                "Guided students through research and internships.",
            },
            {
              year: "2023",
              title: "Platform Growth",
              description:
                "Added AI courses and mentorship programs.",
            },
          ]
      );

      // VALUES – ensure at least 4 cards
      const defaultValues = [
        {
          title: "Excellence",
          description: "High-quality learning support.",
        },
        {
          title: "Innovation",
          description: "AI-driven educational tools.",
        },
        {
          title: "Collaboration",
          description: "Working closely with learners.",
        },
        {
          title: "Growth",
          description: "Helping students level up.",
        },
      ];

      let finalValues =
        Array.isArray(valuesRes) && valuesRes.length
          ? valuesRes
          : defaultValues;

      // Ensure at least 4 items (pad with defaults if needed)
      if (finalValues.length < 4) {
        finalValues = [...finalValues, ...defaultValues].slice(0, 4);
      }

      setValues(finalValues);

      // TEAM
      setTeam(
        Array.isArray(teamRes) && teamRes.length
          ? teamRes
          : [
            {
              name: "Ganesh Lagad",
              role: "Founder & Lead Mentor",
              image: process.env.PUBLIC_URL + "/student1.jpg",
            },
            {
              name: "AI Mentors",
              role: "Research & Project Guides",
              image: process.env.PUBLIC_URL + "/student2.jpg",
            },
            {
              name: "Technical Team",
              role: "Developers & AI Engineers",
              image: process.env.PUBLIC_URL + "/student3.jpg",
            },
          ]
      );

      // STATS
      setStats(
        statsRes ?? {
          clients: 500,
          experience: 3,
          projects: 150,
          ratings: "4.9/5",
        }
      );

      // TESTIMONIALS
      setTestimonials(
        Array.isArray(testiRes) && testiRes.length
          ? testiRes
          : [
            {
              name: "Priya Sharma",
              role: "M.Tech Student",
              review:
                "SmaranAI helped me publish my first research paper! The guidance was exceptional and the mentors were always available.",
              image: process.env.PUBLIC_URL + "/student1.jpg",
              rating: 5,
              gradient: "from-pink-500 to-fuchsia-500",
            },
            {
              name: "Rahul Kumar",
              role: "B.Tech Final Year",
              review:
                "The project mentoring was outstanding. I learned more in 3 months than I did in 2 years. Highly recommend!",
              image: process.env.PUBLIC_URL + "/student2.jpg",
              rating: 5,
              gradient: "from-emerald-500 to-teal-500",
            },
            {
              name: "Ananya Reddy",
              role: "Data Science Aspirant",
              review:
                "The GenAI micro courses are perfect for working professionals. Concise, practical, and immediately applicable!",
              image: process.env.PUBLIC_URL + "/student3.jpg",
              rating: 5,
              gradient: "from-blue-500 to-indigo-500",
            },
          ]
      );

      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Small helper components
  const Reveal = ({ children, className = "" }) => {
    const ref = React.useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      const ob = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
            ob.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      if (ref.current) ob.observe(ref.current);
      return () => ob.disconnect();
    }, []);

    return (
      <div
        ref={ref}
        className={`${className} transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
      >
        {children}
      </div>
    );
  };

  const SectionTitle = ({ title, children, subtitle }) => {
    const heading = title ?? children;
    return (
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          {heading}
        </h2>
        {subtitle && (
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    );
  };

  const bgImages = [process.env.PUBLIC_URL + "/mentors.jpg", process.env.PUBLIC_URL + "/ai.jpg", process.env.PUBLIC_URL + "/planning.jpg"];

  if (loading && !hero) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020c1b]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020c1b] transition-colors duration-300 font-sans overflow-x-hidden">

      {/* HERO SECTION */}
      <div className="pt-32 pb-20 px-6 md:px-12 bg-white dark:bg-[#0A0F2C] border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">

          <div className="w-full md:w-1/2 space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-semibold mb-2">
              <Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
              <span>Innovating Education</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {hero?.title}
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              {hero?.subtitle}
            </p>

            <div className="pt-4">
              <a
                href="#story"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-lg shadow-emerald-500/20 transform hover:-translate-y-1"
              >
                {hero?.buttonText ?? "Discover Our Story"}
              </a>
            </div>
          </div>

          <div className="w-full md:w-1/2 relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
              <img
                src={hero?.bannerImage || DEFAULT_BANNER}
                alt="About SmaranAI"
                className="w-full h-[400px] object-cover transform transition duration-700 group-hover:scale-105"
              />
            </div>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24 space-y-32">

        {/* STATS SECTION */}
        <Reveal>
          <div className="bg-white dark:bg-[#0E1835] rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 p-10 md:p-14">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100 dark:divide-slate-800">
              {[
                { value: stats?.clients, label: "Happy Students", icon: Users },
                { value: stats?.projects, label: "Projects Completed", icon: Target },
                { value: stats?.experience, label: "Years Experience", icon: Zap },
                { value: stats?.ratings, label: "Average Rating", icon: Star },
              ].map((stat, i) => (
                <div key={i} className="text-center px-4 first:pl-0 last:pr-0 border-none md:border-solid">
                  <div className="flex justify-center mb-3 text-emerald-500 dark:text-emerald-400">
                    <stat.icon className="w-8 h-8" />
                  </div>
                  <div className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-1">
                    {stat.value}{i !== 3 && "+"}
                  </div>
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* MISSION & VISION */}
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-gradient-to-br from-emerald-50 to-white dark:from-[#0f172a] dark:to-[#1e293b] p-10 rounded-3xl border border-emerald-100 dark:border-slate-700 shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200 dark:bg-emerald-900/20 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-emerald-300 dark:group-hover:bg-emerald-800/30"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{missionVision?.missionHeading}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                  {missionVision?.missionDescription}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-[#0f172a] dark:to-[#1e293b] p-10 rounded-3xl border border-indigo-100 dark:border-slate-700 shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200 dark:bg-indigo-900/20 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-indigo-300 dark:group-hover:bg-indigo-800/30"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{missionVision?.visionHeading}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                  {missionVision?.visionDescription}
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* STORY TIMELINE */}
        <Reveal>
          <div id="story">
            <SectionTitle
              title="Our Journey"
              subtitle="From a small idea to a leading platform for academic excellence."
            />

            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-slate-200 dark:bg-slate-800 hidden md:block rounded-full"></div>

              <div className="space-y-12">
                {story.map((s, idx) => (
                  <div key={idx} className={`flex flex-col md:flex-row items-center justify-between ${idx % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>

                    {/* Content Box */}
                    <div className="w-full md:w-[45%] bg-white dark:bg-[#112240] p-8 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700 relative hover:-translate-y-1 transition-transform duration-300">
                      <span className="text-5xl font-bold text-slate-100 dark:text-slate-800 absolute top-4 right-6 -z-0 select-none">
                        {s.year}
                      </span>
                      <div className="relative z-10">
                        <div className="text-sm font-bold text-emerald-500 mb-2">{s.year}</div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{s.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400">{s.description}</p>
                      </div>
                    </div>

                    {/* Center Dot */}
                    <div className="w-4 h-4 bg-emerald-500 rounded-full border-4 border-white dark:border-[#020c1b] shadow-lg z-10 hidden md:block"></div>

                    {/* Spacer for opposite side */}
                    <div className="w-full md:w-[45%] hidden md:block"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* CORE VALUES */}
        <Reveal>
          <div>
            <SectionTitle title="Our Core Values" subtitle="The principles that guide everything we do." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v, i) => (
                <div key={i} className="bg-white dark:bg-[#112240] p-8 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all text-center group">
                  <div className="w-16 h-16 mx-auto bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 transition-colors">
                    <Heart className="w-7 h-7 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{v.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* TEAM SECTION */}
        <Reveal>
          <div className="bg-slate-100 dark:bg-[#0b1628] rounded-[3rem] p-12 md:p-20">
            <SectionTitle title="Meet The Team" subtitle="The passionate individuals behind SmaranAI." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {team.map((member, i) => (
                <div key={i} className="group text-center">
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-emerald-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-40 h-40 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-lg relative z-10 transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{member.name}</h3>
                  <p className="text-emerald-600 dark:text-emerald-400 font-medium">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* TESTIMONIALS */}
        <Reveal>
          <div className="mb-10">
            <SectionTitle title="Student Success Stories" subtitle="See how we've helped students achieve their academic dreams." />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-white dark:bg-[#112240] p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-lg hover:-translate-y-1 transition-transform duration-300 flex flex-col h-full">

                  <div className="flex gap-1 mb-6">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 mb-8 flex-grow leading-relaxed italic">
                    "{t.review}"
                  </p>

                  <div className="flex items-center gap-4 mt-auto">
                    <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover border dark:border-slate-600" />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{t.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

      </div>
    </div>
  );
}