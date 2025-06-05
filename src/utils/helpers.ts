// Scroll to top helper function
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// Add type/class animation effect
export const typeAnimation = (element: HTMLElement, text: string, speed = 50) => {
  let i = 0;
  const timer = setInterval(() => {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
    } else {
      clearInterval(timer);
    }
  }, speed);
  
  return timer;
};

// Add data for skills, experience, etc.
export const skillsData = {
  languages: [
    { name: "JavaScript", level: 90 },
    { name: "TypeScript", level: 85 },
    { name: "Python", level: 80 },
    { name: "C++", level: 70 },
    { name: "Java", level: 65 },
  ],
  frameworks: [
    { name: "React", level: 90 },
    { name: "Vue.js", level: 75 },
    { name: "Angular", level: 65 },
    { name: "Node.js", level: 85 },
    { name: "Express", level: 80 },
  ],
  other: [
    { name: "AWS", level: 70 },
    { name: "Docker", level: 75 },
    { name: "CI/CD", level: 70 },
    { name: "Security", level: 85 },
    { name: "UX/UI", level: 65 },
  ]
};

// Format date helper
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

// Throttle function for performance optimization
export const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean;
  return function(this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Debounce function for performance optimization
export const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function(this: any, ...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// Get random item from array
export const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Random number between min and max
export const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};