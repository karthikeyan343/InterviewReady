export const authInputSx = {
  "& .MuiOutlinedInput-root": {
    height: {
      xs: "37px",
      sm: "38px",
      md: "39px",
    },
    borderRadius: "7px",
    fontFamily: '"Manrope", sans-serif',

    "& fieldset": {
      borderColor: "#d5deeb",
      borderWidth: "1px",
    },

    "&:hover fieldset": {
      borderColor: "#b8c8dc",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#1769e8",
    },
  },

  "& .MuiInputBase-input": {
    fontFamily: '"Manrope", sans-serif',
    fontSize: {
      xs: "11px",
      sm: "12px",
      md: "13px",
    },
    fontWeight: 500,
    color: "#17244b",

    "&::placeholder": {
      color: "#8a9bb7",
      opacity: 1,
    },
  },
};

export const loginInputSx = {
  "& .MuiOutlinedInput-root": {
    height: "42px",
    borderRadius: "7px",
    fontFamily: '"Manrope", sans-serif',

    "& fieldset": {
      borderColor: "#d5deeb",
      borderWidth: "1px",
    },

    "&:hover fieldset": {
      borderColor: "#b8c8dc",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#1769e8",
    },
  },

  "& .MuiInputBase-input": {
    fontFamily: '"Manrope", sans-serif',
    fontSize: { xs: "11px", sm: "12px", md: "13px" },
    fontWeight: 500,
    color: "#17244b",

    "&::placeholder": {
      color: "#8a9bb7",
      opacity: 1,
    },
  },
};
