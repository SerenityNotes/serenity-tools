import sodium from "libsodium-wrappers";
import {
  TrustChainEvent,
  Permission,
  DefaultTrustChainEvent,
  TrustChainState,
} from "./types";

// vendored from https://github.com/erdtman/canonicalize
export const canonicalize = (object: any) => {
  if (object === null || typeof object !== "object") {
    return JSON.stringify(object);
  }

  if (object.toJSON instanceof Function) {
    return canonicalize(object.toJSON());
  }

  if (Array.isArray(object)) {
    const values = object.reduce((t, cv, ci) => {
      const comma = ci === 0 ? "" : ",";
      const value = cv === undefined || typeof cv === "symbol" ? null : cv;
      return `${t}${comma}${canonicalize(value)}`;
    }, "");
    return `[${values}]`;
  }

  const values = Object.keys(object)
    .sort()
    .reduce((t, cv) => {
      if (object[cv] === undefined || typeof object[cv] === "symbol") {
        return t;
      }
      const comma = t.length === 0 ? "" : ",";
      return `${t}${comma}${canonicalize(cv)}:${canonicalize(object[cv])}`;
    }, "");
  return `{${values}}`;
};

export const hashTransaction = (transaction) => {
  return sodium.to_base64(
    sodium.crypto_generichash(64, canonicalize(transaction))
  );
};

export const isValidCreateChainEvent = (event: TrustChainEvent) => {
  if (event.transaction.type !== "create" || event.prevHash !== null) {
    return false;
  }
  if (
    Object.keys(event.transaction.lockboxPublicKeys).length !==
    event.authors.length
  ) {
    return false;
  }
  const lockboxPublicKeys = event.transaction.lockboxPublicKeys;
  const hash = hashTransaction(event.transaction);
  return event.authors.every((author) => {
    if (!lockboxPublicKeys.hasOwnProperty(author.publicKey)) {
      return false;
    }
    return sodium.crypto_sign_verify_detached(
      sodium.from_base64(author.signature),
      hash,
      sodium.from_base64(author.publicKey)
    );
  });
};

export const areValidPermissions = (
  state: TrustChainState,
  event: DefaultTrustChainEvent,
  permission: Permission
) => {
  return event.authors.every((author) => {
    if (!state.members.hasOwnProperty(author.publicKey)) {
      return false;
    }
    if (!state.members[author.publicKey][permission]) {
      return false;
    }
    return true;
  });
};

export const allAuthorsAreValidAdmins = (
  state: TrustChainState,
  event: DefaultTrustChainEvent
) => {
  return event.authors.every((author) => {
    if (!state.members.hasOwnProperty(author.publicKey)) {
      return false;
    }
    if (!state.members[author.publicKey].isAdmin) {
      return false;
    }
    return true;
  });
};

export const getAdminCount = (state: TrustChainState) => {
  let adminCount = 0;
  Object.keys(state.members).forEach((memberKey) => {
    if (state.members[memberKey].isAdmin) {
      adminCount = adminCount + 1;
    }
  });
  return adminCount;
};

export const isValidAdminDecision = (
  state: TrustChainState,
  event: DefaultTrustChainEvent
) => {
  if (!allAuthorsAreValidAdmins(state, event as DefaultTrustChainEvent)) {
    return false;
  }
  const adminCount = getAdminCount(state);
  if (event.authors.length > adminCount / 2) {
    return true;
  }
  return false;
};
