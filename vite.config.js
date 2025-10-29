import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
<<<<<<< HEAD
      'qgmn5c-5173.csb.app', // 👈 Add your host here
    ],
  },
})
=======
      "qgmn5c-5173.csb.app",
    ],
  },
});
>>>>>>> 65ad9b3bfc0f484c4843ac5a233db0a962b03b08
