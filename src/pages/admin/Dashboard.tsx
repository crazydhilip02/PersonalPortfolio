import React, { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { Briefcase, Layers, User, LogOut, Terminal, FolderOpen } from 'lucide-react';

import ProjectsManager from './managers/ProjectsManager';
import SkillsManager from './managers/SkillsManager';
import ProfileManager from './managers/ProfileManager';
import CategoriesManager from './managers/CategoriesManager';

const Dashboard: React.FC = () => {
    const { logout, projects, skills, addProject, updateSkills } = useContent();
    const [activeTab, setActiveTab] = useState<'projects' | 'skills' | 'categories' | 'profile'>('projects');
    const [initializing, setInitializing] = useState(false);

    const handleInitializeData = async () => {
        setInitializing(true);
        try {
            // Add Projects
            const projectsData = [
                {
                    title: "Women Safety Threat Detection System",
                    description: "AI-powered surveillance platform detecting harassment, abnormal activities, robbery attempts, and distress gestures.",
                    longDescription: "Real-time AI-powered surveillance system that detects harassment, abnormal behaviors, robbery attempts, and distress gestures using CCTV footage. Uses YOLOv8, anomaly detection, and deep learning models to generate alerts with bounding boxes, captured frames, and location metadata for public safety environments.",
                    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1000",
                    tags: ["AI", "Computer Vision", "Safety"],
                    category: "ai",
                    link: "#",
                    github: "#",
                    techStack: ["Python", "YOLOv8", "TensorFlow", "OpenCV", "PyTorch", "Firebase", "Real-time CV"],
                    createdAt: new Date().toISOString()
                },
                {
                    title: "A1 Cooking Hub",
                    description: "Interactive recipe and cooking platform with step-by-step guides, categories, cuisines, and search filters.",
                    longDescription: "Modern cooking and recipe platform featuring category-based browsing, detailed step-by-step cooking instructions, chef tips, cuisine filters, search functionality, and dynamic content management through admin interface. Built for food enthusiasts and home cooks.",
                    image: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80&w=1000",
                    tags: ["React", "Web App", "Food Tech"],
                    category: "development",
                    link: "https://www.a1cookinghub.com/",
                    github: "#",
                    techStack: ["React.js", "Firebase", "Tailwind CSS", "REST APIs"],
                    createdAt: new Date().toISOString()
                }
            ];

            for (const p of projectsData) {
                await addProject(p);
            }

            // Add Skills
            const skillsData = [
                {
                    title: "Frontend Development",
                    skills: [
                        { name: "HTML5", level: 95 },
                        { name: "CSS3", level: 90 },
                        { name: "Tailwind CSS", level: 90 },
                        { name: "JavaScript ES6+", level: 90 },
                        { name: "React.js", level: 95 },
                        { name: "Redux", level: 85 },
                        { name: "TypeScript", level: 85 }
                    ]
                },
                {
                    title: "Backend Development",
                    skills: [
                        { name: "Node.js", level: 85 },
                        { name: "Express.js", level: 85 },
                        { name: "REST APIs", level: 90 },
                        { name: "MongoDB", level: 80 },
                        { name: "Mongoose", level: 80 },
                        { name: "Firebase", level: 85 },
                        { name: "JWT Auth", level: 85 }
                    ]
                },
                {
                    title: "Java Full Stack",
                    skills: [
                        { name: "Java", level: 90 },
                        { name: "OOP", level: 90 },
                        { name: "Spring Boot", level: 85 },
                        { name: "Spring MVC", level: 85 },
                        { name: "Spring Security", level: 80 },
                        { name: "Hibernate", level: 80 },
                        { name: "JPA", level: 80 },
                        { name: "MySQL", level: 85 },
                        { name: "PostgreSQL", level: 80 }
                    ]
                },
                {
                    title: "Tools & DevOps",
                    skills: [
                        { name: "Git", level: 90 },
                        { name: "GitHub", level: 90 },
                        { name: "VS Code", level: 95 },
                        { name: "Postman", level: 85 },
                        { name: "Firebase Hosting", level: 85 },
                        { name: "Vercel", level: 80 },
                        { name: "Render", level: 75 }
                    ]
                }
            ];

            await updateSkills(skillsData);
            console.log("✓ Portfolio data initialized successfully!");
            console.log(`Added ${projectsData.length} projects and ${skillsData.length} skill categories`);
        } catch (err) {
            console.error("Initialization error:", err);
            alert("Failed to initialize data");
        } finally {
            setInitializing(false);
        }
    };

    const totalSkillCount = skills.reduce((sum, cat) => sum + cat.skills.length, 0);

    // Auto-initialize data on first load if empty
    const hasInitialized = React.useRef(false);

    React.useEffect(() => {
        console.log("Dashboard mounted. Projects:", projects.length, "Skills:", skills.length, "Initializing:", initializing, "HasInit:", hasInitialized.current);

        const initializeIfEmpty = async () => {
            // Only run once if both projects and skills are empty and haven't initialized yet
            if (projects.length === 0 && skills.length === 0 && !initializing && !hasInitialized.current) {
                hasInitialized.current = true;
                console.log("🚀 Auto-initializing portfolio data...");
                await handleInitializeData();
            } else {
                console.log("Skipping initialization:", {
                    projectsExist: projects.length > 0,
                    skillsExist: skills.length > 0,
                    initializing,
                    alreadyInitialized: hasInitialized.current
                });
            }
        };

        // Small delay to ensure Firestore listeners have loaded
        const timer = setTimeout(initializeIfEmpty, 2000);
        return () => clearTimeout(timer);
    }, [projects.length, skills.length, initializing]);

    const renderContent = () => {
        switch (activeTab) {
            case 'projects': return <ProjectsManager />;
            case 'skills': return <SkillsManager />;
            case 'categories': return <CategoriesManager />;
            case 'profile': return <ProfileManager />;
            default: return <ProjectsManager />;
        }
    };

    return (
        <div className="min-h-screen bg-black font-sans flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col h-auto md:h-screen sticky top-0 md:fixed z-50">
                <div className="mb-10 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg">
                        <Terminal size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-white font-bold tracking-wider text-sm">DHILIP'S</h1>
                        <h1 className="text-cyan-400 font-bold tracking-wider text-xs">COMMAND CENTER</h1>
                    </div>
                </div>

                <nav className="space-y-2 flex-grow">
                    <button
                        onClick={() => setActiveTab('projects')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'projects'
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                    >
                        <Briefcase size={18} /> Projects
                    </button>
                    <button
                        onClick={() => setActiveTab('skills')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'skills'
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                    >
                        <Layers size={18} /> Skills
                    </button>
                    <button
                        onClick={() => setActiveTab('categories')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'categories'
                            ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                    >
                        <FolderOpen size={18} /> Categories
                    </button>
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'profile'
                            ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                    >
                        <User size={18} /> Profile
                    </button>
                </nav>

                <div className="border-t border-gray-800 pt-6 mt-6">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                    <div className="text-xs text-gray-600 mt-4 text-center">
                        © 2025 Dhilip's Command Center
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow md:ml-64 p-8 relative">
                {/* Bg Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-5xl mx-auto">
                    {/* Welcome Header */}
                    <div className="mb-8 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6">
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Welcome to Dhilip's Command Center
                        </h2>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                            <div className="flex items-center gap-2">
                                <Briefcase size={16} className="text-cyan-400" />
                                <span>{projects.length} Projects</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Layers size={16} className="text-purple-400" />
                                <span>{totalSkillCount} Skills</span>
                            </div>
                        </div>
                        {projects.length === 0 && skills.length === 0 && (
                            <div className="flex gap-3">
                                <button
                                    onClick={handleInitializeData}
                                    disabled={initializing}
                                    className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-lg text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
                                >
                                    {initializing ? 'Initializing...' : '⚡ Initialize Portfolio Data'}
                                </button>
                            </div>
                        )}
                        {projects.length > 0 && (
                            <div className="text-sm text-green-400">
                                ✓ Portfolio data loaded ({projects.length} projects, {totalSkillCount} skills)
                            </div>
                        )}
                        <p className="text-xs text-gray-500 mt-3">
                            Manage your portfolio content below
                        </p>
                    </div>

                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
