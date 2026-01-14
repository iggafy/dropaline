
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // Expose specific electron APIs if needed in the future
  // For now, Supabase works over standard HTTP/WebSocket so no special bridge is required
});
