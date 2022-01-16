import sodium from "libsodium-wrappers";
import { addAuthorToEvent } from "./addAuthorToEvent";
import { InvalidTrustChainError } from "./errors";
import { createChain, resolveState, addMember, removeMember } from "./index";
import {
  getKeyPairA,
  getKeyPairB,
  getKeyPairsA,
  getKeyPairsB,
  getKeyPairsC,
  KeyPairs,
} from "./testUtils";
import { hashTransaction } from "./utils";

let keyPairA: sodium.KeyPair = null;
let keyPairsA: KeyPairs = null;
let keyPairB: sodium.KeyPair = null;
let keyPairsB: KeyPairs = null;
let keyPairsC: KeyPairs = null;

beforeAll(async () => {
  await sodium.ready;
  keyPairA = getKeyPairA();
  keyPairsA = getKeyPairsA();
  keyPairB = getKeyPairB();
  keyPairsB = getKeyPairsB();
  keyPairsC = getKeyPairsC();
});

test("should be able to add a member as member with the permission canAddMember", async () => {
  const createEvent = createChain(keyPairsA.sign, {
    [keyPairsA.sign.publicKey]: keyPairsA.box.publicKey,
  });
  const addMemberEvent = addMember(
    hashTransaction(createEvent.transaction),
    keyPairA,
    keyPairsB.sign.publicKey,
    keyPairsB.box.publicKey,
    { isAdmin: false, canAddMembers: true, canRemoveMembers: false }
  );
  const addMemberEvent2 = addMember(
    hashTransaction(addMemberEvent.transaction),
    keyPairB,
    keyPairsC.sign.publicKey,
    keyPairsC.box.publicKey,
    { isAdmin: false, canAddMembers: false, canRemoveMembers: false }
  );
  const state = resolveState([createEvent, addMemberEvent, addMemberEvent2]);
  expect(state.members).toMatchInlineSnapshot(`
    Object {
      "74IPzs2dhoERLRuxeS7zadzEvKfb7IqOK-jKu0mQxIM": Object {
        "addedBy": Array [
          "74IPzs2dhoERLRuxeS7zadzEvKfb7IqOK-jKu0mQxIM",
        ],
        "canAddMembers": true,
        "canRemoveMembers": true,
        "isAdmin": true,
        "lockboxPublicKey": "wevxDsZ-L7wpy3ePZcQNfG8WDh0wB0d27phr5OMdLwI",
      },
      "MTDhqVIMflTD0Car-KSP1MWCIEYqs2LBaXfU20di0tY": Object {
        "addedBy": Array [
          "74IPzs2dhoERLRuxeS7zadzEvKfb7IqOK-jKu0mQxIM",
        ],
        "canAddMembers": true,
        "canRemoveMembers": false,
        "isAdmin": false,
        "lockboxPublicKey": "b_skeL8qudNQji-HuOldPNFDzYSBENNqmFMlawhtrHg",
      },
      "ZKcwjAMAaSiq7k3MQVQUZ6aa7kBreK__5hkGI4SCltk": Object {
        "addedBy": Array [
          "MTDhqVIMflTD0Car-KSP1MWCIEYqs2LBaXfU20di0tY",
        ],
        "canAddMembers": false,
        "canRemoveMembers": false,
        "isAdmin": false,
        "lockboxPublicKey": "0hUuO22MoTa8X65ZvpR9KcfUwF_B2aIvLORPjuaofBg",
      },
    }
  `);
});

test("should not be able to add a member as member without the permission canAddMember", async () => {
  const createEvent = createChain(keyPairsA.sign, {
    [keyPairsA.sign.publicKey]: keyPairsA.box.publicKey,
  });
  const addMemberEvent = addMember(
    hashTransaction(createEvent.transaction),
    keyPairA,
    keyPairsB.sign.publicKey,
    keyPairsB.box.publicKey,
    { isAdmin: false, canAddMembers: false, canRemoveMembers: false }
  );
  const addMemberEvent2 = addMember(
    hashTransaction(addMemberEvent.transaction),
    keyPairB,
    keyPairsC.sign.publicKey,
    keyPairsC.box.publicKey,
    { isAdmin: false, canAddMembers: false, canRemoveMembers: false }
  );
  const chain = [createEvent, addMemberEvent, addMemberEvent2];
  expect(() => resolveState(chain)).toThrow(InvalidTrustChainError);
  expect(() => resolveState(chain)).toThrow("Not allowed to add a member.");
});

test("should not be able to add an admin as member with the permission canAddMember", async () => {
  const createEvent = createChain(keyPairsA.sign, {
    [keyPairsA.sign.publicKey]: keyPairsA.box.publicKey,
  });
  const addMemberEvent = addMember(
    hashTransaction(createEvent.transaction),
    keyPairA,
    keyPairsB.sign.publicKey,
    keyPairsB.box.publicKey,
    { isAdmin: false, canAddMembers: true, canRemoveMembers: false }
  );
  const addMemberEvent2 = addMember(
    hashTransaction(addMemberEvent.transaction),
    keyPairB,
    keyPairsC.sign.publicKey,
    keyPairsC.box.publicKey,
    { isAdmin: true, canAddMembers: true, canRemoveMembers: true }
  );
  const chain = [createEvent, addMemberEvent, addMemberEvent2];

  expect(() => resolveState(chain)).toThrow(InvalidTrustChainError);
  expect(() => resolveState(chain)).toThrow("Not allowed to add an admin.");
});

test("should not be able to add a member with canAddMember as member with the permission canAddMember", async () => {
  const createEvent = createChain(keyPairsA.sign, {
    [keyPairsA.sign.publicKey]: keyPairsA.box.publicKey,
  });
  const addMemberEvent = addMember(
    hashTransaction(createEvent.transaction),
    keyPairA,
    keyPairsB.sign.publicKey,
    keyPairsB.box.publicKey,
    { isAdmin: false, canAddMembers: true, canRemoveMembers: false }
  );
  const addMemberEvent2 = addMember(
    hashTransaction(addMemberEvent.transaction),
    keyPairB,
    keyPairsC.sign.publicKey,
    keyPairsC.box.publicKey,
    { isAdmin: false, canAddMembers: true, canRemoveMembers: false }
  );
  const chain = [createEvent, addMemberEvent, addMemberEvent2];

  expect(() => resolveState(chain)).toThrow(InvalidTrustChainError);
  expect(() => resolveState(chain)).toThrow(
    "Not allowed to add a member with canAddMembers."
  );
});

test("should be able to add an admin as admins", async () => {
  const createEvent = createChain(keyPairsA.sign, {
    [keyPairsA.sign.publicKey]: keyPairsA.box.publicKey,
  });
  const addAdminEvent = addMember(
    hashTransaction(createEvent.transaction),
    keyPairA,
    keyPairsB.sign.publicKey,
    keyPairsB.box.publicKey,
    { isAdmin: true, canAddMembers: true, canRemoveMembers: true }
  );
  const addAdminEvent2 = addMember(
    hashTransaction(addAdminEvent.transaction),
    keyPairB,
    keyPairsC.sign.publicKey,
    keyPairsC.box.publicKey,
    { isAdmin: true, canAddMembers: true, canRemoveMembers: true }
  );
  const addAdminEvent3 = addAuthorToEvent(addAdminEvent2, keyPairB);
  const state = resolveState([createEvent, addAdminEvent, addAdminEvent3]);
  expect(state.members).toMatchInlineSnapshot(`
    Object {
      "74IPzs2dhoERLRuxeS7zadzEvKfb7IqOK-jKu0mQxIM": Object {
        "addedBy": Array [
          "74IPzs2dhoERLRuxeS7zadzEvKfb7IqOK-jKu0mQxIM",
        ],
        "canAddMembers": true,
        "canRemoveMembers": true,
        "isAdmin": true,
        "lockboxPublicKey": "wevxDsZ-L7wpy3ePZcQNfG8WDh0wB0d27phr5OMdLwI",
      },
      "MTDhqVIMflTD0Car-KSP1MWCIEYqs2LBaXfU20di0tY": Object {
        "addedBy": Array [
          "74IPzs2dhoERLRuxeS7zadzEvKfb7IqOK-jKu0mQxIM",
        ],
        "canAddMembers": true,
        "canRemoveMembers": true,
        "isAdmin": true,
        "lockboxPublicKey": "b_skeL8qudNQji-HuOldPNFDzYSBENNqmFMlawhtrHg",
      },
      "ZKcwjAMAaSiq7k3MQVQUZ6aa7kBreK__5hkGI4SCltk": Object {
        "addedBy": Array [
          "MTDhqVIMflTD0Car-KSP1MWCIEYqs2LBaXfU20di0tY",
          "MTDhqVIMflTD0Car-KSP1MWCIEYqs2LBaXfU20di0tY",
        ],
        "canAddMembers": true,
        "canRemoveMembers": true,
        "isAdmin": true,
        "lockboxPublicKey": "0hUuO22MoTa8X65ZvpR9KcfUwF_B2aIvLORPjuaofBg",
      },
    }
  `);
});

test("should not be able to add an admin if no more than 50% of admins signed the transaction", async () => {
  const createEvent = createChain(keyPairsA.sign, {
    [keyPairsA.sign.publicKey]: keyPairsA.box.publicKey,
  });
  const addAdminEvent = addMember(
    hashTransaction(createEvent.transaction),
    keyPairA,
    keyPairsB.sign.publicKey,
    keyPairsB.box.publicKey,
    { isAdmin: true, canAddMembers: true, canRemoveMembers: true }
  );
  const addAdminEvent2 = addMember(
    hashTransaction(addAdminEvent.transaction),
    keyPairB,
    keyPairsC.sign.publicKey,
    keyPairsC.box.publicKey,
    { isAdmin: true, canAddMembers: true, canRemoveMembers: true }
  );
  const chain = [createEvent, addAdminEvent, addAdminEvent2];
  expect(() => resolveState(chain)).toThrow(InvalidTrustChainError);
  expect(() => resolveState(chain)).toThrow("Not allowed to add an admin.");
});
