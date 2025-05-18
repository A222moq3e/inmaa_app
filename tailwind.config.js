// tailwind.config.js
module.exports = {
    content: ["./index.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
        "./hooks/**/*.{js,jsx,ts,tsx}",
        
    ],
    presets: [require("nativewind/preset")],
  };
  