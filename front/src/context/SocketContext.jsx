import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/slice/auth.slice';
import toast from 'react-hot-toast';
import { BASE_URL } from '../utils/BASE_URL';

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

// Helper function to decode JWT without library
const decodeJWT = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && user?._id) {
            console.log('Initializing socket connection for user:', user._id);
            
            // Get tokenHash from access token
            const accessToken = localStorage.getItem('accessToken');
            let tokenHash = null;
            
            if (accessToken) {
                const decoded = decodeJWT(accessToken);
                if (decoded) {
                    tokenHash = decoded.tokenHash;
                    console.log('Decoded tokenHash:', tokenHash);
                }
            }
            
            // Create socket connection
            const newSocket = io(BASE_URL, {
                withCredentials: true,
                transports: ['websocket', 'polling']
            });

            newSocket.on('connect', () => {
                console.log('Socket connected:', newSocket.id);
                // Join user's room with tokenHash
                newSocket.emit('join', { userId: user._id, tokenHash });
            });

            newSocket.on('disconnect', () => {
                console.log('Socket disconnected');
            });

            // Listen for session revoked event
            newSocket.on('session-revoked', (data) => {
                console.log('Session revoked event received:', data);
                
                // This event is sent to specific session room, so if we receive it, it's for us
                toast.error('Your session has been terminated from another device');
                dispatch(logout());
                navigate('/login');
            });

            // Listen for logout all devices event
            newSocket.on('logout-all-devices', () => {
                console.log('Logout all devices event received');
                toast.error('You have been logged out from all devices');
                dispatch(logout());
                navigate('/login');
            });

            setSocket(newSocket);

            return () => {
                console.log('Cleaning up socket connection');
                newSocket.disconnect();
            };
        } else {
            // Disconnect socket if user logs out
            if (socket) {
                console.log('User logged out, disconnecting socket');
                socket.disconnect();
                setSocket(null);
            }
        }
    }, [isAuthenticated, user?._id]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
