import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../firebase';
import { ref, onValue, set, push, update, remove, get } from 'firebase/database';

// ─── Types ────────────────────────────────────────────────────────────────────

export type Request = {
    id: string;
    title: string;
    type: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'In Progress';
    date: string;
    author: string;
    priority: string;
    studentEmail?: string; // Track who made the request
    timestamp: number;
};

export type Announcement = {
    id: string;
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
    description?: string;
};

export type Notification = {
    id: string;
    title: string;
    message: string;
    timestamp: number;
    isRead: boolean;
    type: 'success' | 'info' | 'warning' | 'error';
    recipientEmail: string; // Target user
};

// ─── Context Type ─────────────────────────────────────────────────────────────

type AppContextType = {
    requests: Request[];
    loadingRequests: boolean;
    updateRequestStatus: (id: string, status: Request['status']) => void;
    addRequest: (request: Omit<Request, 'id' | 'timestamp'>) => void;
    updateRequest: (id: string, updates: Partial<Request>) => void;

    announcements: Announcement[];
    loadingAnnouncements: boolean;
    addAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;
    updateAnnouncement: (id: string, updates: Partial<Announcement>) => void;
    deleteAnnouncement: (id: string) => void;

    campusEvents: CampusEvent[];
    loadingEvents: boolean;
    addCampusEvent: (event: Omit<CampusEvent, 'id'>) => void;
    updateCampusEvent: (id: string, updates: Partial<CampusEvent>) => void;
    removeCampusEvent: (id: string) => void;

    notifications: Notification[];
    loadingNotifications: boolean;
    addNotification: (notif: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
    markNotificationAsRead: (id: string) => void;
    markAllNotificationsAsRead: (email: string) => void;
};

// ─── Context ──────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loadingRequests, setLoadingRequests] = useState(true);

    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);

    const [campusEvents, setCampusEvents] = useState<CampusEvent[]>([]);
    const [loadingEvents, setLoadingEvents] = useState(true);

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loadingNotifications, setLoadingNotifications] = useState(true);

    // ── Subscribe to Requests ──────────────────────────────────────────────────
    useEffect(() => {
        const unsubscribe = onValue(ref(db, 'requests'), (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const list: Request[] = Object.entries(data).map(([key, val]) => ({
                    ...(val as Omit<Request, 'id'>),
                    id: key,
                }));
                setRequests(list.reverse());
            } else {
                setRequests([]);
            }
            setLoadingRequests(false);
        });
        return () => unsubscribe();
    }, []);

    // ── Subscribe to Announcements ─────────────────────────────────────────────
    useEffect(() => {
        const unsubscribe = onValue(ref(db, 'announcements'), (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const list: Announcement[] = Object.entries(data).map(([key, val]) => ({
                    ...(val as Omit<Announcement, 'id'>),
                    id: key,
                }));
                setAnnouncements(list.reverse());
            } else {
                setAnnouncements([]);
            }
            setLoadingAnnouncements(false);
        });
        return () => unsubscribe();
    }, []);

    // ── Subscribe to CampusEvents ──────────────────────────────────────────────
    useEffect(() => {
        const unsubscribe = onValue(ref(db, 'campusEvents'), (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const list: CampusEvent[] = Object.entries(data).map(([key, val]) => ({
                    ...(val as Omit<CampusEvent, 'id'>),
                    id: key,
                }));
                setCampusEvents(list);
            } else {
                setCampusEvents([]);
            }
            setLoadingEvents(false);
        });
        return () => unsubscribe();
    }, []);

    // ── Subscribe to Notifications ─────────────────────────────────────────────
    useEffect(() => {
        const unsubscribe = onValue(ref(db, 'notifications'), (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const list: Notification[] = Object.entries(data).map(([key, val]) => ({
                    ...(val as Omit<Notification, 'id'>),
                    id: key,
                }));
                setNotifications(list.sort((a, b) => b.timestamp - a.timestamp));
            } else {
                setNotifications([]);
            }
            setLoadingNotifications(false);
        });
        return () => unsubscribe();
    }, []);

    // ── Requests API ──────────────────────────────────────────────────────────

    const addRequest = (requestData: Omit<Request, 'id' | 'timestamp'>) => {
        push(ref(db, 'requests'), {
            ...requestData,
            timestamp: Date.now()
        });
    };

    const updateRequestStatus = async (id: string, status: Request['status']) => {
        await update(ref(db, `requests/${id}`), { status });
        
        // Notify the student
        const snap = await get(ref(db, `requests/${id}`));
        if (snap.exists()) {
            const req = snap.val() as Request;
            if (req.studentEmail) {
                addNotification({
                    title: `Request ${status}`,
                    message: `Your request "${req.title}" has been ${status.toLowerCase()}.`,
                    recipientEmail: req.studentEmail,
                    type: status === 'Approved' ? 'success' : status === 'Rejected' ? 'error' : 'info'
                });
            }
        }
    };

    const updateRequest = (id: string, updates: Partial<Request>) => {
        update(ref(db, `requests/${id}`), updates);
    };

    // ── Announcements API ─────────────────────────────────────────────────────

    const addAnnouncement = (announcement: Omit<Announcement, 'id'>) => {
        push(ref(db, 'announcements'), announcement);
    };

    const updateAnnouncement = (id: string, updates: Partial<Announcement>) => {
        update(ref(db, `announcements/${id}`), updates);
    };

    const deleteAnnouncement = (id: string) => {
        remove(ref(db, `announcements/${id}`));
    };

    // ── Campus Events API ─────────────────────────────────────────────────────

    const addCampusEvent = (event: Omit<CampusEvent, 'id'>) => {
        push(ref(db, 'campusEvents'), event);
    };

    const updateCampusEvent = (id: string, updates: Partial<CampusEvent>) => {
        update(ref(db, `campusEvents/${id}`), updates);
    };

    const removeCampusEvent = (id: string) => {
        remove(ref(db, `campusEvents/${id}`));
    };

    // ── Notifications API ─────────────────────────────────────────────────────

    const addNotification = (notif: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
        push(ref(db, 'notifications'), {
            ...notif,
            timestamp: Date.now(),
            isRead: false
        });
    };

    const markNotificationAsRead = (id: string) => {
        update(ref(db, `notifications/${id}`), { isRead: true });
    };

    const markAllNotificationsAsRead = async (email: string) => {
        const unread = notifications.filter(n => n.recipientEmail === email && !n.isRead);
        const updates: Record<string, any> = {};
        unread.forEach(n => {
            updates[`/notifications/${n.id}/isRead`] = true;
        });
        if (Object.keys(updates).length > 0) {
            update(ref(db), updates);
        }
    };

    return (
        <AppContext.Provider value={{
            requests, loadingRequests, updateRequestStatus, addRequest, updateRequest,
            announcements, loadingAnnouncements, addAnnouncement, updateAnnouncement, deleteAnnouncement,
            campusEvents, loadingEvents, addCampusEvent, updateCampusEvent, removeCampusEvent,
            notifications, loadingNotifications, addNotification, markNotificationAsRead, markAllNotificationsAsRead
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

export { set, ref };
