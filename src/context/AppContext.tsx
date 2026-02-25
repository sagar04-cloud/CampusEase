import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Request = {
    id: string;
    title: string;
    type: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'In Progress';
    date: string;
    author: string;
    priority: string;
};

export type Announcement = {
    id: number;
    title: string;
    content: string;
    date: string;
    author: string;
    iconType: string;
    category: string;
    color: string;
    bgColor: string;
    isNew: boolean;
};

export type CampusEvent = {
    id: string;
    title: string;
    date: string;
    end?: string;
    color: string;
};

type AppContextType = {
    requests: Request[];
    updateRequestStatus: (id: string, status: Request['status']) => void;
    addRequest: (request: Request) => void;
    updateRequest: (id: string, updates: Partial<Request>) => void;
    announcements: Announcement[];
    addAnnouncement: (announcement: Announcement) => void;
    updateAnnouncement: (id: number, updates: Partial<Announcement>) => void;
    campusEvents: CampusEvent[];
    addCampusEvent: (event: CampusEvent) => void;
    updateCampusEvent: (id: string, updates: Partial<CampusEvent>) => void;
    removeCampusEvent: (id: string) => void;
};

const defaultRequests: Request[] = [
    { id: 'REQ-042', title: 'Projector Repair - Room 302', type: 'Maintenance', status: 'Pending', date: 'Feb 25, 2026', author: 'Alex Johnson', priority: 'High' },
    { id: 'REQ-041', title: 'Tech Symposium Hall Booking', type: 'Event', status: 'Pending', date: 'Feb 24, 2026', author: 'Computer Science Club', priority: 'Medium' },
    { id: 'REQ-040', title: 'Wi-Fi Issue in Library', type: 'IT Support', status: 'In Progress', date: 'Feb 23, 2026', author: 'Sarah Smith', priority: 'High' },
    { id: 'REQ-039', title: 'Sick Leave Application', type: 'Academic', status: 'Approved', date: 'Feb 20, 2026', author: 'Alex Johnson', priority: 'Low' },
    { id: 'REQ-038', title: 'New Lab Equipment Request', type: 'Procurement', status: 'Rejected', date: 'Feb 15, 2026', author: 'Chemistry Dept', priority: 'Medium' },
];

const defaultAnnouncements: Announcement[] = [
    {
        id: 1,
        title: 'Annual Tech Symposium Registration Open',
        content: 'Registration for the core technical workshops is now open. Seats are limited to 50 students per workshop. Register via the event portal before Feb 28th.',
        date: 'Feb 25, 2026',
        author: 'Prof. Davis / CS Dept',
        iconType: 'Calendar',
        category: 'Events',
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-100',
        isNew: true
    },
    {
        id: 2,
        title: 'Library Database Maintenance',
        content: 'The IEEE and ACM digital libraries will be undergoing scheduled maintenance this weekend. Access will be restored by Sunday 8 PM.',
        date: 'Feb 24, 2026',
        author: 'Library Admin',
        iconType: 'BellRing',
        category: 'System',
        color: 'text-amber-600',
        bgColor: 'bg-amber-100',
        isNew: false
    }
];

const defaultCampusEvents: CampusEvent[] = [
    { id: 'evt-1', title: 'Tech Symposium', date: '2026-02-28', color: '#4f46e5' },
    { id: 'evt-2', title: 'Midterm Exams', date: '2026-03-02', end: '2026-03-06', color: '#dc2626' },
    { id: 'evt-3', title: 'Guest Lecture', date: '2026-03-10', color: '#059669' },
];

function useSharedState<T>(key: string, defaultValue: T): [T, (val: T | ((prev: T) => T)) => void] {
    const [state, setState] = useState<T>(() => {
        try {
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : defaultValue;
        } catch {
            return defaultValue;
        }
    });

    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === key && e.newValue) {
                setState(JSON.parse(e.newValue));
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, [key]);

    const setSharedState = (newValue: T | ((prev: T) => T)) => {
        setState((prev) => {
            const updated = typeof newValue === 'function' ? (newValue as (prev: T) => T)(prev) : newValue;
            localStorage.setItem(key, JSON.stringify(updated));
            // Dispatch a custom event so components in the SAME tab also re-render immediately if using other instances
            window.dispatchEvent(new StorageEvent('storage', { key, newValue: JSON.stringify(updated) }));
            return updated;
        });
    };

    return [state, setSharedState];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [requests, setRequests] = useSharedState<Request[]>('campusease_requests', defaultRequests);
    const [announcements, setAnnouncements] = useSharedState<Announcement[]>('campusease_announcements', defaultAnnouncements);
    const [campusEvents, setCampusEvents] = useSharedState<CampusEvent[]>('campusease_events', defaultCampusEvents);

    const updateRequestStatus = (id: string, status: Request['status']) => {
        setRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));
    };

    const addRequest = (request: Request) => {
        setRequests(prev => [request, ...prev]);
    };

    const updateRequest = (id: string, updates: Partial<Request>) => {
        setRequests(prev => prev.map(req => req.id === id ? { ...req, ...updates } : req));
    };

    const addAnnouncement = (announcement: Announcement) => {
        setAnnouncements(prev => [announcement, ...prev]);
    };

    const updateAnnouncement = (id: number, updates: Partial<Announcement>) => {
        setAnnouncements(prev => prev.map(ann => ann.id === id ? { ...ann, ...updates } : ann));
    };

    const addCampusEvent = (event: CampusEvent) => {
        setCampusEvents(prev => [...prev, event]);
    };

    const updateCampusEvent = (id: string, updates: Partial<CampusEvent>) => {
        setCampusEvents(prev => prev.map(evt => evt.id === id ? { ...evt, ...updates } : evt));
    };

    const removeCampusEvent = (id: string) => {
        setCampusEvents(prev => prev.filter(evt => evt.id !== id));
    };

    return (
        <AppContext.Provider value={{
            requests, updateRequestStatus, addRequest, updateRequest,
            announcements, addAnnouncement, updateAnnouncement,
            campusEvents, addCampusEvent, updateCampusEvent, removeCampusEvent
        }}>
            {children}
        </AppContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
