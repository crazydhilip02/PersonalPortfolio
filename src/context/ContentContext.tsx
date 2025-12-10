import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, auth } from '../config/firebase';
import {
    doc,
    onSnapshot,
    updateDoc,
    setDoc,
    collection,
    addDoc,
    deleteDoc
} from 'firebase/firestore';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, setPersistence, inMemoryPersistence } from 'firebase/auth';

// --- Default/Fallback Data ---
import project1 from '../components/sections/images/project1.png';
import profileImage from '../components/sections/images/20250602_1651_Hacker-Themed Portrait_remix_01jwr5xmx0e5mrpedeczjj9hhm.png';

const INITIAL_ABOUT = {
    title: "Architecting Secure Digital Experiences",
    bio: "I am not just a developer; I am a digital architect who bridges the gap between robust engineering and impenetrable security. With expertise spanning the MERN Stack and Java Full Stack ecosystems, I build applications that are not only high-performing but also inherently secure by design.",
    taglines: ["Cybersecurity Enthusiast", "Full Stack Developer", "Problem Solver"],
    profileImage: profileImage,
    stats: [
        { value: '20+', label: 'Projects Deployed' },
        { value: '100%', label: 'Secure Code' },
    ]
};

const INITIAL_HERO = {
    title: "Full Stack Developer",
    subtitle: "Architecting Secure Digital Experiences",
    description: "I craft secure, elegant code and build cutting-edge applications. Specializing in full-stack development and system architecture.",
    socialLinks: {
        github: "https://github.com/crazydhilip02",
        linkedin: "https://www.linkedin.com/in/dhilipkumar03",
        instagram: "https://www.instagram.com/crazy_dhilip2/",
        whatsapp: "https://wa.me/6374106956"
    },
    resumeLink: "#"
};

const INITIAL_CONTACT = {
    email: "dhilip637410@gmail.com",
    phone: "+91 6374106956",
    location: "Avadi, Chennai",
    whatsapp: "6374106956",
    mapLink: "#"
};

// --- Context Definition ---

interface ContentContextType {
    projects: any[];
    skills: any[];
    about: any;
    hero: any;
    experience: any;
    contact: any;
    categories: any[];
    theme: { primary: string, secondary: string, accent: string };
    services: any[];

    updateProjects: (data: any[]) => Promise<void>;
    updateSkills: (data: any[]) => Promise<void>;
    updateAbout: (data: any) => Promise<void>;
    updateHero: (data: any) => Promise<void>;
    updateExperience: (data: any) => Promise<void>;
    updateContact: (data: any) => Promise<void>;
    updateTheme: (data: { primary: string, secondary: string, accent: string }) => Promise<void>;

    // Services
    addService: (data: any) => Promise<void>;
    updateService: (id: string, updates: any) => Promise<void>;
    deleteService: (id: string) => Promise<void>;

    // Appointments
    appointments: any[];
    addAppointment: (data: any) => Promise<boolean>;
    deleteAppointment: (id: string) => Promise<void>;

    // Skills Extensions
    addSkillCategory: (title: string) => Promise<void>;
    deleteSkillCategory: (title: string) => Promise<void>;
    addSkill: (categoryTitle: string, skill: { name: string, level: number, link?: string }) => Promise<void>;
    deleteSkill: (categoryTitle: string, skillName: string) => Promise<void>;

    // Project CRUD
    addProject: (project: any) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
    updateProject: (id: string, updates: any) => Promise<void>;

    // Category CRUD
    addCategory: (category: { name: string }) => Promise<void>;
    updateCategory: (id: string, updates: { name: string }) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    reorderCategories: (newOrder: any[]) => Promise<void>;

    isAuthenticated: boolean;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [projects, setProjects] = useState<any[]>([]);
    const [skills, setSkills] = useState<any[]>([]);

    // Hero Data
    const [hero, setHero] = useState<any>(INITIAL_HERO);

    const [about, setAbout] = useState(INITIAL_ABOUT);
    const [experience, setExperience] = useState<any>({ work: [], education: [], certifications: [] });
    const [contact, setContact] = useState(INITIAL_CONTACT);
    const [categories, setCategories] = useState<any[]>([]);
    const [theme, setTheme] = useState({ primary: '#00FFFF', secondary: '#FF00FF', accent: '#39FF14' });
    const [appointments, setAppointments] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // 1. Auth Listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // 2. Data Listeners (Real-time)
    useEffect(() => {
        // Projects
        const unsubProjects = onSnapshot(collection(db, 'projects'), (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Sort by createdAt desc
            data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            console.log(`📊 Firestore: Loaded ${data.length} projects from database`);
            setProjects(data);
        });

        // Single Doc Sections
        const unsubAbout = onSnapshot(doc(db, 'content', 'about'), (doc) => {
            if (doc.exists()) setAbout(doc.data() as any);
        });

        const unsubHero = onSnapshot(doc(db, 'content', 'hero'), (doc) => {
            if (doc.exists()) setHero(doc.data());
        });

        const unsubExp = onSnapshot(doc(db, 'content', 'experience'), (doc) => {
            if (doc.exists()) setExperience(doc.data());
        });

        const unsubContact = onSnapshot(doc(db, 'content', 'contact'), (doc) => {
            if (doc.exists()) setContact(doc.data() as any);
        });

        // Skills
        const unsubSkills = onSnapshot(doc(db, 'content', 'skills'), (doc) => {
            if (doc.exists()) {
                const skillsData = doc.data().categories || [];
                console.log(`🎯 Firestore: Loaded ${skillsData.length} skill categories from database`);
                setSkills(skillsData);
            } else {
                console.log("⚠️ Firestore: No skills document found");
            }
        });

        // Categories
        const unsubCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
            const categoriesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            categoriesData.sort((a: any, b: any) => (a.order ?? 999) - (b.order ?? 999));
            setCategories(categoriesData);
        });

        // Theme
        const unsubTheme = onSnapshot(doc(db, 'content', 'theme'), (doc) => {
            if (doc.exists()) {
                const data = doc.data() as any;
                setTheme(data);
            }
        });

        // Appointments
        const unsubAppointments = onSnapshot(collection(db, 'appointments'), (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            data.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            setAppointments(data);
        });

        // Services
        const unsubServices = onSnapshot(collection(db, 'services'), (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            data.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
            setServices(data);
        });

        return () => {
            unsubProjects();
            unsubAbout();
            unsubHero();
            unsubExp();
            unsubContact();
            unsubSkills();
            unsubCategories();
            unsubTheme();
            unsubAppointments();
            unsubServices();
        };
    }, []);

    // Theme injection effect
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--primary', theme.primary);
        root.style.setProperty('--secondary', theme.secondary);
        root.style.setProperty('--tertiary', theme.accent); // Mapping accent to tertiary variable in CSS
    }, [theme]);

    // --- Update Functions ---

    const updateProjects = async (data: any[]) => {
        console.warn("Bulk updateProjects not used directly.");
    };

    const addProject = async (project: any) => {
        await addDoc(collection(db, 'projects'), project);
    };

    const deleteProject = async (id: string) => {
        await deleteDoc(doc(db, 'projects', id));
    };

    const updateProject = async (id: string, updates: any) => {
        await setDoc(doc(db, 'projects', id), updates, { merge: true });
    };

    // Category CRUD
    const addCategory = async (category: { name: string }) => {
        await addDoc(collection(db, 'categories'), category);
    };

    const updateCategory = async (id: string, updates: { name: string }) => {
        await setDoc(doc(db, 'categories', id), updates, { merge: true });
    };

    const deleteCategory = async (id: string) => {
        await deleteDoc(doc(db, 'categories', id));
    };

    const reorderCategories = async (newOrder: any[]) => {
        setCategories(newOrder);
        try {
            await Promise.all(newOrder.map((cat, index) =>
                updateDoc(doc(db, 'categories', cat.id), { order: index })
            ));
        } catch (error) {
            console.error("Failed to reorder items", error);
        }
    };

    // For single-doc sections
    const updateAbout = async (data: any) => {
        setAbout(data);
        await setDoc(doc(db, 'content', 'about'), data, { merge: true });
    };

    const updateHero = async (data: any) => {
        setHero(data);
        await setDoc(doc(db, 'content', 'hero'), data, { merge: true });
    };

    const updateExperience = async (data: any) => {
        setExperience(data);
        await setDoc(doc(db, 'content', 'experience'), data, { merge: true });
    };

    const updateContact = async (data: any) => {
        setContact(data);
        await setDoc(doc(db, 'content', 'contact'), data, { merge: true });
    };

    const updateTheme = async (data: { primary: string, secondary: string, accent: string }) => {
        setTheme(data);
        await setDoc(doc(db, 'content', 'theme'), data, { merge: true });
    };

    const addAppointment = async (data: any) => {
        try {
            await addDoc(collection(db, 'appointments'), {
                ...data,
                timestamp: new Date().toISOString(),
                status: 'pending'
            });
            return true;
        } catch (e: any) {
            console.error("Error booking appointment:", e);
            return false;
        }
    };

    const deleteAppointment = async (id: string) => {
        await deleteDoc(doc(db, 'appointments', id));
    };

    // --- Services CRUD ---
    const addService = async (data: any) => {
        await addDoc(collection(db, 'services'), {
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
    };

    const updateService = async (id: string, updates: any) => {
        await updateDoc(doc(db, 'services', id), {
            ...updates,
            updatedAt: new Date().toISOString()
        });
    };

    const deleteService = async (id: string) => {
        await deleteDoc(doc(db, 'services', id));
    };

    const updateSkills = async (data: any[]) => {
        await setDoc(doc(db, 'content', 'skills'), { categories: data }, { merge: true });
    };

    // --- Skill Management ---

    const addSkillCategory = async (title: string) => {
        const newCategories = [...skills, { title, skills: [] }];
        setSkills(newCategories);
        await updateSkills(newCategories);
    };

    const addSkill = async (categoryTitle: string, skill: { name: string, level: number, link?: string }) => {
        const newCategories = skills.map(cat => {
            if (cat.title === categoryTitle) {
                return { ...cat, skills: [...cat.skills, skill] };
            }
            return cat;
        });
        setSkills(newCategories);
        await updateSkills(newCategories);
    };

    const deleteSkill = async (categoryTitle: string, skillName: string) => {
        const newCategories = skills.map(cat => {
            if (cat.title === categoryTitle) {
                return { ...cat, skills: cat.skills.filter((s: any) => s.name !== skillName) };
            }
            return cat;
        });
        setSkills(newCategories);
        await updateSkills(newCategories);
    };

    const deleteSkillCategory = async (title: string) => {
        const newCategories = skills.filter(cat => cat.title !== title);
        setSkills(newCategories);
        await updateSkills(newCategories);
    };

    // --- Auth Wrappers ---
    const login = async (email: string, pass: string) => {
        await setPersistence(auth, inMemoryPersistence);
        await signInWithEmailAndPassword(auth, email, pass);
    };

    const logout = async () => {
        await signOut(auth);
    };

    return (
        <ContentContext.Provider value={{
            projects,
            skills,
            about,
            hero,
            experience,
            contact,
            categories,
            theme,
            services,
            updateProjects,
            updateSkills,
            updateAbout,
            updateHero,
            updateExperience,
            updateContact,
            updateTheme,
            addService,
            updateService,
            deleteService,
            appointments,
            addAppointment,
            deleteAppointment,
            addProject,
            deleteProject,
            updateProject,
            addCategory,
            updateCategory,
            deleteCategory,
            reorderCategories,
            addSkillCategory,
            deleteSkillCategory,
            addSkill,
            deleteSkill,
            isAuthenticated,
            login,
            logout,
            loading
        }}>
            {children}
        </ContentContext.Provider>
    );
};

export const useContent = () => {
    const context = useContext(ContentContext);
    if (context === undefined) {
        throw new Error('useContent must be used within a ContentProvider');
    }
    return context;
};
