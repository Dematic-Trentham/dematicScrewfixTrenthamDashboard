"use client";
import React, { useEffect, useState } from "react";

import { decodeJWT } from "@/utils/decodeJWT";

import { typeUserVisible } from "@/types/user";
import { set } from "zod";

const useUser = () => {
  const [user, setUser] = useState<typeUserVisible | null>(null);

  useEffect(() => {
    //is this on the client?
    if (typeof window === "undefined") {
      return;
    }

    //listen for storage changes
    const listenStorageChange = () => {
      const user = getUser();

      if (!user) {
        setUser(null);
      }

      setUser(user);
    };

    listenStorageChange();
    window.addEventListener("storage", listenStorageChange);

    return () => {
      window.removeEventListener("storage", listenStorageChange);
    };
  }, []);

  return { user };
};

const getUser = () => {
  //is this on the client?
  if (typeof window === "undefined") {
    return;
  }

  let token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  const user = decodeJWT(token);

  if (user.exp < Date.now() / 1000) {
    localStorage.removeItem("token");

    return null;
  }

  return user;
};

const isLoggedIn = () => {
  const user = getUser();

  if (!user) {
    return false;
  }

  return true;
};

const hasPermission = (permission: string) => {
  const user = getUser();

  if (!user || !user.permissions || typeof user.permissions !== "string") {
    return false;
  }

  const permissions = user.permissions.split(",");

  if (!permissions.includes(permission)) {
    return false;
  }

  return true;
};

export { useUser, getUser, isLoggedIn, hasPermission };
