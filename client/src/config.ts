const getEnvStr = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw Error(`Missing ${key} env var`);
  }
  return value;
};

export const BASE_SERVER_URL = getEnvStr("REACT_APP_BASE_SERVER_URL");
