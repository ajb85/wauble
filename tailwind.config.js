/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      keyframes: {
        shake: {
          "0%": { transform: "translate(1px, 1px) rotate(0deg)" },
          "10%": { transform: "translate(-1px, -2px) rotate(-1deg)" },
          "20%": { transform: "translate(-3px, 0px) rotate(1deg)" },
          "30%": { transform: "translate(3px, 2px) rotate(0deg)" },
          "40%": { transform: "translate(1px, -1px) rotate(1deg)" },
          "50%": { transform: "translate(-1px, 2px) rotate(-1deg)" },
          "60%": { transform: "translate(-3px, 1px) rotate(0deg)" },
          "70%": { transform: "translate(3px, 1px) rotate(-1deg)" },
          "80%": { transform: "translate(-1px, -1px) rotate(1deg)" },
          "90%": { transform: "translate(1px, 2px) rotate(0deg)" },
          "100%": { transform: "translate(1px, -2px) rotate(-1deg)" },
        },
      },
      animation: {
        "shake-text": "shake 0.5s linear infinite",
      },
      colors: {
        background: "rgb(var(--color-background)  / <alpha-value>)",
        text: "rgb(var(--color-text)  / <alpha-value>)",
        errors: "rgb(var(--color-errors)  / <alpha-value>)",
        correctGuessBackground:
          "rgb(var(--color-correctGuessBackground)  / <alpha-value>)",
        incorrectGuessBackground:
          "rgb(var(--color-incorrectGuessBackground)  / <alpha-value>)",
        inWordGuessBackground:
          "rgb(var(--color-inWordGuessBackground)  / <alpha-value>)",
        correctGuessText: "rgb(var(--color-correctGuessText)  / <alpha-value>)",
        incorrectGuessText:
          "rgb(var(--color-incorrectGuessText)  / <alpha-value>)",
        inWordGuessText: "rgb(var(--color-inWordGuessText)  / <alpha-value>)",
        noGuessBackground:
          "rgb(var(--color-noGuessBackground)  / <alpha-value>)",
        noGuessText: "rgb(var(--color-noGuessText)  / <alpha-value>)",
        submitButtonBackground:
          "rgb(var(--color-submitButtonBackground)  / <alpha-value>)",
        deleteButtonBackground:
          "rgb(var(--color-deleteButtonBackground)  / <alpha-value>)",
        cancelButtonBackground:
          "rgb(var(--color-cancelButtonBackground)  / <alpha-value>)",
        submitButtonText: "rgb(var(--color-submitButtonText)  / <alpha-value>)",
        deleteButtonText: "rgb(var(--color-deleteButtonText)  / <alpha-value>)",
        cancelButtonText: "rgb(var(--color-cancelButtonText)  / <alpha-value>)",
        submitButtonBorder:
          "rgb(var(--color-submitButtonBorder)  / <alpha-value>)",
        deleteButtonBorder:
          "rgb(var(--color-deleteButtonBorder)  / <alpha-value>)",
        cancelButtonBorder:
          "rgb(var(--color-cancelButtonBorder)  / <alpha-value>)",
      },
    },
    fontFamily: {
      logo: "'Bungee Outline', cursive",
      sans: "'Roboto', sans-serif",
    },
  },
  plugins: [require("tw-elements/dist/plugin")],
};
