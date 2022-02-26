import { useEffect, useState } from "react";

const useKeys = () => {
  const [keys, setKeys] = useState<Record<string, true>>({});

  const onKeyDown = (e: KeyboardEvent) => {
    setKeys({ ...keys, [e.key]: true });
  };

  const onKeyUp = (e: KeyboardEvent) => {
    setKeys((keys) => {
      delete keys[e.key];
      return keys;
    });
  };

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  const isDown = (key: string) => keys[key];
  const isUp = (key: string) => !keys[key];

  return { keys, isDown, isUp };
};

export default useKeys;
