# Frontend WebSocket Integration Audit

**Date:** 2025-01-28  
**Project:** Blast Frontend  
**React Version:** 18.2.0

---

## 1. Build Tool: **CRA (Create React App)**

**Evidence:**
- `react-scripts: 5.0.1` in `package.json`
- Scripts: `react-scripts start/build/test`
- Standard CRA structure with `public/index.html`
- No Vite config found

**Implications:**
- No special WebSocket build config needed
- Standard WebSocket API available (`new WebSocket()`)
- Consider adding `ws` polyfill if targeting older browsers

---

## 2. App-Wide Singletons Location

**Current Setup:**
- **Redux Store:** `src/store/index.js` - Global state management
- **Axios Instance:** `src/utils/axiosInstance.js` - HTTP client singleton
- **Services:** `src/services/` - API service layer (e.g., `AppinfoService.js`)
- **Config:** `src/config/api.js` - API endpoints configuration

**Recommended Location for WebSocket Singleton:**

```
src/services/websocketService.js
```

**Pattern:**
```javascript
// Singleton WebSocket manager
class WebSocketService {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
  }
  
  connect(token) { /* ... */ }
  disconnect() { /* ... */ }
  send(message) { /* ... */ }
}

export default new WebSocketService(); // Singleton export
```

**Alternative:** Use React Context (`src/contexts/WebSocketContext.js`) if you need React lifecycle integration.

---

## 3. Auth State Management

**Current Implementation:**
- **State Management:** Redux Toolkit (`@reduxjs/toolkit`)
- **Store Location:** `src/store/index.js`
- **Auth Slice:** `src/store/slices/userSlice.js`
- **Auth State:**
  ```javascript
  {
    user: null | UserObject,
    isAuthenticated: boolean,
    isLoading: boolean,
    error: null | string
  }
  ```

**Auth Flow:**
1. **App Start:** `index.js` → `AuthGuard` component
2. **Auth Check:** `AuthGuard` dispatches `fetchCurrentUser()` on mount
3. **Login:** `Login` component → `loginUser()` thunk → JWT cookie set
4. **State Update:** Redux store updated → `isAuthenticated: true`

**Token Storage:**
- JWT stored in HTTP-only cookie (`access_token`)
- Cookie sent automatically with `withCredentials: true`
- Token accessible via `document.cookie` or cookie library

**Accessing Auth State:**
```javascript
// In components
const { user, isAuthenticated } = useSelector(state => state.user);
const token = getCookie('access_token'); // For WebSocket connection
```

---

## 4. Best Lifecycle Moment to Open Socket

**Recommended: After Authentication Confirmation**

**Option 1: In AuthGuard (Recommended)**
```javascript
// src/components/auth/AuthGuard.js
useEffect(() => {
  if (isAuthenticated && user) {
    // Open WebSocket connection
    const token = getCookie('access_token');
    websocketService.connect(token);
    
    return () => {
      websocketService.disconnect();
    };
  }
}, [isAuthenticated, user]);
```

**Option 2: In Login Component (After Login)**
```javascript
// src/components/auth/Login.js
useEffect(() => {
  if (isLoggedIn && userId) {
    const token = getCookie('access_token');
    websocketService.connect(token);
  }
}, [isLoggedIn, userId]);
```

**Option 3: Custom Hook (Most Flexible)**
```javascript
// src/hooks/useWebSocket.js
export const useWebSocket = () => {
  const { isAuthenticated, user } = useSelector(state => state.user);
  
  useEffect(() => {
    if (isAuthenticated && user) {
      const token = getCookie('access_token');
      websocketService.connect(token);
      
      return () => websocketService.disconnect();
    }
  }, [isAuthenticated, user]);
};
```

**Timeline:**
```
App Start
  ↓
index.js renders <AuthGuard />
  ↓
AuthGuard mounts → fetchCurrentUser() dispatched
  ↓
[Loading state]
  ↓
fetchCurrentUser fulfilled → isAuthenticated: true
  ↓
✅ OPEN WEBSOCKET HERE (when isAuthenticated && user exist)
  ↓
Login component renders appropriate app (AdminApp/ManagerApp/etc.)
```

**Why This Moment:**
- ✅ User is confirmed authenticated
- ✅ JWT token is available in cookie
- ✅ User object exists (can get user_id for channel subscription)
- ✅ Happens once per session (not on every route change)
- ✅ Clean disconnect on logout (when `isAuthenticated` becomes false)

---

## Implementation Checklist

- [ ] Create `src/services/websocketService.js` singleton
- [ ] Add WebSocket connection logic with JWT token from cookie
- [ ] Integrate in `AuthGuard` or create `useWebSocket` hook
- [ ] Handle reconnection on disconnect
- [ ] Clean up on logout (dispatch `logoutUser` → disconnect socket)
- [ ] Add WebSocket message handlers (dispatch to Redux if needed)
- [ ] Test connection lifecycle (login → connect, logout → disconnect)

---

## Quick Start Example

```javascript
// src/services/websocketService.js
import { getCookie } from '../utils/cookies'; // You'll need to create this

class WebSocketService {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect(token) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    const wsUrl = `ws://localhost:8000/ws/notifications/?token=${token}`;
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Handle message (dispatch to Redux, show notification, etc.)
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
      // Auto-reconnect logic here if needed
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  send(message) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }
}

export default new WebSocketService();
```

```javascript
// src/components/auth/AuthGuard.js (add to existing)
import websocketService from '../../services/websocketService';

// Inside AuthGuard component:
useEffect(() => {
  if (isAuthenticated && user) {
    const token = getCookie('access_token');
    if (token) {
      websocketService.connect(token);
    }
    
    return () => {
      websocketService.disconnect();
    };
  }
}, [isAuthenticated, user]);
```

---

**Report Generated:** 2025-01-28  
**Auditor:** Senior React Engineer

